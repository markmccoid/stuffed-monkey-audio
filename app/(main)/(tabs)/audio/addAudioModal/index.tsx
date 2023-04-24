import { View, Text, Pressable } from "react-native";
import { MotiPressable } from "moti/interactions";
import React from "react";
import { Link, Stack } from "expo-router";
import { DropboxIcon } from "../../../../../src/components/common/svg/Icons";
import { colors } from "../../../../../src/constants/Colors";

const AddAudioScreen = () => {
  return (
    <View style={{ margin: 0 }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomColor: "black",
          borderBottomWidth: 1,
        }}
      >
        <Link href="audio/addAudioModal/importDropbox" asChild>
          <MotiPressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            animate={React.useMemo(
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
};

export default AddAudioScreen;
