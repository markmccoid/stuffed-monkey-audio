import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SettingsIndex = () => {
  return (
    <View>
      <Text>SettingsIndex</Text>
      <Link href={"settings/dropboxAuth"}>
        <Text>Authorize Dropbox</Text>
      </Link>
    </View>
  );
};

export default SettingsIndex;
