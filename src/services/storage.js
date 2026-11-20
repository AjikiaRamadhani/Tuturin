// Penyimpanan lokal sederhana. Semua error ditelan supaya aplikasi tidak crash
// kalau penyimpanan bermasalah (data dianggap kosong).

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJSON(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // abaikan
  }
}
