import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";
import { authorize } from "react-native-app-auth";
import {
  storeDropboxRefreshToken,
  storeDropboxToken,
} from "../../store/data/secureStorage";
import { checkDropboxToken } from "../../utils/dropboxUtils";

//-- ----------------------
//-- APP AUTH CONFIG SETUP
//-- ----------------------
const APP_KEY = Constants?.manifest?.extra?.dropboxAppKey;
const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
const redirectURL = makeRedirectUri({
  scheme: "stuffedmonkeyaudio",
  path: "(tabs)/two",
});

// *** THIS IS IMPORTANT TO SETUP CORRECTLY -- The first three are the only
// *** ones you should need to change
const config = {
  clientId: APP_KEY,
  clientSecret: APP_SECRET,
  redirectUrl: redirectURL,
  scopes: [], // Scopes are set when you create your app on the dropbox site.
  serviceConfiguration: {
    authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
    tokenEndpoint: `https://www.dropbox.com/oauth2/token`,
  },
  additionalParameters: {
    token_access_type: "offline",
  },
};
//-- ----------------------

const DropboxAuthContainer = () => {
  console.log(redirectURL);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const onAuthorize = async () => {
    const authState = await authorize(config);
    const dropboxToken = authState?.accessToken;
    const dropboxRefreshToken = authState?.refreshToken;
    // The fields below are not really needed for anything auth-wise
    // but you can use them if you need to.
    const dropboxExpireDate = Date.parse(authState?.accessTokenExpirationDate);
    const dropboxAccountId = authState?.tokenAdditionalParameters?.account_id;
    const dropboxUID = authState?.tokenAdditionalParameters?.uid;

    // Store the token and refresh token in secure storage
    storeDropboxToken(dropboxToken);
    storeDropboxRefreshToken(dropboxRefreshToken);
  };

  // ----------------------------------
  // Function to call on component mount to check if token
  // is valid.
  const checkToken = async () => {
    const token = await checkDropboxToken();
    setIsTokenValid(!!token);
  };

  React.useEffect(() => {
    checkToken();
  }, []);

  return (
    <View>
      <Text>DropboxAuthContainer</Text>
      {isTokenValid && (
        <View>
          <Text>Dropbox is Authorized</Text>
        </View>
      )}
      {!isTokenValid && (
        <TouchableOpacity style={styles.authButton} onPress={onAuthorize}>
          <Text style={{ color: "white" }}>Authorize Dropbox</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  authButton: {
    backgroundColor: "#0261fe",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#213ec6",
  },
});

export default DropboxAuthContainer;
