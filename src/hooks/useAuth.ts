'use client';

import { useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuthErrorMessage } from '@/features/auth/errors';


export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const clearError = () => setError(null);

    const loginWithGoogle = async () => {
        clearError();
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error('Error logging in with Google', err);
            setError(getAuthErrorMessage(err, 'Falha ao entrar com Google'));
            throw err;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        clearError();
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (err) {
            console.error('Error logging in', err);
            setError(getAuthErrorMessage(err, 'Falha ao entrar'));
            throw err;
        }
    }

    const registerWithEmail = async (email: string, pass: string, name: string) => {
        clearError();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(userCredential.user, { displayName: name });
            // Force refresh user to get display name
            setUser({ ...userCredential.user, displayName: name });
        } catch (err) {
            console.error('Error registering', err);
            setError(getAuthErrorMessage(err, 'Falha ao registrar'));
            throw err;
        }
    }

    const logout = async () => {
        clearError();
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Error logging out', err);
            setError(getAuthErrorMessage(err, 'Falha ao sair'));
            throw err;
        }
    };

    return {
        user,
        loading,
        error,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
    };
}
