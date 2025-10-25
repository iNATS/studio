
'use client';

import React, { ReactNode } from 'react';
import { initializeFirebase, FirebaseProvider } from './index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = initializeFirebase();

  return (
    <FirebaseProvider
      value={{
        app: firebase.app || null,
        auth: firebase.auth || null,
        firestore: firebase.firestore || null,
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
