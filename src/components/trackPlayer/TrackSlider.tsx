import { View, Text, Dimensions } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import { usePlaylistStore } from "../../store/store";
const { width, height } = Dimensions.get("window");
import { formatSeconds } from "../../utils/formatUtils";

const TrackSlider = () => {
  const soundActions = usePlaylistStore((state) => state.actions);
  const { isPlaying, isLoaded, durationSeconds } = usePlaylistStore(
    (state) => state.playbackState
  );
  const positionSeconds = usePlaylistStore((state) => state.currentPosition);

  console.log(positionSeconds);
  return (
    <View>
      <Slider
        style={{ width: width - 20, height: 40 }}
        minimumValue={0}
        maximumValue={durationSeconds}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        value={positionSeconds}
        onValueChange={(val) => soundActions.updatePosition(val, true)}
        onSlidingStart={() => soundActions.pause()}
        onSlidingComplete={(val) => soundActions.updatePosition(val)}
      />
      <Text>{formatSeconds(positionSeconds || 0, "minimal")}</Text>
    </View>
  );
};

export default TrackSlider;
