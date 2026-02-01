import AsyncStorage from '@react-native-async-storage/async-storage';

const TTL_DAILY = 24 * 60 * 60 * 1000;
const TTL_DATES = 7 * 24 * 60 * 60 * 1000;

async function getWithTTL(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const {data, expiry} = JSON.parse(raw);
    if (Date.now() > expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

async function setWithTTL(key, data, ttl) {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({data, expiry: Date.now() + ttl}),
    );
  } catch {
    // silently fail on cache write
  }
}

export async function getCachedHomeInfo(date, fetcher) {
  const key = `home_info_${date}`;
  const cached = await getWithTTL(key);
  if (cached) return cached;
  const data = await fetcher();
  await setWithTTL(key, data, TTL_DAILY);
  return data;
}

export async function getCachedGospelWay(date, fetcher) {
  const key = `gospel_way_${date}`;
  const cached = await getWithTTL(key);
  if (cached) return cached;
  const data = await fetcher();
  await setWithTTL(key, data, TTL_DAILY);
  return data;
}

export async function getCachedDates(fetcher) {
  const key = 'allowed_dates';
  const cached = await getWithTTL(key);
  if (cached) return cached;
  const data = await fetcher();
  await setWithTTL(key, data, TTL_DATES);
  return data;
}
