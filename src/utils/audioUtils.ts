import * as FileSystem from "expo-file-system";
import * as jsmediatags from "jsmediatags";
import { TagType } from "jsmediatags/types";
const base64 = require("base-64");
import { AVPlaybackStatusSuccess, Audio } from "expo-av";
import { AudioMetadata } from "../store/store";

//--=================================
//-- getAudioFileTags
//--=================================
export const getAudioFileTags = async (fileURI: string) => {
  const durationSeconds = await getAudioFileDuration(fileURI);
  // fileURI is the full path to the audio file
  // It is expected to be in the apps storage, with the "file:///" in front
  // Strip the "file:///"
  const workingURI = fileURI.slice(8);

  const tag = (await jsMediaAsync(workingURI)) as TagType;

  const metadata: AudioMetadata = {
    title: tag.tags.title,
    artist: tag.tags.artist,
    album: tag.tags.album,
    genre: tag.tags.genre,
    durationSeconds: durationSeconds,
    pictureURI: undefined,
  };
  if (tag.tags.picture) {
    const pictureData = tag.tags.picture.data;
    try {
      const base64String = base64.encode(String.fromCharCode(...pictureData));
      const uri = `data:${tag.tags.picture.format};base64,${base64String}`;
      metadata.pictureURI = uri;
      // updateBase64Image(uri);
    } catch (err) {
      console.log("ERROR GETTING IMAE");
    }
  }
  return metadata;
};

//--=================================
//-- getAudioFileDuration
//--=================================
export const getAudioFileDuration = async (fileURI: string) => {
  const soundObj = new Audio.Sound();
  await soundObj.loadAsync({ uri: `${fileURI}` });
  const metadata = (await soundObj.getStatusAsync()) as AVPlaybackStatusSuccess;
  const durationSeconds = metadata.durationMillis
    ? metadata.durationMillis / 1000
    : 0;
  await soundObj.unloadAsync();
  return durationSeconds;
};

/**
 * Making the jsmediatags library async/await compatible
 * @param path
 * @returns
 */
export const jsMediaAsync = async (path: string) => {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(path).read({
      onSuccess: (tag) => {
        console.log("Success!");
        resolve(tag);
      },
      onError: (error) => {
        console.log("Error");
        reject(error);
      },
    });
  });
};
