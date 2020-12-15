import firebase from '~/plugins/firebase.js'
import { firestoreAction } from 'vuexfire'
import { auth, functions } from "~/plugins/firebase.js"
import liff from '@line/liff'

const liffId = '1655338472-ke8Na9Zj'

export const state = () => ({
    user:null
})

export const actions = {
  liffinit: firestoreAction(() => {
    liff.init({ liffId })
      .catch((err) => {
        console.log('LIFF初期化失敗', err)
      })
      .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login();
          }
        })
  }),
  auth: firestoreAction(() => {
    auth().onAuthStateChanged(async user => {
      console.log('auth succeses!!')
      if (user) {// 3.1 firebaseにログイン済みの場合、ユーザー情報を取得し、終了
        state.user = user
      } else {// 3.2 firebaseにログインしていない場合
        // 3.2.1 LIFF APIを利用して、LINEのアクセストークンを取得
        console.log('not logined')
        const accessToken = liff.getAccessToken()
        // 3.2.3 LINEのIDトークンをfirebase functionsに投げて、firebaseのカスタム認証用トークンを取得
        const login = functions.httpsCallable('login')
        const result = login({ accessToken })
          .then((data) => {
          console.log(data)
        })
        // if (result.data.error) {
        //   console.error(result.data.error)
        // } else {
        //   // 3.2.4 firebaseの認証用トークンを利用してカスタム認証
        //   const res = auth().signInWithCustomToken(result.data.token)
        //   this.user = res.user
        // }
      }
    })
  })
}

export const getters  = {
    user: state => state.user
}
