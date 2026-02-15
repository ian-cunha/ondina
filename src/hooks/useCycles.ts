import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { Cycle } from '@/types';

export function useCycles(userId?: string) {
    const { user } = useAuth();
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [loading, setLoading] = useState(true);

    const targetUserId = userId || user?.uid;

    useEffect(() => {
        if (!targetUserId) {
            if (cycles.length > 0) setCycles([]);
            if (loading) setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, 'users', targetUserId, 'cycles'),
            orderBy('startDate', 'desc')
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const cyclesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Cycle[];
                setCycles(cyclesData);
                setLoading(false);
            },
            (error) => {
                console.log("Error fetching cycles (likely logged out):", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetUserId]);

    const addCycle = async (startDate: Date) => {
        if (!user) return;

        // Ensure no duplicate start dates (basic check)
        const exists = cycles.find(c => c.startDate.split('T')[0] === startDate.toISOString().split('T')[0]);
        if (exists) {
            throw new Error("A cycle already exists for this date.");
        }

        await addDoc(collection(db, 'users', user.uid, 'cycles'), {
            startDate: startDate.toISOString(),
        });
    };

    const deleteCycle = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'cycles', id));
    };

    return { cycles, loading, addCycle, deleteCycle };
}
