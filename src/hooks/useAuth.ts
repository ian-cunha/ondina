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
    updateProfile,
    AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase';


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
        } catch (err: any) {
            console.error('Error logging in with Google', err);
            setError(err.message || 'Failed to login with Google');
            throw err;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        clearError();
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (err: any) {
            console.error('Error logging in', err);
            setError(err.message || 'Failed to login');
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
        } catch (err: any) {
            console.error('Error registering', err);
            setError(err.message || 'Failed to register');
            throw err;
        }
    }

    const logout = async () => {
        clearError();
        try {
            await signOut(auth);
        } catch (err: any) {
            console.error('Error logging out', err);
            setError(err.message || 'Failed to logout');
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
