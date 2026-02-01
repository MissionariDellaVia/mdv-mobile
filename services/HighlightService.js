import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGHLIGHTS_KEY = 'highlights';

export async function getHighlights() {
  try {
    const raw = await AsyncStorage.getItem(HIGHLIGHTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addHighlight(highlight) {
  const highlights = await getHighlights();
  highlights.unshift({
    ...highlight,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(highlights));
  return highlights;
}

export async function removeHighlight(id) {
  const highlights = await getHighlights();
  const filtered = highlights.filter(h => h.id !== id);
  await AsyncStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(filtered));
  return filtered;
}

export async function getHighlightCount() {
  const highlights = await getHighlights();
  return highlights.length;
}

export async function getHighlightsByDate(date) {
  const highlights = await getHighlights();
  return highlights.filter(h => h.date === date);
}
