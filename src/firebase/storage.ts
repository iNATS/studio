
'use client';

import { ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';

export const uploadFile = async (storage: FirebaseStorage, path: string, file: File) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};
