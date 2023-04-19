import * as SecureStore from "expo-secure-store"

export async function save(value){
    await SecureStore.setItemAsync('jwt', JSON.stringify(value));
}

export async function getValueFor(){
    let result = await SecureStore.getItemAsync('jwt');
    return result;
}