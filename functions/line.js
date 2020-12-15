const admin = require("firebase-admin")
const functions = require('firebase-functions')
const axios = require('axios')
//require・・importの代わりにmoduleを読み込んでいる
// サービス アカウント JSON ファイルの読み込み
const channelId = 'YOUR_CHANNEL_ID'
//チャンネルのIDの設定

admin.initializeApp()
//何してるかわからない

const axiosInstance = axios.create({
    baseURL: 'https://api.line.me',//バックのURL：portの指定
    responseType: 'json'
})

// 渡されたLINEトークンが正しいものかを検証
const verifyToken = async accessToken => {
    const response = await axiosInstance.get('/oauth2/v2.1/verify', { params: { access_token: accessToken }} )
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

exports.function = functions.region('asia-northeast1').https.onCall(async (data) => {
  const { accessToken } = data
  try {
    await verifyToken(accessToken)
    const profile = await getProfile(accessToken)
    const token = admin.auth().createCustomToken(profile.userId)
    return {  }
  } catch(e) {
    console.error(JSON.stringify(e, null, '  '))
        return { error: e.message }
    }
});
