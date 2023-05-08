import { create } from "zustand";
import uuid from "react-native-uuid";
import { getAudioFileTags } from "../utils/audioUtils";
import { loadFromAsyncStorage, saveToAsyncStorage } from "./data/asyncStorage";
import { deleteFromFileSystem } from "./data/fileSystemAccess";
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

/**
 *
 */
export const onInitialize = async () => {
  const tracks = await loadFromAsyncStorage("tracks");
  if (tracks) {
    useTracksStore.setState({ tracks });
  }
  console.log("store updates", useTracksStore.getState().tracks.length);
  return;
};
