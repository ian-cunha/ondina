'use client';

import { useAuth } from '@/hooks/useAuth';
import { Home, Calendar, Settings, Smile, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function BottomNav() {
    const { user } = useAuth();
    const pathname = usePathname();

    const [userRole, setUserRole] = useState<'user' | 'partner' | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            if (user) {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (snap.exists()) {
                    setUserRole(snap.data().role as 'user' | 'partner');
                }
            }
        };
        fetchRole();
    }, [user]);

    if (!user) return null;

    const navItems = [
        { href: '/', label: 'Início', icon: Home },
        { href: '/calendar', label: 'Calendário', icon: Calendar },
        ...(userRole === 'partner'
            ? [{ href: '/tips', label: 'Dicas', icon: Lightbulb }]
            : [{ href: '/mood', label: 'Humor', icon: Smile }]
        ),
        { href: '/settings', label: 'Ajustes', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-4 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-md z-50 select-none">
            <div className="liquid-dock rounded-3xl p-2 flex items-center justify-between gap-1 shadow-2xl">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-xs transition-colors duration-300",
                                isActive
                                    ? "text-primary font-semibold"
                                    : "text-muted-foreground font-medium hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-fuchsia-500/15 to-purple-500/20 border border-primary/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] -z-10" />
                            )}
                            <Icon className={cn(
                                "h-5 w-5 transition-transform duration-300",
                                isActive && "stroke-[2.2] filter drop-shadow-[0_2px_8px_rgba(217,70,239,0.35)]"
                            )} />
                            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                            {isActive && (
                                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary shadow-[0_0_6px_rgba(217,70,239,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
