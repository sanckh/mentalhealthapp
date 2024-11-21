// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { useAuth } from '@/app/store/auth/auth-context';
// import { getCurrentUser } from '@/api/auth';
// import { userModel } from '@/models/userModel';
// import { AD_UNIT_IDS } from '@/config/adConfig';

// const GlobalBannerAd = () => {
//   const { isAuthenticated, uid } = useAuth();
//   const [adError, setAdError] = useState(false);
//   const [isPaid, setIsPaid] = useState(false);

//   useEffect(() => {
//     const checkUserStatus = async () => {
//       if (isAuthenticated && uid) {
//         try {
//           const userData = await getCurrentUser() as userModel;
//           setIsPaid(userData?.isPaid ?? false);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           setIsPaid(false);
//         }
//       }
//     };
    
//     checkUserStatus();
//   }, [isAuthenticated, uid]);

//   // Don't show ads for paid users
//   if (isPaid) {
//     return null;
//   }

//   return (
//     <View style={styles.adContainer}>
//       <BannerAd
//         unitId={AD_UNIT_IDS.BANNER}
//         size={BannerAdSize.FULL_BANNER}
//         requestOptions={{
//           requestNonPersonalizedAdsOnly: true,
//         }}
//         onAdFailedToLoad={(error) => {
//           console.error('Ad failed to load:', error);
//           setAdError(true);
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   adContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//     width: '100%',
//   },
// });

// export default GlobalBannerAd;
