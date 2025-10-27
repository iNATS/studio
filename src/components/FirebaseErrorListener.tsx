
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code, ServerCrash } from 'lucide-react';
import { Button } from './ui/button';

export const FirebaseErrorListener = () => {
    const { toast } = useToast();
    const [error, setError] = useState<FirestorePermissionError | null>(null);

    useEffect(() => {
        const handleError = (e: FirestorePermissionError) => {
            setError(e);
            toast({
                variant: 'destructive',
                title: 'Permission Denied',
                description: 'You do not have permission to perform this action. Check the details below.',
                duration: 10000,
            });
        };

        errorEmitter.on('permission-error', handleError);

        return () => {
            errorEmitter.off('permission-error', handleError);
        };
    }, [toast]);

    if (!error) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-2xl w-full bg-background border-destructive/50 shadow-2xl">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle className="text-xl font-bold">Firestore Security Rule Error</AlertTitle>
                <AlertDescription className="mt-2">
                    <p className="text-base">Your request was blocked by Firestore security rules.</p>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Operation:</strong> <code className="bg-destructive/20 text-destructive-foreground p-1 rounded-sm">{error.operation}</code></p>
                        <p><strong>Path:</strong> <code className="bg-destructive/20 text-destructive-foreground p-1 rounded-sm">{error.path}</code></p>
                        {error.resource && (
                            <div>
                                <strong>Resource Data:</strong>
                                <pre className="mt-1 p-2 bg-destructive/20 text-destructive-foreground rounded-md text-xs overflow-auto">
                                    {JSON.stringify(error.resource, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button variant="outline" onClick={() => setError(null)}>Dismiss</Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
};
