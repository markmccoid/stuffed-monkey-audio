import "expo-router/entry";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { PlaybackService } from "./src/utils/trackPlayerService";
import TrackPlayer from "react-native-track-player";

TrackPlayer.registerPlaybackService(() => PlaybackService);
