import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'checkmate:completed';

export async function getCompletedChallengeIds(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);
  } catch (error) {
    console.warn('Failed to load completed challenge ids', error);
    return [];
  }
}

export async function addCompletedChallengeId(id: number): Promise<void> {
  try {
    const existing = await getCompletedChallengeIds();
    if (existing.includes(id)) {
      return;
    }

    const next = [...existing, id].sort((a, b) => a - b);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn('Failed to persist completed challenge id', id, error);
  }
}
