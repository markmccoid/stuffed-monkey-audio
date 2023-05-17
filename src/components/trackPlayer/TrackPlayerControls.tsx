import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import React from "react";
import { usePlaybackStore } from "../../store/store";
import { BackInTimeIcon, PauseIcon, PlayIcon } from "../common/svg/Icons";

type Props = {
  style?: ViewStyle;
};
const CONTROLSIZE = 35;
const TrackPlayerControls = ({ style }: Props) => {
  const playbackActions = usePlaybackStore((state) => state.actions);
  const isPlaying = usePlaybackStore((state) => state.playbackState.isPlaying);
  const isLoaded = usePlaybackStore((state) => state.playbackState.isLoaded);

  //~ --- ----
  const play = async () => {
    await playbackActions.play();
  };
  const pause = async () => {
    playbackActions.pause();
  };

  return (
    <View className="flex-row gap-10 items-center justify-center" style={style}>
      <TouchableOpacity>
        <BackInTimeIcon size={CONTROLSIZE} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={isLoaded && isPlaying ? () => pause() : () => play()}
        style={styles.actionButton}
      >
        <View>
          {!isPlaying ? (
            <PlayIcon size={CONTROLSIZE} />
          ) : (
            <PauseIcon size={CONTROLSIZE} />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => playbackActions.jumpForward(10)}>
        <BackInTimeIcon
          style={{ transform: [{ scaleX: -1 }] }}
          size={CONTROLSIZE}
        />
      </TouchableOpacity>
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
    // borderWidth: 1,
    // borderRadius: 5,
  },
});

export default TrackPlayerControls;
