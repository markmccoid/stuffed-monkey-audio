import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, useNavigation, useSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import TrackPlayer, { State } from "react-native-track-player";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import { AudioTrack, useTracksStore } from "../../../../src/store/store";

const AudioFile = () => {
  const [playerState, setPlayerState] = useState<State>();
  const [playbackState, setPlaybackState] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const params = useSearchParams();
  const id = params.audioFile as string;
  const soundObjectRef = useRef(new Audio.Sound()).current;
  const tracks = useTracksStore((state) => state.tracks);

  const [soundIsLoading, setSoundIsLoading] = useState(false);
  const { fileURI, filename } = useMemo(
    () => tracks.find((el) => el.id === id),
    [id]
  ) as AudioTrack;

  const cleanUpSoundObject = async () => {
    await soundObjectRef.unloadAsync();
  };
  useEffect(() => {
    return () => {
      cleanUpSoundObject();
    };
  }, []);
  const onButtonPressed = async () => {
    console.log("SOUND IS LOADING", soundIsLoading);
    if (soundIsLoading) return;
    const currStatus = await soundObjectRef.getStatusAsync();

    /**
     * Two status's to deal with
     * - isLoaded
     * - isPlaying
     * If NOT loaded, the "loadAsync"
     * If loaded but NOT playing then resume
     * IF loaded but Playing the pause
     */
    if (!currStatus.isLoaded) {
      try {
        setSoundIsLoading(true);
        await soundObjectRef.loadAsync(
          {
            uri: fileURI,
          },
          { shouldPlay: true }
        );
      } catch (e) {
        console.log("Error Loading Sound", e);
      } finally {
        setSoundIsLoading(false);
      }
    } else if (currStatus.isPlaying) {
      await soundObjectRef.pauseAsync();
    } else if (!currStatus.isPlaying) {
      await soundObjectRef.playAsync();
    }

    // soundObjectRef.setOnPlaybackStatusUpdate((status) =>
    //   setPlaybackState(status)
    // );
    // await soundObject.setVolumeAsync(1);
    // console.log("status", status);

    // const x = await soundObject.playAsync();
    // console.log("X", x);
    //!! TrackPlayer Code below
    // if (!isPlaying) {
    //   TrackPlayer.play();
    //   setIsPlaying(true);
    // } else {
    //   TrackPlayer.pause();
    //   setIsPlaying(false);
    // }
  };

  useEffect(() => {
    console.log(playbackState);
  }, [playbackState]);
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: filename }} />
      <Text>{filename}</Text>
      <TouchableOpacity onPress={onButtonPressed} style={styles.actionButton}>
        <Text>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  actionButton: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 5,
  },
});
export default AudioFile;
