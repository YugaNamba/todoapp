import firebase from 'firebase'

const config = {
    // projectId: process.env.FIREBASE_PROJECT_ID
    apiKey: "AIzaSyBSR_M2nNcfVrI4TB234oKSvsP_EWY1V4s",
    authDomain: "todoapp-72fed.firebaseapp.com",
    projectId: "todoapp-72fed",
    storageBucket: "todoapp-72fed.appspot.com",
    messagingSenderId: "960382311987",
    appId: "1:960382311987:web:6283e7b1bd465e2b52cd46",
    measurementId: "G-ZRSS1F782M"
}

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase
const auth = firebase.auth
const functions = firebase.app().functions('asia-northeast1')

export { auth,  functions }