import * as SecureStore from "expo-secure-store";

export async function save(jwt: string, user: string) {
  await SecureStore.setItemAsync("jwt", JSON.stringify(jwt));
  await SecureStore.setItemAsync("username", JSON.stringify(user));
}

export async function getValueForJWT() {
  let result = await SecureStore.getItemAsync("jwt");
  return result;
}

export async function getValueForUsername() {
  let result = await SecureStore.getItemAsync("username");
  return result;
}
