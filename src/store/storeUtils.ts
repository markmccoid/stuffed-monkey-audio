import { AudioTrack } from "./store";

export const analyzePlaylistTracks = (
  storedTracks: AudioTrack[],
  tracks: string[]
) => {
  let totalDuration = 0;
  let imageSet = new Set();

  for (let trackId of tracks) {
    const track = storedTracks.find((el) => el.id === trackId);
    imageSet.add(track?.metadata?.pictureURI);
    totalDuration = totalDuration + (track?.metadata?.durationSeconds || 0);
  }

  return { images: [...imageSet] as string[], totalDuration };
};
