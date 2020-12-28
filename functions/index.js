const functions = require('firebase-functions');
const admin = require('firebase-admin')
const req = require('request')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


const channelId = '1655338472-ke8Na9Zj'
//チャンネルのIDの設定

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.helloOnCall = functions.https.onCall((data, context) => {
    return "Hello OnCall!";
});

admin.initializeApp()

exports.login = functions.https.onCall(async (data) => {
  const reqToken = data.accessToken
  const lineUserId = data.id
  const options = {
    url: "https://api.line.me/oauth2/v2.1/verify?access_token=" + reqToken,
    method: "GET",
    json: true,
  }
  req(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      generateFirebaseToken(lineUserId)
        .then(async (arg) => {
          const firebaseToken = arg.customToken;
          const ret = {
            firebase_token: firebaseToken,
          }
          response.status(200).send(JSON.stringify(ret));
        })
        .catch()
    } else {
      functions.logger.debug("error, body : " + body);
      const ret = {
        error_message: "Authentication error:Cannot verify access token.",
      };
      response.status(403).send(JSON.stringify(ret));
    }
  })
})

async function generateFirebaseToken(userId) {
  const firebaseUid = userId
  const additionalClaims = {
    provider:'LINE'
  }
  try {
    const customToken = await admin
      .auth()
      .createCustomToken(firebaseUid, additionalClaims)
    return { customToken, firebaseUid }
  }catch (error) {
    functions.logger.debug("Error creating custom token:", error);
    return null
  }
}