import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'

function getFirebaseConfig(): FirebaseOptions {
  const apiKey = process.env.FIREBASE_API_KEY
  const authDomain = process.env.FIREBASE_AUTH_DOMAIN
  const projectId = process.env.FIREBASE_PROJECT_ID
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET
  const appId = process.env.FIREBASE_APP_ID

  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error('Firebase client config is missing')
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    appId,
  }
}

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(getFirebaseConfig())
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp())
}

