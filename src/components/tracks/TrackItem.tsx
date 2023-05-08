import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { AudioTrack, useTrackActions } from "../../store/store";
import { Link } from "expo-router";
import { formatSeconds } from "../../utils/formatUtils";

type Props = {
  track: AudioTrack;
};
const TrackItem = ({ track }: Props) => {
  const trackActions = useTrackActions();

  return (
    <View className="flex-row justify-between flex-1 mb-2 px-2 flex-grow border-b border-b-amber-700">
      <Link href={`/audio/${track.id}`}>
        <Image
          style={styles.trackImage}
          source={{ uri: track.metadata?.pictureURI }}
        />
      </Link>

      <View className="flex-col flex-grow ml-2 justify-between pb-1">
        <View className="flex-col">
          <Text
            className="text-lg font-ssp_semibold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {track.metadata?.title}
          </Text>
          <Text className="text-sm font-ssp_regular" ellipsizeMode="tail">
            {track.metadata?.artist}
          </Text>
        </View>
        <Text className="text-sm font-ssp_regular">
          {formatSeconds(track.metadata?.durationSeconds, "minimal")}
        </Text>
      </View>
      <View className="w-[50 align-middle justify-center">
        <TouchableOpacity onPress={() => trackActions.removeTrack(track.id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trackImage: {
    width: 100,
    height: 100,
    resizeMode: "stretch",
    borderRadius: 10,
  },
});
export default TrackItem;
