import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, useNavigation, useSearchParams } from "expo-router";
import { AudioTrack, useTracksStore } from "../../../../src/store/store";
import TrackPlayerContainer from "../../../../src/components/trackPlayer/TrackPlayerContainer";

const AudioFile = () => {
  const params = useSearchParams();
  const id = params.audioFile as string;
  const tracks = useTracksStore((state) => state.tracks);

  const track = useMemo(
    () => tracks.find((el) => el.id === id),
    [id]
  ) as AudioTrack;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: track.metadata?.title }} />
      <TrackPlayerContainer track={track} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 5,
  },
});
export default AudioFile;
