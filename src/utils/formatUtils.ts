export const formatBytes = (bytes: number) => {
  let finalBytes = "";
  if (bytes >= 1073741824) {
    finalBytes = (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes >= 1048576) {
    finalBytes = (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    finalBytes = (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes > 1) {
    finalBytes = bytes + " bytes";
  } else if (bytes == 1) {
    finalBytes = bytes + " byte";
  } else {
    finalBytes = "0 bytes";
  }
  return finalBytes;
};
