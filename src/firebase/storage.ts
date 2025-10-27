
'use client';

import { ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';

export const uploadFile = async (storage: FirebaseStorage, path: string, file: File): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};
