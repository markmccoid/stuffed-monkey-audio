import { create } from "zustand";
import uuid from "react-native-uuid";
export type AudioFile = {
  id: string;
  filename: string;
  directory: string;
  metaData?: AudioMetadata;
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
  audioFiles: AudioFile[];
  // load audio file data from async storage
  loadAudiosInformation: () => void;
  // given the audio file location in storage, look up metadata and create
  // record in AudioState.audioFiles store array
  addNewAudio: (directory: string, filename: string) => void;
  // given passed id of audioFile, remove it from list AND Delete it from FileSystem storage
  removeAudio: (id: string) => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  audioFiles: [],
  loadAudiosInformation: async () => {},
  addNewAudio: async (directory, filename) => {
    // Get metadata for passed audio file
    console.log("AUDIO FILE");
    const newAudioFile = { id: uuid.v4() as string, directory, filename };
    console.log("AUDIO FILE ADDED", newAudioFile);
    set((state) => ({
      ...state,
      audioFiles: [...state.audioFiles, newAudioFile],
    }));
  },
  removeAudio: async (id) => {
    // Use passed id to do the following:
    // - lookup audioFile information in audioFiles array
    // - delete the file from FileSystem storage
    // - remove the file information from the audioFiles Array
    //   creating a new array of audioFiles.  Save this new array
    //   to asyncStorage AND then update the AudioStore.audioFiles
  },
}));
