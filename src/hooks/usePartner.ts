import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteField, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function usePartner() {
    const { user } = useAuth();
    const [partnerCode, setPartnerCode] = useState<string | null>(null);
    const [linkedPartnerId, setLinkedPartnerId] = useState<string | null>(null);
    const [linkedAccountId, setLinkedAccountId] = useState<string | null>(null);
    const [role, setRole] = useState<'user' | 'partner' | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch partner status on load
    useEffect(() => {
        if (!user) return;

        const fetchPartnerData = async () => {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPartnerCode(data.partnerCode || null);
                setLinkedPartnerId(data.partnerId || null); // Who is watching me
                setLinkedAccountId(data.linkedAccountId || null); // Who I am watching
                setRole(data.role as 'user' | 'partner' || null);
            }
        };

        fetchPartnerData();
    }, [user]);

    const generateCode = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Generate simple 6-char code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Save to user profile
            await setDoc(doc(db, 'users', user.uid), {
                partnerCode: code
            }, { merge: true });

            // Save to invites collection for lookup
            await setDoc(doc(db, 'invites', code), {
                inviterId: user.uid,
                createdAt: new Date().toISOString()
            });

            setPartnerCode(code);
            toast.success("Código gerado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar código");
        } finally {
            setLoading(false);
        }
    };

    const linkPartner = async (code: string) => {
        if (!user) return;
        setLoading(true);
        try {
            // Lookup code
            const inviteRef = doc(db, 'invites', code);
            const inviteSnap = await getDoc(inviteRef);

            if (!inviteSnap.exists()) {
                toast.error("Código inválido ou expirado.");
                return;
            }

            const { inviterId } = inviteSnap.data();

            if (inviterId === user.uid) {
                toast.error("Você não pode usar seu próprio código.");
                return;
            }

            // REMOVED: Check if inviter already has a partner (Permissions prevent reading inviter doc)
            // We rely on Firestore Rules to fail the write if partnerId is already set.

            // Atomic update using Batch
            const batch = writeBatch(db);
            const userRef = doc(db, 'users', user.uid);
            const inviterRef = doc(db, 'users', inviterId);

            batch.set(userRef, {
                linkedAccountId: inviterId
            }, { merge: true });

            batch.set(inviterRef, {
                partnerId: user.uid
            }, { merge: true });

            await batch.commit();

            setLinkedAccountId(inviterId);
            toast.success("Conectado com sucesso!");
        } catch (error: any) {
            console.error(error);
            let msg = "Erro ao conectar parceiro";
            if (error.message.includes("permission-denied") || error.message.includes("Missing or insufficient permissions")) {
                msg = "Este código já está sendo usado por outro parceiro.";
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const unlinkPartner = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // If I am watching someone (Partner Mode)
            if (linkedAccountId) {
                // Remove me from their profile
                await updateDoc(doc(db, 'users', linkedAccountId), {
                    partnerId: deleteField()
                });
                // Remove them from my profile
                await updateDoc(doc(db, 'users', user.uid), {
                    linkedAccountId: deleteField()
                });
                setLinkedAccountId(null);
            }
            // If someone is watching me (User Mode)
            else if (linkedPartnerId) {
                // Remove me from their profile (need to find who has me as linkedAccountId)
                // This is tricky without a direct link, but typically we know partnerId
                await updateDoc(doc(db, 'users', linkedPartnerId), {
                    linkedAccountId: deleteField()
                });
                // Remove them from my profile
                await updateDoc(doc(db, 'users', user.uid), {
                    partnerId: deleteField()
                });
                setLinkedPartnerId(null);
            }

            toast.success("Desconectado com sucesso.");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao desconectar");
        } finally {
            setLoading(false);
        }
    };

    return {
        partnerCode,
        linkedPartnerId,
        linkedAccountId,
        loading,
        generateCode,
        linkPartner,
        unlinkPartner,
        role
    };
}
