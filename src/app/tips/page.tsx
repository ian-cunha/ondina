'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePartner } from '@/hooks/usePartner';
import { useCycles } from '@/hooks/useCycles';
import { usePartnerTips } from '@/features/partner/usePartnerTips';
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { differenceInDays } from 'date-fns';
import { LiquidLoader } from '@/components/ui/liquid-loader';
import { Loader2, Lightbulb, HeartHandshake, Sparkles, Activity, Utensils, Info } from 'lucide-react';

export default function TipsPage() {
    const { user } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();
    const { cycles, loading: cyclesLoading } = useCycles(linkedAccountId || undefined);

    const getCurrentDay = () => {
        if (!cycles || cycles.length === 0) return 1;
        const lastCycleStart = new Date(cycles[0].startDate);
        const today = new Date();
        const diff = differenceInDays(today, lastCycleStart);
        return diff + 1;
    };
    const currentDay = getCurrentDay();
    const { currentStatus: moodStatus } = useMoodPrediction(currentDay);
    const tips = usePartnerTips(currentDay);

    const isLoading = partnerLoading || cyclesLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LiquidLoader size="lg" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="container max-w-2xl mx-auto px-4 pt-4 md:px-6 md:pt-6 space-y-6 pb-32">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500 shadow-sm">
                        <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Guia de Apoio</h1>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            Como cuidar e se conectar com sua parceira no dia de hoje.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    <div className="liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span className="text-muted-foreground">Fase Atual:</span>
                        <span className="font-bold text-primary">{moodStatus.label}</span>
                    </div>
                    <div className="liquid-glass-subtle px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground">
                        Dia {currentDay} do ciclo dela
                    </div>
                </div>
            </header>

            <div className="grid gap-5">
                {/* Emocional */}
                <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6 bg-gradient-to-br from-rose-500/[0.06] to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-500 shadow-sm">
                            <HeartHandshake className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Apoio Emocional</h2>
                            <p className="text-xs text-muted-foreground font-medium">Como acolher e oferecer segurança</p>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {tips.emotional.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 font-medium">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] flex-shrink-0" />
                                <span className="leading-relaxed">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Físico */}
                <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6 bg-gradient-to-br from-sky-500/[0.06] to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-500 shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Conforto Físico</h2>
                            <p className="text-xs text-muted-foreground font-medium">Gestos práticos de alívio e bem-estar</p>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {tips.physical.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 font-medium">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.6)] flex-shrink-0" />
                                <span className="leading-relaxed">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Atividades */}
                <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6 bg-gradient-to-br from-emerald-500/[0.06] to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 shadow-sm">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Atividades & Espaço</h2>
                            <p className="text-xs text-muted-foreground font-medium">O que fazer a dois (ou dar um tempo para descanso)</p>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {tips.activity.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 font-medium">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] flex-shrink-0" />
                                <span className="leading-relaxed">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Alimentação */}
                <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6 bg-gradient-to-br from-amber-500/[0.06] to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500 shadow-sm">
                            <Utensils className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Alimentação & Hidratação</h2>
                            <p className="text-xs text-muted-foreground font-medium">Sugestões nutritivas e acolhedoras</p>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {tips.food.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 font-medium">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)] flex-shrink-0" />
                                <span className="leading-relaxed">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="liquid-glass-subtle rounded-2xl p-4 flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                <Info className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                <p>
                    Estas orientações são sugestões gerais baseadas na fisiologia de cada fase. A comunicação aberta com sua parceira é sempre o melhor caminho para entender as necessidades específicas dela.
                </p>
            </div>

            {/* Espaçamento dedicado para nunca ser coberto pela barra de navegação flutuante */}
            <div className="h-28 w-full select-none pointer-events-none" aria-hidden="true" />
        </div>
    );
}
