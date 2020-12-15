import firebase from '~/plugins/firebase.js'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const userRef = db.collection('user')

export const state = () => ({
    userId: '',
    userName: '',
})

export const mutations = {
    setUserUid(state, userUid) {
        state.userId = userUid
    },
    setUserName(state, userName) {
        state.userName = userName
    }
}

export const actions = {
    login: firestoreAction((context) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(function (Info) {
                const user = Info.user
                context.commit('setUserUid', user.uid)
                context.commit('setUserName', user.displayName)
                userRef.add({
                    Id: user.uid,
                    Name: user.displayName,
                })
                console.log('success ', user.uid)
            })
    }),
}

export const getters = {
    userId: state => state.userId,
    userName: state => state.userName,
    userURL: state => `/mypage/${state.userId}`
}