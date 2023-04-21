importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');
const firebaseConfig = {
    apiKey: "AIzaSyBXunx0kV2ogyDNOcHvW9Fu-8kTmZwZkaM",
    authDomain: "pintour-2ae34.firebaseapp.com",
    projectId: "pintour-2ae34",
    storageBucket: "pintour-2ae34.appspot.com",
    messagingSenderId: "18381792415",
    appId: "1:18381792415:web:e2dd4d8c2b343da7b42eaa"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();