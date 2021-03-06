const admin = require("firebase-admin")
const functions = require('firebase-functions')
const axios = require('axios')
var request = require('request')
//require・・importの代わりにmoduleを読み込んでいる
const channelId = '1655338472-ke8Na9Zj'
//チャンネルのIDの設定

admin.initializeApp()
//何してるかわからない

const axiosInstance = axios.create({
  baseURL: 'https://api.line.me/oauth2/v2.1/verify?access_token=',
    //バックのURL：portの指定
    responseType: 'json'
})

// 渡されたLINEトークンが正しいものかを検証
const verifyToken = async accessToken => {
    const response = await axiosInstance.get( { params: { access_token: accessToken }} )
    if (response.status !== 200) {
    console.error(response.data.error_description)
    throw new Error(response.data.error)
    }
  // チャネルIDをチェック
    if (response.data.client_id !== channelId) {
    throw new Error('client_id does not match.')
    }
  //アクセストークンの有効期限
    if (response.data.expires_in < 0) {
    throw new Error('access token is expired.')
    }
}

const getProfile = async (accessToken) => {
const response = await axiosInstance.get('/v2/profile', {
    headers: {
    'Authorization': `Bearer ${accessToken}`
    },
    data: {}
})
    if (response.status !== 200) {
    console.error(response.data.error_description)
    throw new Error(response.data.error)
    }
    return response.data
}

exports.login = functions.https.onCall(async data => {
  cors(async data => {
    console.log('function on!!')
    const { accessToken } = data
    try {
      // LINEのアクセストークンが正しいか検証
      await verifyToken(accessToken)
      // アクセストークンを利用してプロフィール取得
      const profile = await getProfile(accessToken)
      // LINEのuserIdを利用してfirebaseのカスタム認証トークンを発行
      const token = await admin.auth().createCustomToken(profile.userId)
      return { token }
    } catch (e) {
      console.error(JSON.stringify(e, null, '  '))
      return { error: e.message }
    } 
  })
})

// exports.login = functions.https.onCall(async data => {
//   const access_token = data.accessToken
//   const axiosInstance = axios.create({
//     baseURL: 'https://api.line.me/oauth2/v2.1/verify?access_token=',
//     responseType: 'json'
//   })
//   const response = await axiosInstance.get(axiosInstance, { params: { access_token: access_token } })
//     if (!error && response.statusCode === 200) {
//       const firebaseToken = generateFirebaseToken(data.id)
//         // LINE プロファイルで Firebase ユーザー プロファイルをアップデート
//         updateUserProfile(access_token, firebaseToken, data.id, () => {
//           const ret = {
//             firebase_token: firebaseToken
//           };
//           return res.status(200).send(ret);
//         });
//       }
// })

// async function generateFirebaseToken(userId) {
//   const firebaseUid = userId;
//   const additionalClaims = {
//     provider: "LINE",
//   };
//   try {
//     const customToken = await admin
//       .auth()
//       .createCustomToken(firebaseUid, additionalClaims);
//     return {customToken, firebaseUid};
//   } catch (error) {
//     functions.logger.debug("Error creating custom token:", error);
//     return null;
//   }
// }