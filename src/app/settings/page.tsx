'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { LiquidLoader } from '@/components/ui/liquid-loader';
import { Loader2, LogOut, Save, Copy, Link as LinkIcon, Unlink, Users, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePartner } from '@/hooks/usePartner';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [avgCycleLength, setAvgCycleLength] = useState('28');
    const [avgPeriodLength, setAvgPeriodLength] = useState('5');
    const [partnerInputCode, setPartnerInputCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const {
        partnerCode,
        linkedPartnerId,
        linkedAccountId,
        loading: partnerLoading,
        generateCode,
        linkPartner,
        unlinkPartner
    } = usePartner();

    const [userRole, setUserRole] = useState<'user' | 'partner' | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            if (user) {
                setName(user.displayName || '');
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserRole(data.role as 'user' | 'partner');
                    if (data.settings?.avgCycleLength) {
                        setAvgCycleLength(data.settings.avgCycleLength.toString());
                    }
                    if (data.settings?.avgPeriodLength) {
                        setAvgPeriodLength(data.settings.avgPeriodLength.toString());
                    }
                }
            }
            setFetching(false);
        };
        fetchSettings();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (user.displayName !== name) {
                await updateProfile(user, { displayName: name });
            }

            await setDoc(doc(db, 'users', user.uid), {
                displayName: name,
                email: user.email,
                settings: {
                    avgCycleLength: parseInt(avgCycleLength) || 28,
                    avgPeriodLength: parseInt(avgPeriodLength) || 5
                }
            }, { merge: true });

            toast.success("Configurações salvas com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar configurações");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (partnerCode) {
            navigator.clipboard.writeText(partnerCode);
            toast.success("Código copiado!");
        }
    };

    const handleLinkPartner = async () => {
        if (!partnerInputCode) return;
        await linkPartner(partnerInputCode);
        setPartnerInputCode('');
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LiquidLoader size="lg" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container max-w-lg mx-auto px-4 pt-4 md:px-6 md:pt-6 space-y-6 pb-12">
            <header className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight">Ajustes</h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Personalize seu perfil e suas preferências de acompanhamento.
                </p>
            </header>

            {/* Perfil */}
            <div className="liquid-glass rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Perfil</h2>
                        <p className="text-xs text-muted-foreground font-medium">Informações da sua conta Ondina</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email</Label>
                        <Input
                            id="email"
                            value={user.email || ''}
                            disabled
                            className="liquid-glass-subtle rounded-xl h-11 text-muted-foreground cursor-not-allowed border-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold text-foreground">Nome de Exibição</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                            className="liquid-glass-input rounded-xl h-11"
                        />
                    </div>
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full liquid-button-primary rounded-xl h-11 font-medium">
                    {loading ? <LiquidLoader size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Perfil
                </Button>
            </div>

            {/* Compartilhamento / Parceria */}
            <div className="liquid-glass rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-500 shadow-sm">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Acesso do Parceiro</h2>
                        <p className="text-xs text-muted-foreground font-medium">Compartilhamento seguro com ponta a ponta</p>
                    </div>
                </div>

                {userRole === 'user' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground">Seu Código de Compartilhamento</Label>
                            {partnerCode ? (
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 p-3.5 liquid-glass-subtle rounded-2xl font-mono text-center tracking-widest text-xl font-bold text-primary">
                                        {partnerCode}
                                    </div>
                                    <Button variant="outline" size="icon" onClick={handleCopyCode} className="liquid-glass-pill rounded-2xl h-12 w-12 hover:scale-105 transition-transform">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={generateCode} disabled={partnerLoading} className="w-full liquid-glass-pill rounded-xl h-11 font-medium hover:bg-white/40 dark:hover:bg-white/10">
                                    {partnerLoading ? <LiquidLoader size="sm" className="mr-2" /> : null}
                                    Gerar Código de Acesso
                                </Button>
                            )}
                            <p className="text-xs text-muted-foreground font-medium">
                                Compartilhe este código para que seu parceiro possa acompanhar seu ciclo e receber dicas de apoio.
                            </p>
                        </div>

                        {linkedPartnerId && (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                                    <Users className="h-4 w-4" />
                                    <span>Seu ciclo está sendo compartilhado</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={unlinkPartner} disabled={partnerLoading} className="liquid-glass-pill text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 rounded-xl h-9 px-3 font-medium">
                                    <Unlink className="h-3.5 w-3.5 mr-1.5" /> Desconectar
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {userRole === 'partner' && (
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-muted-foreground">Conectar-se ao Ciclo Dela</Label>
                        {linkedAccountId ? (
                            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex flex-col items-center space-y-3">
                                <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">
                                    Você está conectado e acompanhando um ciclo compartilhado.
                                </p>
                                <Button variant="outline" onClick={unlinkPartner} disabled={partnerLoading} className="w-full liquid-glass-pill text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 rounded-xl h-11 font-medium mt-1">
                                    <Unlink className="h-4 w-4 mr-2" /> Desconectar Parceria
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="CÓDIGO (6 DÍGITOS)"
                                    value={partnerInputCode}
                                    onChange={(e) => setPartnerInputCode(e.target.value.toUpperCase())}
                                    maxLength={6}
                                    className="liquid-glass-input rounded-xl tracking-widest text-center font-mono font-bold"
                                />
                                <Button onClick={handleLinkPartner} disabled={!partnerInputCode || partnerLoading} className="liquid-button-primary rounded-xl h-10 px-5">
                                    {partnerLoading ? <LiquidLoader size="sm" /> : <LinkIcon className="h-4 w-4" />}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Ciclo Regular */}
            {userRole !== 'partner' && (
                <div className="liquid-glass rounded-3xl p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Preferências do Ciclo</h2>
                        <p className="text-xs text-muted-foreground font-medium">Médias usadas para calcular previsões de fases</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="cycleLength" className="text-xs font-semibold text-foreground">
                                Duração Média do Ciclo (dias)
                            </Label>
                            <Input
                                id="cycleLength"
                                type="number"
                                value={avgCycleLength}
                                onChange={(e) => setAvgCycleLength(e.target.value)}
                                min="20"
                                max="45"
                                className="liquid-glass-input rounded-xl h-11"
                            />
                            <p className="text-[11px] text-muted-foreground">Geralmente varia entre 24 e 35 dias (média de 28).</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="periodLength" className="text-xs font-semibold text-foreground">
                                Duração Média da Menstruação (dias)
                            </Label>
                            <Input
                                id="periodLength"
                                type="number"
                                value={avgPeriodLength}
                                onChange={(e) => setAvgPeriodLength(e.target.value)}
                                min="1"
                                max="10"
                                className="liquid-glass-input rounded-xl h-11"
                            />
                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={loading} className="w-full liquid-button-primary rounded-xl h-11 font-medium">
                        {loading ? <LiquidLoader size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Preferências
                    </Button>
                </div>
            )}

            {/* Logout Button */}
            <Button
                variant="outline"
                className="w-full rounded-2xl h-12 liquid-glass-pill text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-semibold cursor-pointer"
                onClick={handleLogout}
            >
                <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
            </Button>

            {/* Espaçamento dedicado para nunca ser coberto pela barra de navegação flutuante */}
            <div className="h-28 w-full select-none pointer-events-none" aria-hidden="true" />
        </div>
    );
}
