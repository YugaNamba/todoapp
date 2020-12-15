import firebase from '~/plugins/firebase.js'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const userRef = db.collection('user')

export const actions = {
    setTodo: firestoreAction((context) => {
        
    }),

}
