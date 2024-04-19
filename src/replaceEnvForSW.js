const fs = require('fs');
const path = require('path');

const swFilePath = path.join(__dirname, '../public/firebase-messaging-sw.js');
const fbConfigFilePath = path.join(__dirname, '../src/firebaseConfig.js');

let swFile = fs.readFileSync(swFilePath, 'utf8');
let fbConfigFile = fs.readFileSync(fbConfigFilePath, 'utf8');

const envVariables = {
  '%%REACT_APP_FIREBASE_API_KEY%%': process.env.REACT_APP_FIREBASE_API_KEY,
  '%%REACT_APP_FIREBASE_AUTH_DOMAIN%%':
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  '%%REACT_APP_FIREBASE_PROJECT_ID%%':
    process.env.REACT_APP_FIREBASE_PROJECT_ID,
  '%%REACT_APP_FIREBASE_STORAGE_BUCKET%%':
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  '%%REACT_APP_FIREBASE_MESSAGING_SENDER_ID%%':
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  '%%REACT_APP_FIREBASE_APP_ID%%': process.env.REACT_APP_FIREBASE_APP_ID,
  '%%REACT_APP_FIREBASE_MEASUREMENT_ID%%':
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  '%%REACT_APP_FIREBASE_VAPID_KEY%%': process.env.REACT_APP_FIREBASE_VAPID_KEY,
};

Object.entries(envVariables).forEach(([key, value]) => {
  swFile = swFile.replace(new RegExp(key, 'g'), value);
  fbConfigFile = fbConfigFile.replace(new RegExp(key, 'g'), value);
});

fs.writeFileSync(swFilePath, swFile);
fs.writeFileSync(fbConfigFilePath, fbConfigFile);
