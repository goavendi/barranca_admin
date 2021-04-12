/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '987916689667',
  apiKey:
    'AAAAncItr6U:APA91bEuSL15n41MmkPbSHnmzs9-NLoy3tGwIwLxx4LYxaB78xlsCFotj3oUSGCHroWaBOoQXJf0-GF6zLv3bTiS4ZRdpLQgmzIoMMczs2wgFGCmvItLA2WabQpg1Vffy4fanr-4mEd2',
});

firebase.messaging();
