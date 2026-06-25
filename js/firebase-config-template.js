// Firebase Configuration Template
// انسخ هذا الملف إلى firebase-config.js واملأ القيم الخاصة بك

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Test connection
db.collection('test').add({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
}).then(() => {
    console.log('✅ Firebase connection successful');
}).catch((error) => {
    console.error('❌ Firebase connection failed:', error);
});
