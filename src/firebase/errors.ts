
'use client';

import type { DocumentData, DocumentReference } from 'firebase/firestore';

export type FirestoreOperationType = 'add' | 'set' | 'update' | 'delete' | 'get' | 'listen';

export class FirestorePermissionError extends Error {
  operation: FirestoreOperationType;
  path: string;
  resource?: DocumentData;

  constructor(
    message: string,
    operation: FirestoreOperationType,
    path: string,
    resource?: DocumentData
  ) {
    super(message);
    this.name = 'FirestorePermissionError';
    this.operation = operation;
    this.path = path;
    this.resource = resource;
  }
}
