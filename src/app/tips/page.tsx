'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePartner } from '@/hooks/usePartner';
import { useCycles } from '@/hooks/useCycles';
import { usePartnerTips } from '@/features/partner/usePartnerTips';
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!user) return null;

    return (
        <div className="container max-w-lg mx-auto p-4 space-y-6 pb-24">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-8 w-8 text-yellow-500" />
                    Guia de Apoio
                </h1>
                <p className="text-muted-foreground mt-2">
                    Fase Atual: <span className="font-semibold text-primary">{moodStatus.label}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                    Sua parceira está no dia {currentDay} do ciclo.
                </p>
            </header>

            <div className="grid gap-6">
                <Card className="border-none shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                            <HeartHandshake className="h-5 w-5" /> Emocional
                        </CardTitle>
                        <CardDescription>Como se conectar e dar suporte emocional.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {tips.emotional.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-5 w-5" /> Físico
                        </CardTitle>
                        <CardDescription>Gestos de carinho e conforto físico.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {tips.physical.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Activity className="h-5 w-5" /> Atividades
                        </CardTitle>
                        <CardDescription>O que fazer juntos (ou dar espaço).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {tips.activity.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <Utensils className="h-5 w-5" /> Alimentação
                        </CardTitle>
                        <CardDescription>Sugestões do que comer ou preparar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {tips.food.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="p-4 rounded-lg bg-muted text-xs text-muted-foreground flex gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>Estas dicas são baseadas em variações hormonais gerais. Observe sempre o que sua parceira diz que precisa.</p>
            </div>
        </div>
    );
}
