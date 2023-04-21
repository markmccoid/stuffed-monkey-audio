import "dotenv/config";
// import appjson from "./app.json";

// should be populated whether building
// for DEV or Prod
const dropboxSecret = process.env.DROPBOX_SECRET;
const dropboxAppKey = process.env.DROPBOX_APPKEY;
export default {
  privacy: "unlisted",
  scheme: "stuffedmonkeyaudio",
  platforms: ["ios"],
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    // Apple App Store Connect prompts you to select the type of encryption algorithm your app implements.
    // This is known as Export Compliance Information. It is asked when publishing the app or submitting for TestFlight.
    // The first setting takes care of this prompt
    config: {
      usesNonExemptEncryption: false,
    },
    supportsTablet: false,
    bundleIdentifier: "com.markmccoid.stuffed-monkey-audio",
    buildNumber: "0.0.1",
    infoPlist: {
      RCTAsyncStorageExcludeFromBackup: false,
      UIBackgroundModes: ["audio"],
    },
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  // THIS IS WHAT WE READ IN THE CODE
  // uses the expo contstancs package
  extra: {
    dropboxSecret,
    dropboxAppKey,
    eas: {
      projectId: "b24c8edd-545b-48ff-b104-b63d7fa13b08",
    },
  },
};
