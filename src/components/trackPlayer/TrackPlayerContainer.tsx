import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import {
  AudioTrack,
  usePlaylistStore,
  useTracksStore,
} from "../../../src/store/store";
import { PlayIcon, PauseIcon } from "../common/svg/Icons";

import TrackSlider from "./TrackSlider";

type Props = {
  track: AudioTrack;
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
const TrackPlayerContainer = ({ track }: Props) => {
  const soundActions = usePlaylistStore((state) => state.actions);
  const isPlaying = usePlaylistStore((state) => state.playbackState.isPlaying);
  const isLoaded = usePlaylistStore((state) => state.playbackState.isLoaded);

  //-- LOADS passed track sound
  //-- and inits Store, but does not start playing
  useEffect(() => {
    soundActions.loadSoundFile(track.fileURI);
    return () => {
      soundActions.unloadSoundFile();
    };
  }, []);

  const play = async () => {
    await soundActions.play();
  };
  const pause = async () => {
    soundActions.pause();
  };

  return (
    <View style={styles.container}>
      <Text>{track.filename}</Text>
      <TouchableOpacity
        onPress={() => console.log("PLAY BUTTON")}
        style={styles.actionButton}
      >
        <View>{!isPlaying ? <PlayIcon /> : <PauseIcon />}</View>
      </TouchableOpacity>
      <View className="p-2 border border-amber-800">
        <TouchableOpacity
          onPress={isLoaded && isPlaying ? () => pause() : () => play()}
        >
          <Text>{isLoaded && isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
      </View>
      <View className="">
        <TrackSlider />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
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
export default TrackPlayerContainer;
