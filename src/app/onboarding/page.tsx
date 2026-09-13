'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LiquidLoader } from "@/components/ui/liquid-loader";
import { Loader2, Heart, Users, Sparkles, ArrowLeft } from 'lucide-react';
import { usePartner } from '@/hooks/usePartner';

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState<'role' | 'details' | 'partner-code'>('role');
    const [loading, setLoading] = useState(false);

    // Form states
    const [periodLength, setPeriodLength] = useState('5');
    const [cycleLength, setCycleLength] = useState('28');
    const [accessCode, setAccessCode] = useState('');

    const { linkPartner } = usePartner();

    useEffect(() => {
        const checkExistingUser = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    if (data.role) {
                        router.push('/');
                    }
                }
            }
        };
        checkExistingUser();
    }, [user, router]);

    const handleRoleSelect = (selectedRole: 'user' | 'partner') => {
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
        } catch (error) {
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
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: user.displayName,
                role: 'partner',
            }, { merge: true });

            await linkPartner(accessCode);
            router.push('/');
        } catch (error) {
            toast.error("Erro ao conectar. Verifique o código.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative">
            <div className="w-full max-w-md liquid-glass rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute -top-20 -left-20 w-44 h-44 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl pointer-events-none" />

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-primary/15 text-primary mb-1 shadow-sm">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        {step === 'role' ? 'Boas-vindas ao Ondina' : step === 'details' ? 'Seu Perfil de Ciclo' : 'Conectar à Parceira'}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        {step === 'role' ? 'Escolha como deseja interagir com o aplicativo:' :
                            step === 'details' ? 'Informe as médias para calcularmos previsões precisas.' :
                                'Digite o código de 6 dígitos gerado pela sua parceira.'}
                    </p>
                </div>

                {/* Step 1: Role Selection */}
                {step === 'role' && (
                    <div className="grid gap-4 pt-2">
                        <button
                            type="button"
                            className="liquid-glass liquid-glass-interactive rounded-2xl p-5 text-left flex items-center gap-4 cursor-pointer group bg-gradient-to-r from-rose-500/[0.06] to-transparent"
                            onClick={() => handleRoleSelect('user')}
                        >
                            <div className="h-12 w-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                                <Heart className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="text-base font-bold text-foreground block">
                                    Acompanhar Meu Ciclo
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Monitoramento pessoal, previsões e registro diário
                                </span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className="liquid-glass liquid-glass-interactive rounded-2xl p-5 text-left flex items-center gap-4 cursor-pointer group bg-gradient-to-r from-purple-500/[0.06] to-transparent"
                            onClick={() => handleRoleSelect('partner')}
                        >
                            <div className="h-12 w-12 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-500 shadow-sm group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <span className="text-base font-bold text-foreground block">
                                    Acompanhar Parceira
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Visão do ciclo compartilhado e dicas para apoiar
                                </span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Step 2: Cycle Details */}
                {step === 'details' && (
                    <div className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="periodLength" className="text-xs font-semibold text-foreground">
                                Duração da Menstruação (dias)
                            </Label>
                            <Input
                                id="periodLength"
                                type="number"
                                value={periodLength}
                                onChange={(e) => setPeriodLength(e.target.value)}
                                min="1"
                                max="10"
                                className="liquid-glass-input rounded-xl h-11"
                            />
                            <p className="text-[11px] text-muted-foreground">Normalmente varia entre 3 e 7 dias.</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="cycleLength" className="text-xs font-semibold text-foreground">
                                Duração Média do Ciclo (dias)
                            </Label>
                            <Input
                                id="cycleLength"
                                type="number"
                                value={cycleLength}
                                onChange={(e) => setCycleLength(e.target.value)}
                                min="20"
                                max="45"
                                className="liquid-glass-input rounded-xl h-11"
                            />
                            <p className="text-[11px] text-muted-foreground">Média comum é de 28 dias.</p>
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <Button
                                variant="ghost"
                                onClick={() => setStep('role')}
                                disabled={loading}
                                className="liquid-glass-pill rounded-xl h-11 px-4 cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                            </Button>
                            <Button
                                onClick={handleSaveUser}
                                disabled={loading}
                                className="flex-1 liquid-button-primary rounded-xl h-11 font-medium cursor-pointer"
                            >
                                {loading ? <LiquidLoader size="sm" className="mr-2" /> : null}
                                Começar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Partner Code */}
                {step === 'partner-code' && (
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="accessCode" className="text-xs font-semibold text-foreground">
                                Código de Acesso do Parceiro
                            </Label>
                            <Input
                                id="accessCode"
                                placeholder="EX: A1B2C3"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="liquid-glass-input rounded-xl h-12 text-center tracking-widest font-mono font-bold text-lg uppercase"
                            />
                            <p className="text-xs text-muted-foreground text-center font-medium">
                                Peça para a sua parceira o código gerado em Ajustes &gt; Acesso do Parceiro.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <Button
                                variant="ghost"
                                onClick={() => setStep('role')}
                                disabled={loading}
                                className="liquid-glass-pill rounded-xl h-11 px-4 cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                            </Button>
                            <Button
                                onClick={handleSavePartner}
                                disabled={loading || !accessCode}
                                className="flex-1 liquid-button-primary rounded-xl h-11 font-medium cursor-pointer"
                            >
                                {loading ? <LiquidLoader size="sm" className="mr-2" /> : null}
                                Conectar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
