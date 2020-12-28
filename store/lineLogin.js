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
        const data = {}
        data.accessToken = await liff.getAccessToken()
        await liff.getProfile()
        .then(profile => {
          data.name = profile.displayName
          data.id = profile.userId
        })
        .catch((err) => {
          console.log('error', err);
        })
        console.log(data)
      functions.useFunctionsEmulator("http://localhost:5001")
        const login = functions.httpsCallable('login')
        const result = await login(data)
          .then(async (response) => {
            console.log('function finished',response)
          })
        console.log('loginResult:', result)
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
    // auth: firestoreAction(() => {
    //   functions.useFunctionsEmulator("http://localhost:5001");
    //   const helloOnCall = functions.httpsCallable("helloOnCall");
    //   const res = helloOnCall({});
    //   console.log(res);
    // })
}

export const getters  = {
    user: state => state.user
}
