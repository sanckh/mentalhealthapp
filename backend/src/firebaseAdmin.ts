import admin from 'firebase-admin';
import serviceAccount from '../firebaseServiceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://mental-health-app-77517-default-rtdb.firebaseio.com'
});

export default admin;
