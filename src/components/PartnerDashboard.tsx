'use client';

import { CycleStatusCircle } from '@/features/cycle/CycleStatusCircle';
import { useCyclePrediction } from '@/features/cycle/useCyclePrediction';
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { useAuth } from '@/hooks/useAuth';
import { useCycles } from '@/hooks/useCycles';
import { usePartner } from '@/hooks/usePartner';
import { Loader2, Heart, Lightbulb, Smile, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';

export function PartnerDashboard() {
    const { user, logout } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();

    // We fetch the cycles of the LINKED account
    const { cycles, loading: cyclesLoading } = useCycles(linkedAccountId || undefined);

    const prediction = useCyclePrediction(cycles);
    const currentCycleStart = cycles.length > 0 ? new Date(cycles[0].startDate) : new Date();

    // Mood Logic
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
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    // Get tip based on phase
    const getPartnerTip = (label: string) => {
        if (label.includes("Menstruação")) return "Ofereça conforto. Uma bolsa de água quente, chocolate ou apenas um abraço podem ajudar muito. Ela pode estar sentindo cólicas e cansaço.";
        if (label.includes("Folicular")) return "Energia em alta! É um ótimo momento para planejar atividades ao ar livre ou saírem juntos. Ela deve estar se sentindo mais disposta e sociável.";
        if (label.includes("Ovulação")) return "Pico de confiança e libido. Ela provavelmente está se sentindo ótima com ela mesma. Elogie e aproveite o momento.";
        if (label.includes("Lútea (Cedo)")) return "Fase de calmaria e foco. Ela pode estar mais introspectiva. Um bom momento para noites tranquilas em casa.";
        if (label.includes("TPM")) return "A paciência é sua melhor amiga agora. Ela pode estar se sentindo irritada ou triste devido à queda hormonal. Evite discussões desnecessárias e seja compreensivo.";
        return "Esteja presente e apoie.";
    };

    const tip = getPartnerTip(moodStatus.label);

    return (
        <div className="flex min-h-screen flex-col p-4 md:p-8 bg-background pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                        Acompanhando {user?.displayName || 'Parceira'}
                    </h1>
                    <p className="text-muted-foreground">
                        Fique por dentro do ciclo e saiba como apoiar.
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()} className="cursor-pointer">
                    <LogOut className="h-5 w-5" />
                </Button>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Cycle Status */}
                <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                    <CycleStatusCircle
                        startDate={currentCycleStart}
                        cycleLength={prediction.averageCycleLength}
                    />
                </div>

                <div className="flex flex-col gap-6 w-full max-w-2xl">
                    {/* Tip Card */}
                    <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-l-4 border-l-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lightbulb className="h-5 w-5 text-yellow-500" />
                                Dica para o Parceiro
                            </CardTitle>
                            <CardDescription>
                                Fase Atual: <span className="font-semibold text-foreground">{moodStatus.label}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium italic">
                                &quot;{tip}&quot;
                            </p>
                        </CardContent>
                    </Card>

                    {/* Mood Insight */}
                    <Card className="border-none shadow-md bg-card/60">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Smile className="h-4 w-4 text-primary" />
                                Como ela pode estar se sentindo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-1">
                                {moodStatus.mood > 80 ? "Radiante & Confiante" :
                                    moodStatus.mood > 60 ? "Bem & Estável" :
                                        moodStatus.mood > 40 ? "Reflexiva & Calma" : "Sensível & Cansada"}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Índice de Bem-estar estimado: {moodStatus.mood}/100
                            </p>
                        </CardContent>
                    </Card>

                    {/* Prediction */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-muted/50 border-none">
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Próxima Menstruação</p>
                                <p className="text-xl font-bold text-primary">
                                    {prediction.nextPeriodStart?.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) || '?'}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/50 border-none">
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Janela Fértil</p>
                                <p className="text-xl font-bold text-green-600">
                                    {prediction.fertileWindow ?
                                        `${prediction.fertileWindow.start.getDate()} - ${prediction.fertileWindow.end.getDate()} ${prediction.fertileWindow.end.toLocaleDateString('pt-BR', { month: 'short' })}`
                                        : '?'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
