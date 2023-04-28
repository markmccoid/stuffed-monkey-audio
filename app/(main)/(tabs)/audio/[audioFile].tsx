import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useNavigation, useSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import TrackPlayer, { State } from "react-native-track-player";
import { TouchableOpacity } from "react-native-gesture-handler";

const AudioFile = () => {
  const [playerState, setPlayerState] = useState<State>();
  const [isPlaying, setIsPlaying] = useState(false);
  const params = useSearchParams();
  const fileName = params.audioFile as string;

  const addTrack = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: "1",
      url: `${FileSystem.documentDirectory}${fileName}`,
      title: "My Title",
      album: "My Album",
      artist: "Rohan Bhatia",
      artwork: "https://picsum.photos/100",
    });
  };

  useEffect(() => {
    const setupPlayer = async () => {
      await addTrack();
    };
    setupPlayer();
    return () => {
      TrackPlayer.pause();
    };
  }, [fileName]);
  // const getPlayerState = async () => {
  //   const state = await TrackPlayer.getState();
  //   setPlayerState(state);
  // };
  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
  };

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
