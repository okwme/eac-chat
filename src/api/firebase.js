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

export const db = firebase.database()
// export const db = firebase.firestore()
// Disable deprecated features
// db.settings({
//   timestampsInSnapshots: true
// })


export const fb = firebase