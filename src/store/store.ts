import { create } from "zustand";
import uuid from "react-native-uuid";
import { getAudioFileTags } from "../utils/audioUtils";
import { loadFromAsyncStorage, saveToAsyncStorage } from "./data/asyncStorage";
import { deleteFromFileSystem } from "./data/fileSystemAccess";
import { AVPlaybackStatus, Audio, InterruptionModeIOS } from "expo-av";

export type AudioTrack = {
  id: string;
  // Full path to the file
  fileURI: string;
  filename: string;
  directory: string;
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
  actions: {
    // given the audio file location in storage, look up metadata and create
    // record in AudioState.audioFiles store array
    addNewTrack: (
      fileURI: string,
      filename: string,
      directory?: string
    ) => void;
    // given passed id of audioFile, remove it from list AND Delete it from FileSystem storage
    removeTrack: (id: string) => void;
  };
};

export const useTracksStore = create<AudioState>((set, get) => ({
  tracks: [],
  actions: {
    addNewTrack: async (fileURI, filename, directory = "") => {
      // Get metadata for passed audio file
      const tags = await getAudioFileTags(fileURI);

      const id = `${directory}${filename}`;
      const newAudioFile = {
        id,
        fileURI,
        directory,
        filename,
        metadata: { ...tags },
      };
      // Right now we do NOT allow any duplicate files (dir/filename)
      // remove the file ONLY FROM STORE if it exists.  By the time we are in the store
      // it has already been saved and that is fine.
      const filteredList = get().tracks.filter((el) => el.id !== id);

      // Add new track to current list
      const newAudioFileList = [...filteredList, newAudioFile];
      set({ tracks: newAudioFileList });
      // set((state) => ({
      //   ...state,
      //   audioFiles: [...state.audioFiles, newAudioFile],
      // }));
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
  },
}));

export const useTrackActions = () => useTracksStore((state) => state.actions);

//~- ====================================================
//~- Current Playlist Playback
//~- ====================================================
type Playlist = {
  toBeDetermined: string;
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

type PlaylistState = {
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
export const usePlaylistStore = create<PlaylistState>((set, get) => ({
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
    usePlaylistStore.setState((state) => ({
      playbackState: { isLoaded: false },
    }));
    usePlaylistStore.setState((state) => ({ playbackError: status.error }));
    return;
  }
  const durationSeconds = status?.durationMillis
    ? status.durationMillis / 1000
    : 0;
  usePlaylistStore.setState((state) => ({
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
  if (tracks) {
    useTracksStore.setState({ tracks });
  }
  console.log("store updates", useTracksStore.getState().tracks.length);
  //-- Initialize expo-av Audio session to play in background
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
    staysActiveInBackground: true,
  });

  return;
};
