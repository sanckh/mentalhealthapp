import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';


export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR_GOOGLE_CLIENT_ID', //#TODO: Replace with your client ID
    offlineAccess: true,
  });
};


export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      console.log('Google Sign-In successful:', response);
      return response; // Return the user data 
    }
  } catch (error) {
    console.error('Google Sign-In error:', error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log('User cancelled the login flow');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play services not available or outdated');
          break;
        default:
          console.log('Unknown error:', error);
      }
    } else {
      console.log('Non-Google Sign-In error occurred:', error);
    }
  }
};
