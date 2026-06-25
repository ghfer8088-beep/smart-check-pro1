// Firebase Configuration
// ⚠️ SECURITY NOTE: This API key is exposed in client-side code.
// To secure your Firebase project, configure proper Firebase Security Rules
// in the Firebase Console to restrict access to authorized users only.
// For production, consider using Firebase App Check or a backend proxy.

const firebaseConfig = {
    apiKey: "AIzaSyAHmKeCKd41a3pKtSURET9MnwegXrjCqwE",
    authDomain: "smart-check-23b1d.firebaseapp.com",
    projectId: "smart-check-23b1d",
    storageBucket: "smart-check-23b1d.firebasestorage.app",
    messagingSenderId: "46760490890",
    appId: "1:46760490890:web:6b03e01e6451dead0efa73",
    measurementId: "G-BJ8G4605P0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

console.log('✅ Firebase initialized successfully');

// Test connection
db.collection('test').doc('connection').set({
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'connected'
}).then(() => {
    console.log('✅ Firestore connection test successful');
}).catch(error => {
    console.error('❌ Firestore connection test failed:', error);
});
