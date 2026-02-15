'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { Loader2, LogOut, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { usePartner } from '@/hooks/usePartner';
import { Copy, Link as LinkIcon, Unlink, Users } from 'lucide-react';

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
            // ... existing logic ...
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
            // Update Auth Profile (Display Name)
            if (user.displayName !== name) {
                await updateProfile(user, { displayName: name });
            }

            // Update Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: name,
                email: user.email,
                settings: {
                    avgCycleLength: parseInt(avgCycleLength) || 28,
                    avgPeriodLength: parseInt(avgPeriodLength) || 5
                }
            }, { merge: true });

            toast.success("Configurações salvas com sucesso!");
        } catch (error: any) {
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
    }

    if (fetching) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container max-w-lg mx-auto p-4 space-y-6 pb-24">
            <h1 className="text-3xl font-bold">Configurações</h1>

            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                    <CardDescription>Gerencie suas informações pessoais.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user.email || ''} disabled className="bg-muted text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome de Exibição</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Perfil
                    </Button>
                </CardFooter>
            </Card>

            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Acesso do Parceiro</CardTitle>
                    <CardDescription>Compartilhe ou visualize dados do ciclo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Display Code Section - ONLY for Users (Women) */}
                    {userRole === 'user' && (
                        <>
                            <div className="space-y-2">
                                <Label>Seu Código de Compartilhamento</Label>
                                {partnerCode ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 p-3 bg-muted rounded-md font-mono text-center tracking-widest text-lg">
                                            {partnerCode}
                                        </div>
                                        <Button variant="outline" size="icon" onClick={handleCopyCode}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={generateCode} disabled={partnerLoading} variant="outline" className="w-full">
                                        {partnerLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                        Gerar Código
                                    </Button>
                                )}
                                <p className="text-xs text-muted-foreground">Compartilhe este código para que seu parceiro possa ver seu ciclo.</p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Ou</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Link Section - ONLY for Partners (Men) */}
                    {userRole === 'partner' && (
                        <div className="space-y-2">
                            <Label>Conectar-se a um Parceiro</Label>
                            {linkedAccountId ? (
                                <div className="p-4 border rounded-lg bg-primary/10 border-primary/20 flex flex-col items-center space-y-2">
                                    <p className="text-sm font-medium text-primary">Você está visualizando um ciclo vinculado</p>
                                    <Button variant="destructive" size="sm" onClick={unlinkPartner} disabled={partnerLoading}>
                                        <Unlink className="h-4 w-4 mr-2" /> Desconectar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Insira o código do parceiro"
                                        value={partnerInputCode}
                                        onChange={(e) => setPartnerInputCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                    />
                                    <Button onClick={handleLinkPartner} disabled={!partnerInputCode || partnerLoading}>
                                        {partnerLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Show Connected Partner for User (Woman) if linked */}
                    {userRole === 'user' && linkedPartnerId && (
                        <div className="space-y-2">
                            <Label>Parceiro Vinculado</Label>
                            <div className="p-3 border rounded-lg bg-green-500/10 border-green-500/20 flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Seu ciclo está sendo compartilhado.</span>
                                <Button variant="ghost" size="sm" onClick={unlinkPartner} disabled={partnerLoading} className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-100">
                                    <Unlink className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Only show cycle preferences for regular users */}
            {userRole !== 'partner' && (
                <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>Preferências do Ciclo</CardTitle>
                        <CardDescription>Ajuste as previsões do seu ciclo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cycleLength">Duração Média do Ciclo (Dias)</Label>
                            <Input
                                id="cycleLength"
                                type="number"
                                value={avgCycleLength}
                                onChange={(e) => setAvgCycleLength(e.target.value)}
                                min="20"
                                max="45"
                            />
                            <p className="text-xs text-muted-foreground">Um ciclo típico dura 28 dias.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="periodLength">Duração Média da Menstruação (Dias)</Label>
                            <Input
                                id="periodLength"
                                type="number"
                                value={avgPeriodLength}
                                onChange={(e) => setAvgPeriodLength(e.target.value)}
                                min="1"
                                max="10"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSave} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <Button variant="destructive" className="w-full rounded-xl h-12" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
            </Button>
        </div>
    );
}
