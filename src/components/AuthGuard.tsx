'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LiquidLoader } from "@/components/ui/liquid-loader";
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [roleLoading, setRoleLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Wait for Auth Loading
            if (authLoading) return;

            // 2. Not Authenticated
            if (!user) {
                if (!publicPaths.includes(pathname)) {
                    router.push('/login');
                } else {
                    setAuthorized(true);
                }
                setRoleLoading(false);
                return;
            }

            // 3. Authenticated - Check Role
            if (publicPaths.includes(pathname)) {
                // If on login/register but logged in, likely want to go home
                router.push('/');
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const role = data.role;

                    if (!role) {
                        // No role -> Force Onboarding
                        if (pathname !== '/onboarding') {
                            router.push('/onboarding');
                        } else {
                            setAuthorized(true);
                        }
                    } else {
                        // Has role -> Allow access (unless on onboarding?)
                        // If on onboarding but has role, maybe redirect to home?
                        // For now, allow access.
                        setAuthorized(true);
                    }
                } else {
                    // No doc -> Force Onboarding
                    if (pathname !== '/onboarding') {
                        router.push('/onboarding');
                    } else {
                        setAuthorized(true);
                    }
                }
            } catch (error) {
                console.error("AuthGuard Error", error);
            } finally {
                setRoleLoading(false);
            }
        };

        checkAuth();
    }, [user, authLoading, pathname, router]);

    if (authLoading || roleLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <LiquidLoader size="lg" />
            </div>
        );
    }

    if (!authorized) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
