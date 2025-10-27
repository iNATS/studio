
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  doc as firestoreDoc,
  collection as firestoreCollection,
  type DocumentData,
  type DocumentReference,
  type Query,
  type Firestore,
  type CollectionReference,
  type SetOptions,
  type DocumentSnapshot,
  type QuerySnapshot,
} from 'firebase/firestore';
import { FirestorePermissionError } from './errors';
import { errorEmitter } from './error-emitter';


// Non-blocking Firestore updates
export const addDocumentNonBlocking = (
  firestore: Firestore,
  collectionName: string,
  data: DocumentData
) => {
  const collectionRef = firestoreCollection(firestore, collectionName);
  addDoc(collectionRef, data).catch((error) => {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'Firestore permission denied while adding a document.',
            'add',
            collectionName,
            data
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error('Error adding document: ', error)
  });
};

export const setDocumentNonBlocking = (
  firestore: Firestore,
  docPath: string,
  data: DocumentData,
  options?: SetOptions
) => {
  const docRef = doc(firestore, docPath);
  setDoc(docRef, data, options || {}).catch((error) => {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'Firestore permission denied while setting a document.',
            'set',
            docPath,
            data
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error('Error setting document: ', error)
  });
};

export const updateDocumentNonBlocking = (
  firestore: Firestore,
  docPath: string,
  data: DocumentData
) => {
  const docRef = doc(firestore, docPath);
  updateDoc(docRef, data).catch((error) => {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'Firestore permission denied while updating a document.',
            'update',
            docPath,
            data
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error('Error updating document: ', error)
  });
};

export const deleteDocumentNonBlocking = (
  firestore: Firestore,
  docPath: string
) => {
  const docRef = doc(firestore, docPath);
  deleteDoc(docRef).catch((error) => {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'Firestore permission denied while deleting a document.',
            'delete',
            docPath
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error('Error deleting document: ', error)
  });
};

// Firestore data hooks
interface UseCollectionOptions {
  sort?: { by: string; direction?: 'asc' | 'desc' };
  filter?: { field: string; operator: '==', value: any };
}

export function useCollection<T>(
  ref: CollectionReference | Query | null,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot: QuerySnapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as unknown as T)
        );
        setData(data);
        setLoading(false);
      },
      (err) => {
        if (err.code === 'permission-denied') {
            const customError = new FirestorePermissionError(
                'Firestore permission denied while listening to a collection.',
                'listen',
                ref.path
            );
            errorEmitter.emit('permission-error', customError);
        }
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}

export function useDoc<T>(
    ref: DocumentReference | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as unknown as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        if (err.code === 'permission-denied') {
            const customError = new FirestorePermissionError(
                'Firestore permission denied while listening to a document.',
                'listen',
                ref.path
            );
            errorEmitter.emit('permission-error', customError);
        }
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
