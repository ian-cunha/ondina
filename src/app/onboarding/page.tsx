'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ArrowRight, Heart, Users } from 'lucide-react';
import { toast } from 'sonner';
import { usePartner } from '@/hooks/usePartner';

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { linkPartner } = usePartner();

    const [step, setStep] = useState<'role' | 'details' | 'partner-code'>('role');
    const [role, setRole] = useState<'user' | 'partner' | null>(null);

    // User Details
    const [periodLength, setPeriodLength] = useState('5');
    const [cycleLength, setCycleLength] = useState('28');

    // Partner Details
    const [accessCode, setAccessCode] = useState('');

    const [loading, setLoading] = useState(false);

    const handleRoleSelect = (selectedRole: 'user' | 'partner') => {
        setRole(selectedRole);
        if (selectedRole === 'user') {
            setStep('details');
        } else {
            setStep('partner-code');
        }
    };

    const handleSaveUser = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: user.displayName,
                role: 'user',
                settings: {
                    avgPeriodLength: parseInt(periodLength) || 5,
                    avgCycleLength: parseInt(cycleLength) || 28
                }
            }, { merge: true });

            toast.success("Perfil configurado com sucesso!");
            router.push('/');
        } catch (error: any) {
            toast.error("Erro ao salvar configurações.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePartner = async () => {
        if (!user) return;
        if (!accessCode) {
            toast.error("Por favor, insira o código.");
            return;
        }
        setLoading(true);
        try {
            // First, set the role in the user document
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: user.displayName,
                role: 'partner',
            }, { merge: true });

            // Then try to link
            // Note: linkPartner from hook might need minor adjustment if it relies on 'users' doc existing perfectly?
            // But we just created/updated it above.

            // We need to call the logic of linking manually or via hook.
            // The hook function `linkPartner` does: checks invite -> updates my linkedAccountId -> updates their partnerId.

            await linkPartner(accessCode);

            // If linkPartner throws, we catch it. If it succeeds:
            // toast is handled in hook, but we can redirect.

            // We check if it actually succeeded by maybe checking specific return or just assuming success if no error thrown?
            // The hook currently returns void.

            router.push('/');
        } catch (error: any) {
            toast.error("Erro ao conectar. Verifique o código.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
            <Card className="w-full max-w-md border-none shadow-2xl bg-card/50 backdrop-blur-xl transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        {step === 'role' ? 'Boas-vindas!' : step === 'details' ? 'Sobre você' : 'Conectar Parceiro'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 'role' ? 'Como você deseja usar o Ondina?' :
                            step === 'details' ? 'Ajude-nos a prever seu ciclo.' :
                                'Insira o código fornecido pela sua parceira.'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {step === 'role' && (
                        <div className="grid gap-4">
                            <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 cursor-pointer"
                                onClick={() => handleRoleSelect('user')}
                            >
                                <Heart className="h-8 w-8 text-primary" />
                                <span className="font-semibold">Acompanhar meu Ciclo</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-24 flex flex-col gap-2 hover:border-purple-500 hover:bg-purple-500/5 cursor-pointer"
                                onClick={() => handleRoleSelect('partner')}
                            >
                                <Users className="h-8 w-8 text-purple-500" />
                                <span className="font-semibold">Acompanhar Parceira</span>
                            </Button>
                        </div>
                    )}

                    {step === 'details' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="periodLength">Duração da Menstruação (dias)</Label>
                                <Input
                                    id="periodLength"
                                    type="number"
                                    value={periodLength}
                                    onChange={(e) => setPeriodLength(e.target.value)}
                                    min="1"
                                    max="10"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cycleLength">Duração do Ciclo (dias)</Label>
                                <Input
                                    id="cycleLength"
                                    type="number"
                                    value={cycleLength}
                                    onChange={(e) => setCycleLength(e.target.value)}
                                    min="20"
                                    max="45"
                                    className="bg-background/50"
                                />
                            </div>
                        </>
                    )}

                    {step === 'partner-code' && (
                        <div className="space-y-2">
                            <Label htmlFor="accessCode">Código de Acesso</Label>
                            <Input
                                id="accessCode"
                                placeholder="Ex: X7Y2Z9"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="bg-background/50 text-center tracking-widest text-lg uppercase"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Peça para a sua parceira gerar o código em Ajustes {'>'} Acesso do Parceiro.
                            </p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between">
                    {step !== 'role' && (
                        <Button variant="ghost" onClick={() => setStep('role')} disabled={loading}>
                            Voltar
                        </Button>
                    )}

                    {step === 'details' && (
                        <Button onClick={handleSaveUser} disabled={loading} className="ml-auto w-full sm:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Começar"}
                        </Button>
                    )}

                    {step === 'partner-code' && (
                        <Button onClick={handleSavePartner} disabled={loading || !accessCode} className="ml-auto w-full sm:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Conectar"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
