'use client';

import { useCycles } from '@/hooks/useCycles';
import { usePartner } from '@/hooks/usePartner';
import { useAuth } from '@/hooks/useAuth';
import { CycleStatusCircle } from '@/features/cycle/CycleStatusCircle'; // We reuse logic to get current day? 
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Loader2, Smile, AlertCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function MoodPage() {
    const { user } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();

    // Determine whose cycles to fetch
    const targetUserId = linkedAccountId || (user ? user.uid : undefined);
    const { cycles, loading: cyclesLoading } = useCycles(targetUserId);

    // Calculate current cycle day
    // This logic duplicates logic in CycleStatusCircle, ideally we'd extract it to a hook "useCycleStatus"
    // For now, quick calculation:

    const getCurrentDay = () => {
        if (!cycles || cycles.length === 0) return 1;
        const lastCycleStart = new Date(cycles[0].startDate);
        const today = new Date();
        const diff = differenceInDays(today, lastCycleStart);
        return diff + 1; // 1-based index
    };

    const currentDay = getCurrentDay();
    const { chartData, currentStatus } = useMoodPrediction(currentDay);

    const isLoading = (user && cyclesLoading) || partnerLoading;

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!user) return null;

    return (
        <div className="container max-w-lg mx-auto p-4 space-y-6 pb-24">
            <h1 className="text-3xl font-bold">Humor & Bem-estar</h1>

            {/* Current Status Card */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smile className="h-6 w-6 text-primary" />
                        Dia {currentStatus.day}: {currentStatus.label}
                    </CardTitle>
                    <CardDescription>
                        Previsão baseada nos hormônios
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold mb-2 text-primary">
                        {currentStatus.mood > 80 ? "Radiante 🤩" :
                            currentStatus.mood > 60 ? "Bem 🙂" :
                                currentStatus.mood > 40 ? "Reflexiva 😐" : "Sensível 🥺"}
                    </div>
                    <p className="text-muted-foreground">
                        {currentStatus.hormones.estrogen === 'peak' ? "Estrogênio no pico! Você deve se sentir confiante e com energia." :
                            currentStatus.hormones.progesterone === 'rising' ? "Progesterona subindo. Um momento de calma e foco." :
                                currentStatus.hormones.progesterone === 'dropping' ? "Níveis hormonais caindo. Seja gentil consigo mesma." :
                                    "Início de um novo ciclo. Descanse e recarregue."}
                    </p>
                </CardContent>
            </Card>

            {/* Chart */}
            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Variação Mensal</CardTitle>
                    <CardDescription>Seu ritmo emocional, visualizado.</CardDescription>
                </CardHeader>
                <CardContent className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                interval={6}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="mood"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorMood)"
                                strokeWidth={3}
                            />
                            <ReferenceLine x={currentDay} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Hoje" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                    O gráfico é baseado em médias hormonais gerais. Seu ciclo é único e fatores externos (estresse, sono) influenciam seu humor.
                </p>
            </div>
        </div>
    );
}
