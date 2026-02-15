'use client';

import { useAuth } from '@/hooks/useAuth';
import { Home, Calendar, Settings, Smile, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
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
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe">
            <div className="flex h-16 items-center justify-around px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors hover:text-primary",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Icon className="h-6 w-6" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}
