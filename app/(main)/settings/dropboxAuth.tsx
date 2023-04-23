import { View, Text } from "react-native";
import React from "react";
import DropboxAuthContainer from "../../../src/components/dropbox/DropboxAuthContainer";

const dropboxAuth = () => {
  return (
    <View>
      <Text>dropboxAuth</Text>
      <DropboxAuthContainer />
    </View>
  );
};

export default dropboxAuth;
