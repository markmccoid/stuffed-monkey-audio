import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, useNavigation, useSearchParams } from "expo-router";
import {
  usePlaybackStore,
  useTrackActions,
  useTracksStore,
} from "../../../../src/store/store";
import TrackPlayerContainer from "../../../../src/components/trackPlayer/TrackPlayerContainer";

//! -- GET Playlist info, pull current track, set track curr position
const PlaylistId = () => {
  const params = useSearchParams();
  const playlistId = params.playlistId as string;
  const playbackActions = usePlaybackStore((state) => state.actions);
  const trackActions = useTrackActions();
  const playlist = trackActions.getPlaylist(playlistId);
  const [loaded, setLoaded] = useState(false);

  // const track = useMemo(
  //   () => tracks.find((el) => el.id === id),
  //   [id]
  // ) as AudioTrack;

  useEffect(() => {
    const loadPlaylist = async () => {
      const loaded = await playbackActions.loadPlaylist(playlistId);
      setLoaded(loaded);
    };
    loadPlaylist();
    return () => {
      playbackActions.unloadPlaylist();
    };
  }, [playlistId]);
  console.log("LOADED", loaded);
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: playlist?.title }} />
      <TrackPlayerContainer />
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
export default PlaylistId;
