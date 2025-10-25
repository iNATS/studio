import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

import { firebaseConfig } from './config';

import { FirebaseProvider, FirebaseClientProvider } from './provider';
import {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
import {
  useCollection,
  useDoc,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from './non-blocking-updates';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

let app: ReturnType<typeof initializeApp> | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

function initializeFirebase(options?: FirebaseOptions) {
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(options || firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
  FirebaseErrorListener,
  getFirestore,
};
