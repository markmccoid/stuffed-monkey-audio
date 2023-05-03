import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useNavigation, useSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import TrackPlayer, { State } from "react-native-track-player";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Audio } from "expo-av";

const AudioFile = () => {
  const [playerState, setPlayerState] = useState<State>();
  const [playbackState, setPlaybackState] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const params = useSearchParams();
  const fileName = params.audioFile as string;
  const soundObjectRef = useRef(new Audio.Sound()).current;

  const cleanUpSoundObject = async () => {
    await soundObjectRef.unloadAsync();
  };
  useEffect(() => {
    return () => {
      cleanUpSoundObject();
    };
  }, []);
  const onButtonPressed = async () => {
    // const soundObject = new Audio.Sound();
    setIsPlaying(true);
    const status = await soundObjectRef.loadAsync(
      {
        uri: `${FileSystem.documentDirectory}${fileName}`,
      },
      { shouldPlay: true }
    );
    soundObjectRef.setOnPlaybackStatusUpdate((status) =>
      setPlaybackState(status)
    );
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
      <Stack.Screen options={{ title: fileName }} />
      <Text>{fileName}</Text>
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
