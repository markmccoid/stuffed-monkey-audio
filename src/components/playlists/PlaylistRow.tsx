import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Playlist, AudioTrack, useTrackActions } from "../../store/store";
import { Link } from "expo-router";
import { formatSeconds } from "../../utils/formatUtils";

type Props = {
  playlist: Playlist;
};
const PlaylistRow = ({ playlist }: Props) => {
  const trackActions = useTrackActions();

  return (
    <View className="flex-row justify-between flex-1 mb-2 px-2 flex-grow border-b border-b-amber-700">
      <Link href={{ pathname: `/audio/${playlist.id}` }}>
        <Image style={styles.trackImage} source={{ uri: playlist.imageURI }} />
      </Link>

      <View className="flex-col flex-grow ml-2 justify-between pb-1">
        <View className="flex-col">
          <Text
            className="text-lg font-ssp_semibold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {playlist?.title}
          </Text>
          <Text className="text-sm font-ssp_regular" ellipsizeMode="tail">
            {playlist.author}
          </Text>
        </View>
        <Text className="text-sm font-ssp_regular">
          {formatSeconds(playlist.totalDurationSeconds, "minimal")}
        </Text>
      </View>
      <View className="w-[50 align-middle justify-center">
        <TouchableOpacity
          onPress={() => trackActions.removePlaylist(playlist.id)}
        >
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
export default PlaylistRow;
