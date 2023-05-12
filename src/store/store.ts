import { create } from "zustand";
import uuid from "react-native-uuid";
import { getAudioFileTags } from "../utils/audioUtils";
import { loadFromAsyncStorage, saveToAsyncStorage } from "./data/asyncStorage";
import { deleteFromFileSystem } from "./data/fileSystemAccess";
import { AVPlaybackStatus, Audio, InterruptionModeIOS } from "expo-av";
import { FileEntry } from "../utils/dropboxUtils";

export type AudioTrack = {
  id: string;
  // Full path to the file
  fileURI: string;
  filename: string;
  directory: string;
  sourceLocation: string;
  currentPosition: number;
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
    removeTrack: (id: string) => void;
    // Will take an array of files (FileEntry[]) and see if that track has already been downloaded
    // to the "tracks" array.  Returns the same array with a "alreadyDownload" key set to true or false
    isTrackDownloaded: (tracksToCheck: FileEntry[]) => FileEntry[];
    // creates playlist with the passed name and returns the playlistId
    addNewPlaylist: (title: string, author?: string) => Promise<string>;
    // Add track(s) to playlist ID
    addTracksToPlaylist: (playlistId: string, trackIds: string[]) => void;
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
        currentPosition: 0,
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
      if (!playlistId) {
        const plTitle = newAudioFile.metadata?.title || newAudioFile.filename;
        const plAuthor = newAudioFile.metadata?.artist || "Unknown";
        const playlistId = get().actions.addNewPlaylist(plTitle, plAuthor);
      }

      await saveToAsyncStorage("tracks", newAudioFileList);
    },
    removeTrack: async (id) => {
      // Use passed id to do the following:
      // - lookup audioFile information in audioFiles array
      // - delete the file from FileSystem storage
      // - remove the file information from the audioFiles Array
      //   creating a new array of audioFiles.  Save this new array
      //   to asyncStorage AND then update the AudioStore.audioFiles
      // track to delete
      const trackToDelete = get().tracks.find((el) => el.id === id);
      await deleteFromFileSystem(trackToDelete?.fileURI);
      // Remove track from track array
      const newTracks = get().tracks.filter((el) => el.id !== id);
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
    addNewPlaylist: async (title, author = "Unknown") => {
      // Create new id
      const id = uuid.v4() as string;
      const newPlaylist: Playlist = {
        id,
        title,
        author,
      };
      const newPlaylistArray = [newPlaylist, ...get().playlists];
      set({ playlists: newPlaylistArray });
      await saveToAsyncStorage("playlists", newPlaylistArray);
      return id;
    },
    addTracksToPlaylist: (playlistId, tracks) => {
      const playlists = get().playlists;
      for (let playlist of playlists) {
        if (playlist.id === playlistId) {
          playlist.trackIds = playlist.trackIds
            ? [...playlist.trackIds, ...tracks]
            : tracks;
          // Once we find our playlist, exit
          break;
        }
      }
    },
  },
}));

export const useTrackActions = () => useTracksStore((state) => state.actions);

//~- ====================================================
//~- Current Playlist Playback
//~- ====================================================
type Playlist = {
  id: string;
  title: string;
  author: string;
  trackIds?: string[];
  currentTrackId?: string;
};

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
  actions: {
    loadSoundFile: (fileURI: string) => void;
    play: () => void;
    pause: () => void;
    // if viewOnly == true, then JUST update currentPosition and don't set the position of player
    // This allows visual numbers to change before final determination
    updatePosition: (newPosition: number, viewOnly?: boolean) => void;
    unloadSoundFile: () => void;
  };
};
export const usePlaybackStore = create<PlaybackStoreState>((set, get) => ({
  playbackObj: undefined,
  playbackState: { isLoaded: false },
  playbackError: undefined,
  currentPlaylist: undefined,
  currentTrack: undefined,
  currentPosition: 0,
  actions: {
    loadSoundFile: async (fileURI) => {
      set({ playbackObj: new Audio.Sound() });
      const playbackObj = get().playbackObj;
      // If there was an error create playbackObj then bail
      if (!playbackObj) return;
      try {
        await playbackObj.loadAsync({ uri: fileURI }, { shouldPlay: false });
        playbackObj.setOnPlaybackStatusUpdate((status) =>
          handlePlaybackState(playbackObj, status)
        );
      } catch (e) {
        console.log("Error Loading Sound in Store", e);
      }
    },
    play: async () => {
      const playbackObj = get().playbackObj;
      if (!playbackObj) return;
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
      if (viewOnly) return;
      // seeking done, now playh
      await playbackObj?.setPositionAsync(newPosition * 1000);
      await playbackObj?.playAsync();
    },
    unloadSoundFile: async () => {
      const playbackObj = get().playbackObj;
      if (!playbackObj) return;
      await playbackObj.unloadAsync();
    },
  },
}));

//~ -----------
//~ Called every 500ms
//~ -----------
function handlePlaybackState(sound: Audio.Sound, status: AVPlaybackStatus) {
  if (!status.isLoaded) {
    usePlaybackStore.setState((state) => ({
      playbackState: { isLoaded: false },
    }));
    usePlaybackStore.setState((state) => ({ playbackError: status.error }));
    return;
  }
  const durationSeconds = status?.durationMillis
    ? status.durationMillis / 1000
    : 0;
  usePlaybackStore.setState((state) => ({
    currentPosition: status.positionMillis / 1000,
    playbackState: {
      isLoaded: status.isLoaded,
      playbackObj: sound,
      // positionSeconds: status.positionMillis / 1000,
      durationSeconds,
      isPlaying: status.isPlaying,
      isLooping: status.isLooping,
      isMuted: status.isMuted,
      rate: status.rate,
      shouldCorrectPitch: status.shouldCorrectPitch,
      volume: status.volume,
    },
  }));
}

/**
 * ON INITIALIZE
 */
export const onInitialize = async () => {
  const tracks = await loadFromAsyncStorage("tracks");
  const playlists = await loadFromAsyncStorage("playlists");

  useTracksStore.setState({ tracks: tracks || [], playlists: playlists || [] });

  console.log("store updates Tracks", useTracksStore.getState().tracks.length);
  console.log(
    "store updates Playlists",
    useTracksStore.getState().playlists.length
  );
  //-- Initialize expo-av Audio session to play in background
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
    staysActiveInBackground: true,
  });

  return;
};
