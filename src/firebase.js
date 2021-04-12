import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAQiuM26zZmaZ7Mcct3z-wgSpxXPBqZp7s',
  authDomain: 'avendi-reactnative-app.firebaseapp.com',
  projectId: 'avendi-reactnative-app',
  storageBucket: 'avendi-reactnative-app.appspot.com',
  messagingSenderId: '987916689667',
  appId: '1:987916689667:web:5f9773ee742cbe7b6e8936',
  measurementId: 'G-9NPXJCPR8V',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
