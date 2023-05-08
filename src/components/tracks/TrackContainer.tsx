import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useTrackActions, useTracksStore } from "../../store/store";
import { Link, useNavigation } from "expo-router";
import TrackItem from "./TrackItem";
import { ScrollView } from "react-native-gesture-handler";

const TrackContainer = () => {
  const tracks = useTracksStore((state) => state.tracks);
  const trackActions = useTrackActions();
  const navigation = useNavigation();
  return (
    <ScrollView
      className="w-full"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View className="mt-2 ">
        {tracks.map((track) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </View>
    </ScrollView>
  );
};

export default TrackContainer;
