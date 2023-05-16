import { ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";

import EditScreenInfo from "../../../../src/components/EditScreenInfo";
import { Text, View } from "../../../../src/components/Themed";
import DropboxAuthContainer from "../../../../src/components/dropbox/DropboxAuthContainer";
import { Stack } from "expo-router";
import { useTrackActions, useTracksStore } from "../../../../src/store/store";

export default function TagsScreen() {
  const tracks = useTracksStore((state) => state.tracks);
  const playlists = useTracksStore((state) => state.playlists);
  const trackActions = useTrackActions();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Tags",
        }}
      />
      <TouchableOpacity onPress={() => trackActions.clearAll()}>
        <Text>CLEAR STORE</Text>
      </TouchableOpacity>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <ScrollView>
        <View>
          {tracks.map((track) => {
            return (
              <View
                key={track.id}
                style={{
                  borderWidth: 1,
                  paddingHorizontal: 2,
                  paddingVertical: 1,
                }}
              >
                <Text>Source Loc --- {track.sourceLocation}</Text>
                <Text>Album --- {track.metadata?.album}</Text>
                <Text>Artist --- {track.metadata?.artist}</Text>
                <Text>Title --- {track.metadata?.title}</Text>
              </View>
            );
          })}
        </View>
        <View>
          {playlists.map((el) => {
            return (
              <View key={el.id}>
                <Text>Playlist ID: {el.id}</Text>
                <Text>Playlist NAME: {el.name}</Text>
                {el.trackIds &&
                  el.trackIds.map((trackId) => (
                    <Text key={trackId}>Track: {trackId}</Text>
                  ))}
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: el.imageURI }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
