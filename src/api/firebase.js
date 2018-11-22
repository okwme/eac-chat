import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyAdK9qrNj1G6abHZiYkyDvdJ3pajUnBtS8',
  authDomain: 'eac-chat-ddecb.firebaseapp.com',
  databaseURL: 'https://eac-chat-ddecb.firebaseio.com',
  projectId: 'eac-chat-ddecb',
  storageBucket: 'eac-chat-ddecb.appspot.com',
  messagingSenderId: '453164258119'
}

firebase.initializeApp(config)

// var database = firebase.database()
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('user is ', user)
    // User is signed in.
  } else {
    console.log('uers was signed out')
    // No user is signed in.
  }
})

export const fb = firebase