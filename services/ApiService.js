const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const MAX_RETRIES = 3;
const TIMEOUT_MS = 10000;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(url, {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function getHomeInfo(date) {
  return fetchWithRetry(
    `${BASE_URL}/functions/v1/gospel-info?date=${date}`,
  );
}

export async function getGospelWay(date) {
  return fetchWithRetry(
    `${BASE_URL}/functions/v1/gospel-daily?date=${date}&version=2`,
  );
}

export async function getAllowedDates() {
  return fetchWithRetry(`${BASE_URL}/functions/v1/gospel-dates`);
}
