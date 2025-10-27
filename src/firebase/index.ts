import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

import { firebaseConfig } from './config';

import { FirebaseProvider } from './provider';
import { FirebaseClientProvider } from './client-provider';
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
import { errorEmitter } from './error-emitter';

let app: ReturnType<typeof initializeApp> | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initializeFirebase(options?: FirebaseOptions) {
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(options || firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  } else {
    app = apps[0];
    if (!auth) {
        auth = getAuth(app);
    }
    if (!firestore) {
        firestore = getFirestore(app);
    }
    if(!storage) {
        storage = getStorage(app);
    }
  }
  return { app, auth, firestore, storage };
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
  errorEmitter
};
