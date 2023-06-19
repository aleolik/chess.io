// firebase storage used for saving photos
const {initializeApp} = require('firebase-admin/app')
const admin = require('firebase-admin')
const {getStorage} = require('firebase-admin/storage')


// const firebaseConfig = {
//     apiKey: process.env.apiKey,
//     authDomain: process.env.authDomain,
//     projectId: process.env.projectId,
//     storageBucket: process.env.storageBucket,
//     messagingSenderId: process.env.messagingSenderId,
//     appId: process.env.appId,
//     measurementId: process.env.measurementId,
//   };

// const app = admin.initializeApp({
//   credential :  admin.credential.cert(firebaseConfig)
// })


const serviceAccount = require("./serviceAccountKey.json")

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket : process.env.storageBucket
})  

const storage = admin.storage()

module.exports = {
    app,
    storage,
}