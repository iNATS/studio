
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
import { getFirestore } from './index';

// Non-blocking Firestore updates
export const addDocumentNonBlocking = (
  collectionRef: CollectionReference,
  data: DocumentData
) => {
  addDoc(collectionRef, data).catch((error) =>
    console.error('Error adding document: ', error)
  );
};

export const setDocumentNonBlocking = (
  docRef: DocumentReference,
  data: DocumentData,
  options?: SetOptions
) => {
  setDoc(docRef, data, options || {}).catch((error) =>
    console.error('Error setting document: ', error)
  );
};

export const updateDocumentNonBlocking = (
  docPath: string,
  data: DocumentData
) => {
  const db = getFirestore();
  if (!db) return;
  const docRef = firestoreDoc(db, docPath);
  updateDoc(docRef, data).catch((error) =>
    console.error('Error updating document: ', error)
  );
};

export const deleteDocumentNonBlocking = (docPath: string) => {
  const db = getFirestore();
  if (!db) return;
  const docRef = firestoreDoc(db, docPath);
  deleteDoc(docRef).catch((error) =>
    console.error('Error deleting document: ', error)
  );
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
      return;
    }

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
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
