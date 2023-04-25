import { useEffect, useState } from "react";
import {
  getDropboxRefreshToken,
  getDropboxToken,
  storeDropboxToken,
} from "../store/data/secureStorage";
import axios, { AxiosError } from "axios";
import base64 from "react-native-base64";
import Constants from "expo-constants";

type AuthToken = {
  token: string;
  error?: string;
};

const APP_KEY = Constants?.manifest?.extra?.dropboxAppKey;
const APP_SECRECT = Constants?.manifest?.extra?.dropboxSecret;
//* refreshToken ----------------------
/**
 *
 * @param refreshToken
 * @returns token
 */
export const refreshToken = async (refreshToken: string) => {
  const username = APP_KEY; // dropbox app key
  const password = APP_SECRECT; // dropbox app secret
  const authHeader = "Basic " + base64.encode(`${username}:${password}`);
  try {
    const response = await axios.post(
      "https://api.dropboxapi.com/oauth2/token",
      { refresh_token: refreshToken, grant_type: "refresh_token" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
      }
    );
    // Only returning the access token
    return {
      token: response.data.access_token as string,
      expiresIn: response.data.expires_in as number,
    };
    /* data: {
        access_token: string;
        token_type: string; //"bearer"
        expires_in: number // millisecons usually 14400
    }
    */
  } catch (e) {
    const err = e as AxiosError;
    // console.log("error =", typeof err, err.code, err.config, err.request);
    return {
      token: undefined,
      expiresIn: 0,
      error: err.message,
    };
  }
};
//* refreshToken ----------------------
/**
 *
 * @param refreshToken
 * @returns token
 */
export const revokeDropboxAccess = async (token: string) => {
  const username = APP_KEY; // dropbox app key
  const password = APP_SECRECT; // dropbox app secret
  const authHeader = `Bearer ${token}`;
  try {
    const response = await axios.post(
      "https://api.dropboxapi.com/2/auth/token/revoke",
      undefined,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    // Only returning the access token
    return {
      token: undefined,
    };
    /* data: {
        access_token: string;
        token_type: string; //"bearer"
        expires_in: number // millisecons usually 14400
    }
    */
  } catch (e) {
    const err = e as AxiosError;
    console.log("error =", typeof err, err.code, err.config, err.request);
    return {
      token: "",
      expiresIn: 0,
      error: err.message,
    };
  }
};
//* checkDropboxToken -----------------
/**
 * Checks for the validity of the existing token.
 * If token is "good"
 *  - return { token, tokenExpireDate }
 * If token is "bad", it checks to see if refresh tokens exists
 * If refresh token exists
 *  - Get new token
 *  - save to secure storage
 *  - return { token, tokenExpireDate }
 * if no refresh token exists
 *  - return { token: undefined }
 * @returns Object = { token: string | undefined, tokenExpireDate?: number }
 */
export const checkDropboxToken = async () => {
  const token = await getDropboxToken();
  if (token) {
    // token exists, so check to see if still valid
    const { valid } = await isDropboxTokenValid(token);
    if (valid) {
      //~~ RETURN VALID Token pulled from Storage
      return { token };
    }
  }
  console.log("TOKEN IS NOT VALID");

  const dbRefreshToken = await getDropboxRefreshToken();
  console.log("checkDropboxToken - REFRESH", dbRefreshToken);
  if (dbRefreshToken) {
    const { token: dropboxToken, expiresIn } = await refreshToken(
      dbRefreshToken
    );
    console.log("checkDropboxToken - dropbox token new", dropboxToken);
    // This is storing to secureStore on device
    // dropboxActions.updateToken(dropboxToken, Date.now() + expiresIn);
    await storeDropboxToken(dropboxToken);
    //~~ RETURN VALID Token REFRESHED
    return { token: dropboxToken, tokenExpireDate: Date.now() + expiresIn };
  }
  //~~ RETURN Either New unauthed or some other error
  return { token: undefined };
};

//-- Refresh HOOK
export const useDropboxToken = () => {
  const [token, setToken] = useState<string>();
  const [tokenExpireDate, setTokenExpireDate] = useState(0);
  useEffect(() => {
    const getToken = async () => {
      const checkReturn = await checkDropboxToken();
      const token = checkReturn.token;
      const expiresIn = Date.now() + (checkReturn?.tokenExpireDate || 0);
      setToken(token);
    };
    getToken();
  }, []);
  return { token, tokenExpireDate };
};
//* getAuthToken ----------------------
/**
 * This function needs an authKey from the users dropbox account
 * This is received by sending the user to the following:
 * https://www.dropbox.com/oauth2/authorize?client_id=MY_CLIENT_ID&redirect_uri=MY_REDIRECT_URI&response_type=code
 * NOTE: redirect_uri=MY_REDIRECT_URI is optional and since this is NOT a web app, I was unable to use it
 */
export const getAuthToken = async (authKey: string): Promise<AuthToken> => {
  const body = { code: authKey, grant_type: "authorization_code" };
  const params = `code=${authKey}&grant_type=authorization_code`;
  // These are my dropbox apps id and secret phrase used as username/password
  // Dropbox App Console https://www.dropbox.com/developers/apps?_tk=pilot_lp&_ad=topbar4&_camp=myapps
  // ListenToMyBooks dropbox app
  const username = APP_KEY; // dropbox app key
  const password = "d4l48gno8wln2d9"; // dropbox app secret
  console.log("AUTHKEY", authKey);
  const authHeader = "Basic " + base64.encode(`${username}:${password}`);
  const data = new URLSearchParams();
  data.append("code", authKey);
  data.append("grant_type", "authorization_code");
  console.log("DATA", data);
  console.log("UP", authHeader);
  try {
    const response = await axios.post(
      "https://api.dropboxapi.com/oauth2/token",
      { code: authKey, grant_type: "authorization_code" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
      }
    );
    // Only returning the access token
    return { token: response.data.access_token };
    /* data: {
        access_token: string;
        account_id: string;
        scope: string;
        token_type: string;
        uid: string;
    }
    */
  } catch (e) {
    const err = e as AxiosError;
    console.log("error =", typeof err, err.code, err.config, err.request);
    return {
      token: "",
      error: err.message,
    };
  }
};

//* downloadDropboxFile ----------------------
export const downloadDropboxFile = async <T>(
  token: string,
  folder: string = "/",
  filename: string
): Promise<T> => {
  // path directive must be stringified when sending to "Dropbox-API-Arg"
  // end result --> '{"path": "/dropboxupload.txt"}'
  const path = { path: `${folder}${filename}` };
  return axios
    .get(`https://content.dropboxapi.com/2/files/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify(path),
      },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      error: err;
    });
};

//* uploadDropboxFile ----------------------
// NOTE: if you get status/error 409 it usually means
export const uploadDropboxFile = async (
  token: string,
  folder: string = "/",
  filename: string,
  data
) => {
  // path directive must be stringified when sending to "Dropbox-API-Arg"
  // end result --> '{"path": "/dropboxupload.txt"}'
  const path = { path: `${folder}${filename}`, mode: "overwrite" };

  return axios
    .post(
      `https://content.dropboxapi.com/2/files/upload`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Dropbox-API-Arg": JSON.stringify(path),
          "Content-Type": "application/octet-stream",
        },
      }
    )
    .then((resp) => ({
      status: resp.status,
      error: undefined,
    }))
    .catch((err) => ({
      status: undefined,
      error: err,
    }));
};

type FolderEntry = {
  [".tag"]: "folder";
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
};
type FileEntry = {
  [".tag"]: "file";
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
  client_modified: string;
  server_modified: string;
  rev: string;
  size: number;
  is_downloadable: boolean;
  content_hash: string;
};
export type Entries = FolderEntry | FileEntry;
export type ListOfFiles = {
  entries: Entries[];
  cursor: string;
  has_more: boolean;
};

//* listDropboxFiles ----------------------
export const listDropboxFiles = async (
  path: string = ""
): Promise<ListOfFiles> => {
  const { token } = await checkDropboxToken(); //getDropboxToken();

  // If no token throw an Error. Need to catch it somewhere
  if (!token) {
    throw new Error("Invalid Token");
  }
  // console.log("TOKEN", token);
  const data = { path: path };
  let resp;
  try {
    resp = await axios.post(
      `https://api.dropboxapi.com/2/files/list_folder`,
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("Throw ERRPR", err.response.status, err.message);
    // Rethrow error to get picked up in code.
    // Did this because was thinking of create a custom error
    // class for my app error so
    if (err.response.status === 401) {
      throw new Error("Problem with Dropbox Authorization", {
        cause: "Dropbox",
      });
    } else {
      throw new Error(err);
    }
  }
  return resp?.data;
  // .then((resp) => ({
  //   status: resp.status,
  //   error: undefined,
  // }))
  // .catch((err) => ({
  //   status: undefined,
  //   error: err,
  // }));
};

//* Check token ----------------------
// Verify if stored token is valid
type ErrorValues = "No Network" | "Invalid or Missing Token" | "";
type TokenReturn = {
  valid: boolean;
  error?: ErrorValues;
};
export const isDropboxTokenValid = async (
  token: string
): Promise<TokenReturn> => {
  const data = { query: "valid" };
  try {
    const resp = await axios.post(
      "https://api.dropboxapi.com/2/check/user",
      JSON.stringify(data),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { valid: true };
  } catch (e) {
    const err = e as AxiosError;
    let errorMessage: ErrorValues = "";
    if (err?.response?.data) {
      errorMessage = "Invalid or Missing Token";
    } else {
      errorMessage = "No Network";
    }

    return { valid: false, error: errorMessage };
  }
};
