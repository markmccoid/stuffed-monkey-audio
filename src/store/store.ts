import { create } from "zustand";
import uuid from "react-native-uuid";
import { getAudioFileTags } from "../utils/audioUtils";
import {
  loadFromAsyncStorage,
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from "./data/asyncStorage";
import { deleteFromFileSystem } from "./data/fileSystemAccess";
import { AVPlaybackStatus, Audio, InterruptionModeIOS } from "expo-av";
import { FileEntry } from "../utils/dropboxUtils";
import { analyzePlaylistTracks } from "./storeUtils";
import { sortBy } from "lodash";
const defaultImage = require("../../assets/images/splash.png");

export type Playlist = {
  id: string;
  name: string;
  author: string;
  imageURI: string | undefined;
  totalDurationSeconds: number;
  trackIds?: string[];
  currentPosition?: { trackId: string; position: number };
  currentRate: number;
};
export type AudioTrack = {
  id: string;
  // Full path to the file
  fileURI: string;
  filename: string;
  directory: string;
  sourceLocation: string;
  metadata?: AudioMetadata;
};
export type AudioMetadata = {
  title?: string;
  album?: string;
  artist?: string;
  genre?: string;
  durationSeconds?: number;
  pictureURI?: string;
};

type AudioState = {
  tracks: AudioTrack[];
  playlists: Playlist[];
  actions: {
    // given the audio file location in storage, look up metadata and create
    // record in AudioState.audioFiles store array
    addNewTrack: (
      fileURI: string,
      filename: string,
      sourceLocation: string,
      playlistId?: string,
      directory?: string
    ) => void;
    // given passed id of audioFile, remove it from list AND Delete it from FileSystem storage
    removeTracks: (ids: string[]) => Promise<void>;
    // Will take an array of files (FileEntry[]) and see if that track has already been downloaded
    // to the "tracks" array.  Returns the same array with a "alreadyDownload" key set to true or false
    isTrackDownloaded: (tracksToCheck: FileEntry[]) => FileEntry[];
    // creates playlist with the passed name and returns the playlistId
    addNewPlaylist: (
      title: string,
      author?: string,
      playlistId?: string
    ) => Promise<string>;
    // Add track(s) to playlist ID
    addTracksToPlaylist: (
      playlistId: string,
      trackIds: string[]
    ) => Promise<void>;
    removePlaylist: (playlistId: string, removeAllTracks?: boolean) => void;
    getPlaylist: (playlistId: string) => Playlist | undefined;
    getTrack: (trackId: string) => AudioTrack | undefined;
    clearAll: () => Promise<void>;
  };
};

export const useTracksStore = create<AudioState>((set, get) => ({
  tracks: [],
  playlists: [],
  actions: {
    addNewTrack: async (
      fileURI,
      filename,
      sourceLocation,
      playlistId = undefined,
      directory = ""
    ) => {
      // Get metadata for passed audio file
      const tags = await getAudioFileTags(fileURI);

      const id = `${directory}${filename}`;
      const newAudioFile = {
        id,
        fileURI,
        directory,
        filename,
        sourceLocation,
        metadata: { ...tags },
      };
      // Right now we do NOT allow any duplicate files (dir/filename)
      // remove the file ONLY FROM STORE if it exists.  By the time we are in the store
      // it has already been saved and that is fine.
      const filteredList = get().tracks.filter((el) => el.id !== id);

      // Add the new track to current track list
      const newAudioFileList = [...filteredList, newAudioFile];
      set({ tracks: newAudioFileList });

      //! -- When a new track is added, we need to get the title and author
      //!    information.  This will be our Playlist name
      /**
       * PLAYLIST
       *  - id - uuid
       *  - title
       *  - author
       *  - tracks: []
       *  - currentTrack - trackId
       */
      // If no playlist ID passed, then assume single download and create new playlist
      // and add track

      const plName =
        newAudioFile.metadata?.album ||
        newAudioFile.metadata?.title ||
        newAudioFile.filename;
      const plAuthor = newAudioFile.metadata?.artist || "Unknown";
      const finalPlaylistId = await get().actions.addNewPlaylist(
        plName,
        plAuthor,
        playlistId
      );
      await get().actions.addTracksToPlaylist(finalPlaylistId, [
        newAudioFile.id,
      ]);

      await saveToAsyncStorage("tracks", newAudioFileList);
    },
    removeTracks: async (ids) => {
      // Use passed id to do the following:
      // - lookup audioFile information in audioFiles array
      // - delete the file from FileSystem storage
      // - remove the file information from the audioFiles Array
      //   creating a new array of audioFiles.  Save this new array
      //   to asyncStorage AND then update the AudioStore.audioFiles
      // track to delete
      // loop and delete each file from the system and return an array
      // of promises to remove from async storage
      let newTracks = get().tracks;
      const deletePromises = ids.map(async (id) => {
        // store trackToDelete's info
        const trackToDelete = get().tracks.find((el) => el.id === id);
        // Delete from store
        newTracks = newTracks.filter((el) => el.id !== id);
        // return a promise
        return await deleteFromFileSystem(trackToDelete?.fileURI);
      });
      await Promise.all(deletePromises);
      await saveToAsyncStorage("tracks", newTracks);
      set((state) => ({ ...state, tracks: newTracks }));
    },
    isTrackDownloaded: (tracksToCheck) => {
      const sourceArray = get().tracks.map((el) => el.sourceLocation);
      let taggedFiles = [];
      if (Array.isArray(tracksToCheck)) {
        for (const source of tracksToCheck) {
          const isDownloaded = sourceArray.includes(source.path_lower);
          taggedFiles.push({ ...source, alreadyDownload: isDownloaded });
        }
      }

      return taggedFiles;
    },
    addNewPlaylist: async (name, author = "Unknown", playlistId) => {
      const playlists = [...get().playlists];
      // If playlist ID is passed, check to see if the playlist exists
      if (playlistId) {
        if (playlists.findIndex((el) => el.id === playlistId) !== -1) {
          return playlistId;
        }
      }

      // the "name" passed will be the album of the track that is going to be added
      // Check all of the existing playlists to see if one has the same name
      // If so, then return that id otherwise create a new playlist and return that id
      for (const playlist of playlists) {
        if (playlist.name === name) {
          return playlist.id;
        }
      }
      // No existing playlist found, create a new one based either on
      // the passed in playlistId OR if not passed, create a new id
      const id = playlistId || (uuid.v4() as string);
      const newPlaylist: Playlist = {
        id,
        name,
        author,
        imageURI: undefined,
        totalDurationSeconds: 0,
        currentRate: 1,
      };
      const newPlaylistArray = [newPlaylist, ...get().playlists];
      set({ playlists: newPlaylistArray });
      await saveToAsyncStorage("playlists", newPlaylistArray);
      return id;
    },
    addTracksToPlaylist: async (playlistId, tracks) => {
      const playlists = [...get().playlists];
      const storedTracks = [...get().tracks];

      // console.log("ADD TRACK TO PL", playlistId, tracks);
      for (let playlist of playlists) {
        if (playlist.id === playlistId) {
          // Take the tracks being added and merge them with existing tracks
          // in playlist.  Get rid of dups.
          const uniqueTracksPlaylist = [
            ...new Set([...tracks, ...(playlist.trackIds || [])]),
          ];
          const { images, totalDuration } = analyzePlaylistTracks(
            storedTracks,
            uniqueTracksPlaylist
          );
          playlist.imageURI = images[0];
          playlist.totalDurationSeconds = totalDuration;
          playlist.trackIds = sortBy(uniqueTracksPlaylist);
          // Once we find our playlist, exit
          break;
        }
      }
      // Update playlists in Store and Async Storage
      set({ playlists });
      await saveToAsyncStorage("playlists", playlists);
    },
    //! If removeAllTracks = false, then need to only delete tracks that only
    //! exist in this playlist.  i.e. need to check all other playlists OR
    //! Have a a playlist Id array in each track.
    removePlaylist: async (playlistId, removeAllTracks = true) => {
      const playlistToDelete = get().playlists.find(
        (el) => el.id === playlistId
      );
      if (removeAllTracks && playlistToDelete?.trackIds) {
        const x = await get().actions.removeTracks(playlistToDelete.trackIds);
      }
      const updatedPlayList = get().playlists.filter(
        (el) => el.id !== playlistId
      );
      set({ playlists: updatedPlayList });
      await await saveToAsyncStorage("playlists", updatedPlayList);
    },
    getPlaylist: (playlistId) => {
      return get().playlists.find((el) => el.id === playlistId);
    },
    getTrack: (trackId) => {
      return get().tracks.find((el) => el.id === trackId);
    },
    clearAll: async () => {
      set({ tracks: [], playlists: [] });
      await removeFromAsyncStorage("tracks");
      await removeFromAsyncStorage("playlists");
    },
  },
}));

export const useTrackActions = () => useTracksStore((state) => state.actions);

//~- ====================================================
//~- Current Playlist Playback
//~- ====================================================

type PlaybackState = {
  isLoaded: boolean;
  playbackObj?: Audio.Sound;
  positionSeconds?: number;
  durationSeconds?: number;
  isPlaying?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  rate?: number;
  shouldCorrectPitch?: boolean;
  volume?: number;
};

type PlaybackStoreState = {
  playbackObj?: Audio.Sound;
  playbackState: PlaybackState;
  playbackError?: string;
  currentPlaylist?: Playlist;
  currentTrack?: AudioTrack;
  currentPosition?: number;
  shouldLoadNextTrack: boolean;
  actions: {
    //- Loads the playlist information to the playback store.
    //- loading the current track indicated in the playlist
    loadPlaylist: (playlistId: string) => Promise<boolean>;
    loadNextTrack: () => Promise<void>;
    loadSoundFile: (fileURI: string) => Promise<void>;
    setPositionSeconds: (positionInSeconds: number) => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    // if viewOnly == true, then JUST update currentPosition and don't set the position of player
    // This allows visual numbers to change before final determination
    updatePosition: (newPosition: number, viewOnly?: boolean) => Promise<void>;
    jumpForward: (forwardSeconds: number) => Promise<void>;
    //! This function should not only unload the sound file, but FIRST
    //! it should update the playlist with the currentPosition, etx
    unloadSoundFile: () => Promise<void>;
    unloadPlaylist: () => Promise<void>;
  };
};

const clearPlayback = {
  playbackObj: undefined,
  playbackState: { isLoaded: false },
  playbackError: undefined,
  currentPosition: 0,
  shouldLoadNextTrack: false,
};
export const usePlaybackStore = create<PlaybackStoreState>((set, get) => ({
  playbackObj: undefined,
  playbackState: { isLoaded: false },
  playbackError: undefined,
  currentPlaylist: undefined,
  currentTrack: undefined,
  currentPosition: 0,
  shouldLoadNextTrack: false,
  actions: {
    loadPlaylist: async (playlistId: string) => {
      const trackActions = useTracksStore.getState().actions;
      const playlist = trackActions.getPlaylist(playlistId);
      // Each playlist stores the current track/position
      // pull that info
      const position = playlist?.currentPosition?.position || 0;
      const trackId =
        playlist?.currentPosition?.trackId || playlist?.trackIds[0];
      console.log("TRACKID - POS->", trackId, position);

      const track = trackActions.getTrack(trackId);
      if (!track?.fileURI) return false;
      await get().actions.loadSoundFile(track?.fileURI);
      console.log("loadedSoundFile", trackId);
      await get().actions.setPositionSeconds(position);
      // Update the PlaybackObject with our current location
      set({
        currentPosition: position,
        currentTrack: track,
        currentPlaylist: playlist,
      });
      return true;
    },
    loadNextTrack: async () => {
      set({ shouldLoadNextTrack: false });
      // load next track
      let currPlaylist = usePlaybackStore.getState().currentPlaylist;
      let currTrack = usePlaybackStore.getState().currentTrack?.id;
      // Bail is not playlist or track
      if (!currPlaylist?.trackIds || !currTrack)
        throw new Error("PlaybackStore-LoadNextTrack no playlist or track");
      const tracks = currPlaylist.trackIds || [];
      const currIndex = tracks?.findIndex((el) => el === currTrack);
      // if our currIndex is less the number of tracks than advance to next track
      let nextTrack: AudioTrack | undefined;
      await get().actions.unloadSoundFile();
      if (currIndex < tracks.length - 1) {
        nextTrack = useTracksStore
          .getState()
          .actions.getTrack(currPlaylist?.trackIds[currIndex + 1] || currTrack);
        usePlaybackStore.setState((state) => ({
          currentTrack: nextTrack,
          currentPosition: 0,
        }));
      } else {
        nextTrack = useTracksStore
          .getState()
          .actions.getTrack(currPlaylist?.trackIds[0] || currTrack);
        usePlaybackStore.setState((state) => ({
          currentTrack: nextTrack,
          currentPosition: 0,
        }));
      }
      if (!nextTrack?.fileURI) return;
      await get().actions.loadSoundFile(nextTrack?.fileURI);
      // console.log("loadedSoundFile", nextTrack.id);
      await get().actions.setPositionSeconds(0);
      await get().actions.play();

      console.log("Finished track", get().currentPlaylist?.trackIds);
    },
    loadSoundFile: async (fileURI, shouldPlay = false) => {
      set({ playbackObj: new Audio.Sound() });
      const playbackObj = get().playbackObj;
      // If there was an error create playbackObj then bail
      if (!playbackObj) return;
      try {
        await playbackObj.loadAsync({ uri: fileURI }, { shouldPlay: false });
        playbackObj.setOnPlaybackStatusUpdate((status) =>
          handlePlaybackState(playbackObj, status)
        );
        // Update every second
        playbackObj.setProgressUpdateIntervalAsync(1000);
      } catch (e) {
        console.log("Error Loading Sound in Store", e);
      }
    },
    setPositionSeconds: async (positionInSeconds) => {
      const playbackObj = get().playbackObj;
      playbackObj?.setPositionAsync(positionInSeconds * 1000);
    },
    play: async () => {
      const playbackObj = get().playbackObj;
      if (!playbackObj) {
        console.log("PLAY ERROR, NO PLAYBACK OBJ");
        return;
      }
      await playbackObj.playAsync();
    },
    pause: async () => {
      const playbackObj = get().playbackObj;
      if (!playbackObj) return;
      await playbackObj.pauseAsync();
    },
    updatePosition: async (newPosition, viewOnly = false) => {
      const playbackObj = get().playbackObj;

      set({ currentPosition: newPosition });
      // If we just wanted to update the currentPosition prop, then exit
      // This is used when sliding the slider, we don't update the real
      // position when done, but while sliding we want the position to show the updated #
      if (viewOnly) return;
      // seeking done, now playh
      await playbackObj?.setPositionAsync(newPosition * 1000);
      await playbackObj?.playAsync();
    },
    jumpForward: async (forwardSeconds) => {
      //! Check if jumping forward x seconds will take us past the end of the current track.
      //! If so, see if there is a next track.  If so, load that track and start it from beginning?
      //! NOTE: Not check for the above seems to work fine, since the status forces it to go to the next track
      //!  going back will have to handle moving to previous track.
      const positionMillis =
        ((get().currentPosition || 0) + forwardSeconds) * 1000;
      const playbackObj = get().playbackObj;
      // await playbackObj?.pauseAsync();
      await playbackObj?.setStatusAsync({ positionMillis });

      // await playbackObj?.playAsync();
      // set((state) => ({
      //   currentPosition: (state.currentPosition || 0) + forwardSeconds,
      // }));
    },
    unloadSoundFile: async () => {
      const playbackObj = get().playbackObj;
      if (playbackObj) {
        await playbackObj.unloadAsync();
      }
      // set({ ...clearPlayback });
    },
    unloadPlaylist: async () => {
      // update playlist value for current track and position in track.
      await get().actions.unloadSoundFile();
      // Clear all data from playback store
      // set({
      //   ...clearPlayback,
      //   currentPlaylist: undefined,
      //   currentTrack: undefined,
      // });
    },
  },
}));

//~ -----------
//~ Called every 1000ms
//~ -----------
function handlePlaybackState(sound: Audio.Sound, status: AVPlaybackStatus) {
  if (!status.isLoaded) {
    usePlaybackStore.setState((state) => ({
      playbackState: { isLoaded: false },
    }));
    usePlaybackStore.setState((state) => ({ playbackError: status.error }));
    return;
  }
  // Get curr playlist and trackID
  let currPlaylist = usePlaybackStore.getState().currentPlaylist;
  let currTrack = usePlaybackStore.getState().currentTrack?.id;
  if (!currPlaylist || !currTrack)
    throw new Error("Error in handlePlayback state, no track or no playlist");
  const durationSeconds = status?.durationMillis
    ? Math.floor(status.durationMillis / 1000)
    : 0;
  const currentPosition = Math.floor(status.positionMillis / 1000);
  // CHeck if we are done with this track
  if (status?.durationMillis === status.positionMillis) {
    //load next track
    usePlaybackStore.setState({ shouldLoadNextTrack: true });
    console.log(
      "STORE Set ShouldLoadNext",
      usePlaybackStore.getState().shouldLoadNextTrack
    );
  }
  // update playback state and currentPosition

  usePlaybackStore.setState((state) => ({
    currentPosition,
    playbackState: {
      isLoaded: status.isLoaded,
      playbackObj: sound,
      durationSeconds,
      isPlaying: status.isPlaying,
      isLooping: status.isLooping,
      isMuted: status.isMuted,
      rate: status.rate,
      shouldCorrectPitch: status.shouldCorrectPitch,
      volume: status.volume,
    },
  }));

  if (currPlaylist && currTrack) {
    currPlaylist.currentPosition = {
      trackId: currTrack,
      position: status.positionMillis / 1000,
    };
    let newPlaylists = useTracksStore
      .getState()
      .playlists.filter((el) => el.id !== currPlaylist?.id);
    newPlaylists = [...newPlaylists, currPlaylist];
    useTracksStore.setState((state) => ({
      playlists: newPlaylists,
    }));
  }
}

/**
 * ON INITIALIZE
 */
export const onInitialize = async () => {
  const tracks = await loadFromAsyncStorage("tracks");
  const playlists = await loadFromAsyncStorage("playlists");

  useTracksStore.setState({ tracks: tracks || [], playlists: playlists || [] });
  // useTracksStore.setState({ tracks: [], playlists: [] });

  console.log("store updates Tracks", useTracksStore.getState().tracks.length);
  console.log(
    "store updates Playlists",
    useTracksStore.getState().playlists.length,
    useTracksStore.getState().playlists.map((id) => `${id.id}-${id.title}`)
  );
  //-- Initialize expo-av Audio session to play in background
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
    staysActiveInBackground: true,
  });

  return;
};
