import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import { AudioTrack, useTracksStore } from "../../../src/store/store";
import { PlayIcon, PauseIcon } from "../common/svg/Icons";
import Slider from "@react-native-community/slider";

type Props = {
  track: AudioTrack;
};
const TrackPlayerContainer = ({ track }: Props) => {
  const [playerState, setPlayerState] = useState<State>();
  const [playbackState, setPlaybackState] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundObjectRef = useRef(new Audio.Sound()).current;

  const [position, setPosition] = useState(0);

  const [soundIsLoading, setSoundIsLoading] = useState(false);

  const cleanUpSoundObject = async () => {
    await soundObjectRef.unloadAsync();
  };

  useEffect(() => {
    return () => {
      cleanUpSoundObject();
    };
  }, []);

  useEffect(() => {
    const updatePlaybackStatus = (status) => {
      console.log("STATUS", status);
      setPosition((status.positionMillis || 0) / 1000);
    };
    if (soundObjectRef) {
      soundObjectRef.setOnPlaybackStatusUpdate(updatePlaybackStatus);
    }
  }, [soundObjectRef]);
  const onButtonPressed = async () => {
    console.log("SOUND IS LOADING", soundIsLoading);
    console.log("FILE URI", track.fileURI);
    if (soundIsLoading) return;
    const currStatus = await soundObjectRef.getStatusAsync();
    console.log("CURR STATUS", currStatus);
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
            uri: track.fileURI,
          },
          { shouldPlay: true }
        );
        setIsPlaying(true);
      } catch (e) {
        console.log("Error Loading Sound", e);
      } finally {
        setSoundIsLoading(false);
      }
    } else if (currStatus.isPlaying) {
      setIsPlaying(false);
      await soundObjectRef.pauseAsync();
    } else if (!currStatus.isPlaying) {
      setIsPlaying(true);
      await soundObjectRef.playAsync();
    }
  };

  useEffect(() => {
    console.log(playbackState);
  }, [playbackState]);

  return (
    <View style={styles.container}>
      <Text>{track.filename}</Text>
      <TouchableOpacity onPress={onButtonPressed} style={styles.actionButton}>
        <View>{!isPlaying ? <PlayIcon /> : <PauseIcon />}</View>
      </TouchableOpacity>
      <Text>{isPlaying ? "Pause" : "Play"}</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={track.metadata?.durationSeconds}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        value={position}
      />
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
export default TrackPlayerContainer;
