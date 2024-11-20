import { TestIds } from 'react-native-google-mobile-ads';

const bannerAdId = process.env.EXPO_PUBLIC_ADMOB_BANNER_ID;
if (!bannerAdId && !__DEV__) {
  console.warn('Missing EXPO_PUBLIC_ADMOB_BANNER_ID in environment variables');
}

export const AD_UNIT_IDS = {
  BANNER: __DEV__ ? TestIds.BANNER : bannerAdId || '',
};
