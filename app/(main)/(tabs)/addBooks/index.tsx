import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useMemo } from "react";
import EditScreenInfo from "../../../../src/components/EditScreenInfo";
import { Text, View } from "../../../../src/components/Themed";
import DropboxAuthContainer from "../../../../src/components/dropbox/DropboxAuthContainer";
import { Link, Stack } from "expo-router";
import { MotiPressable } from "moti/interactions";
import { DropboxIcon } from "../../../../src/components/common/svg/Icons";
import { colors } from "../../../../src/constants/Colors";

export default function AddBooksScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Book Source",
        }}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomColor: "black",
          borderBottomWidth: 1,
          borderTopColor: "black",
          borderTopWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Link href="/addBooks/importDropbox" asChild>
          <MotiPressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            animate={useMemo(
              () =>
                ({ hovered, pressed }) => {
                  "worklet";

                  return {
                    opacity: hovered || pressed ? 0.5 : 1,
                    transform: [{ scale: hovered || pressed ? 0.95 : 1 }],
                  };
                },
              []
            )}
          >
            <Text>Import from Dropbox</Text>
            <DropboxIcon color={colors.dropboxBlue} />
          </MotiPressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
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
