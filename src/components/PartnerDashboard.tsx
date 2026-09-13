'use client';

import { CycleStatusCircle } from '@/features/cycle/CycleStatusCircle';
import { useCyclePrediction } from '@/features/cycle/useCyclePrediction';
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { useAuth } from '@/hooks/useAuth';
import { useCycles } from '@/hooks/useCycles';
import { usePartner } from '@/hooks/usePartner';
import { LiquidLoader } from '@/components/ui/liquid-loader';
import { Loader2, Heart, Lightbulb, Smile, LogOut, Calendar, Sparkles } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';

export function PartnerDashboard() {
    const { user, logout } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();

    const { cycles, loading: cyclesLoading } = useCycles(linkedAccountId || undefined);
    const prediction = useCyclePrediction(cycles);
    const currentCycleStart = cycles.length > 0 ? new Date(cycles[0].startDate) : new Date();

    const getCurrentDay = () => {
        if (!cycles || cycles.length === 0) return 1;
        const lastCycleStart = new Date(cycles[0].startDate);
        const today = new Date();
        const diff = differenceInDays(today, lastCycleStart);
        return diff + 1;
    };
    const currentDay = getCurrentDay();
    const { currentStatus: moodStatus } = useMoodPrediction(currentDay);

    const isLoading = partnerLoading || cyclesLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LiquidLoader size="lg" />
            </div>
        );
    }

    const getPartnerTip = (label: string) => {
        if (label.includes("Menstruação")) return "Ofereça conforto. Uma bolsa térmica morna, um agrado ou apenas um abraço carinhoso fazem toda a diferença agora.";
        if (label.includes("Folicular")) return "A energia e a sociabilidade dela estão subindo! Excelente oportunidade para combinar passeios e novas experiências juntos.";
        if (label.includes("Ovulação")) return "Pico de vitalidade, magnetismo e disposição. Elogie e aproveite a conexão especial deste momento.";
        if (label.includes("Lútea")) return "Fase de calmaria e introspecção. Momentos aconchegantes em casa e um ouvido atencioso são o melhor suporte.";
        if (label.includes("TPM")) return "A paciência e o afeto são essenciais. Mudanças hormonais podem causar sensibilidade temporária. Demonstre apoio contínuo.";
        return "Esteja presente com carinho e escuta ativa.";
    };

    const tip = getPartnerTip(moodStatus.label);

    return (
        <div className="flex min-h-screen flex-col px-4 pt-4 md:px-8 md:pt-8 max-w-5xl mx-auto pb-12">
            <header className="flex justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-500 shadow-md">
                        <Heart className="h-6 w-6 fill-rose-500/40" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Acompanhando {user?.displayName || 'sua Parceira'}
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            Ritmo hormonal compartilhado e orientações de apoio.
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logout()}
                    className="liquid-glass-pill rounded-full h-11 w-11 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                    title="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
                {/* Hero Dial */}
                <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
                    <CycleStatusCircle
                        startDate={currentCycleStart}
                        cycleLength={prediction.averageCycleLength}
                    />
                </div>

                <div className="flex flex-col gap-5 w-full max-w-xl">
                    {/* Dica do Parceiro */}
                    <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6 bg-gradient-to-br from-amber-500/[0.08] via-purple-500/[0.04] to-transparent relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                                <Lightbulb className="h-5 w-5" />
                                <span>Dica de Apoio de Hoje</span>
                            </div>
                            <span className="liquid-glass-pill px-3 py-1 rounded-full text-xs font-semibold text-primary">
                                {moodStatus.label}
                            </span>
                        </div>
                        <p className="text-base md:text-lg font-medium text-foreground/95 leading-relaxed italic mt-1">
                            &quot;{tip}&quot;
                        </p>
                    </div>

                    {/* Humor Estimado */}
                    <div className="liquid-glass liquid-glass-interactive rounded-3xl p-5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            <Smile className="h-4 w-4 text-primary" />
                            <span>Como ela pode estar se sentindo</span>
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-foreground">
                            {moodStatus.mood > 80 ? "Radiante & Confiante ✨" :
                                moodStatus.mood > 60 ? "Bem & Estável 🙂" :
                                    moodStatus.mood > 40 ? "Reflexiva & Calma 🌿" : "Sensível & Cansada 🤍"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            Nível de bem-estar hormonal projetado: {moodStatus.mood}%
                        </p>
                    </div>

                    {/* Previsões em Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="liquid-glass rounded-2xl p-4 bg-gradient-to-br from-rose-500/[0.05] to-transparent">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                                <Calendar className="h-3.5 w-3.5 text-rose-500" />
                                <span>Próxima Menstruação</span>
                            </div>
                            <p className="text-xl font-bold text-rose-500">
                                {prediction.nextPeriodStart?.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) || 'Calculando...'}
                            </p>
                        </div>

                        <div className="liquid-glass rounded-2xl p-4 bg-gradient-to-br from-emerald-500/[0.05] to-transparent">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Janela Fértil</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                {prediction.fertileWindow ?
                                    `${prediction.fertileWindow.start.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} – ${prediction.fertileWindow.end.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`
                                    : 'Calculando...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Espaçamento dedicado para nunca ser coberto pela barra de navegação flutuante */}
            <div className="h-28 w-full select-none pointer-events-none" aria-hidden="true" />
        </div>
    );
}
