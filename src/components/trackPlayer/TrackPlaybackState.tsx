import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { usePlaybackStore } from "../../store/store";

const TrackPlaybackState = () => {
  const currentPosition = usePlaybackStore((state) => state.currentPosition);
  const currTrack = usePlaybackStore((state) => state.currentTrack?.id);
  const playbackActions = usePlaybackStore((state) => state.actions);
  const shouldLoadNext = usePlaybackStore((state) => state.shouldLoadNextTrack);
  const [loadingNext, setLoadingNext] = useState(false);
  const { isPlaying, durationSeconds, isLoaded } = usePlaybackStore(
    (state) => state.playbackState
  );
  useEffect(() => {
    const loadNext = async () => {
      // console.log("PLAYER- UseEffect SHOULD LOAD", shouldLoadNext, loadingNext);
      setLoadingNext(true);
      if (shouldLoadNext && !loadingNext) {
        console.log("LOAD NEXT TRACK");
        await playbackActions.loadNextTrack();
      }
      setLoadingNext(false);
    };
    loadNext();
  }, [shouldLoadNext, loadingNext]);

  return (
    <View>
      <Text>playing-Loaded: {`${isPlaying}--${isLoaded}`}</Text>
      <Text>
        duration: {durationSeconds} for {currTrack}
      </Text>
      <Text>pos: {currentPosition}</Text>
    </View>
  );
};

export default TrackPlaybackState;
