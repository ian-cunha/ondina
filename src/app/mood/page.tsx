'use client';

import { useCycles } from '@/hooks/useCycles';
import { usePartner } from '@/hooks/usePartner';
import { useAuth } from '@/hooks/useAuth';
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { LiquidLoader } from '@/components/ui/liquid-loader';
import { Loader2, Smile, AlertCircle, Activity, Sparkles } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function MoodPage() {
    const { user } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();

    const targetUserId = linkedAccountId || (user ? user.uid : undefined);
    const { cycles, loading: cyclesLoading } = useCycles(targetUserId);

    const getCurrentDay = () => {
        if (!cycles || cycles.length === 0) return 1;
        const lastCycleStart = new Date(cycles[0].startDate);
        const today = new Date();
        const diff = differenceInDays(today, lastCycleStart);
        return diff + 1;
    };

    const currentDay = getCurrentDay();
    const { chartData, currentStatus } = useMoodPrediction(currentDay);

    const isLoading = (user && cyclesLoading) || partnerLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LiquidLoader size="lg" />
            </div>
        );
    }

    if (!user) return null;

    const getHormoneLabel = (val: string) => {
        switch (val) {
            case 'low': return 'Baixo';
            case 'rising': return 'Em elevação';
            case 'peak': return 'Pico';
            case 'dropping': return 'Em queda';
            default: return val;
        }
    };

    return (
        <div className="container max-w-2xl mx-auto px-4 pt-4 md:px-6 md:pt-6 space-y-6 pb-12">
            <header className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight">Humor & Bem-estar</h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Ritmo emocional e variações hormonais estimadas ao longo do seu ciclo.
                </p>
            </header>

            {/* Current Status Liquid Glass Card */}
            <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-fuchsia-500/[0.08] via-purple-500/[0.04] to-transparent">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
                            <Smile className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                Previsão de Hoje
                            </span>
                            <span className="text-sm font-bold text-foreground">
                                Dia {currentStatus.day} • {currentStatus.label}
                            </span>
                        </div>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-bold text-primary flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{currentStatus.mood}% Bem-estar</span>
                    </div>
                </div>

                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground my-2">
                    {currentStatus.mood > 80 ? "Radiante 🤩" :
                        currentStatus.mood > 60 ? "Bem 🙂" :
                            currentStatus.mood > 40 ? "Reflexiva 😐" : "Sensível 🥺"}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mt-2 font-medium">
                    {currentStatus.hormones.estrogen === 'peak' ? "Estrogênio no pico! Você deve se sentir confiante, comunicativa e cheia de vitalidade." :
                        currentStatus.hormones.progesterone === 'rising' ? "Progesterona em ascensão. Excelente período para foco, recolhimento e noites tranquilas." :
                            currentStatus.hormones.progesterone === 'dropping' ? "Níveis hormonais em declínio natural. Priorize o autocuidado e respeite o seu ritmo." :
                                "Novo ciclo se iniciando. Permita-se descansar e recarregar suas energias."}
                </p>

                {/* Hormone Pills */}
                <div className="mt-5 pt-4 border-t border-white/30 dark:border-white/10 grid grid-cols-2 gap-3">
                    <div className="liquid-glass-subtle rounded-2xl p-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            Estrogênio
                        </span>
                        <span className="text-sm font-bold text-rose-500 mt-0.5 block">
                            {getHormoneLabel(currentStatus.hormones.estrogen)}
                        </span>
                    </div>

                    <div className="liquid-glass-subtle rounded-2xl p-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                            Progesterona
                        </span>
                        <span className="text-sm font-bold text-purple-500 mt-0.5 block">
                            {getHormoneLabel(currentStatus.hormones.progesterone)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Liquid Chart Card */}
            <div className="liquid-glass rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Curva Hormonal Estimada</h2>
                        <p className="text-xs text-muted-foreground font-medium">Oscilação projetada de energia ao longo de 28 dias</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Activity className="h-4 w-4" />
                    </div>
                </div>

                <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.45} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.12)" />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                className="text-muted-foreground"
                                interval={4}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255, 255, 255, 0.6)',
                                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                                    color: '#1e1b4b',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                }}
                                formatter={(value: unknown) => [`${value}% de bem-estar`, 'Índice']}
                                labelFormatter={(label) => `Dia ${label} do ciclo`}
                            />
                            <Area
                                type="monotone"
                                dataKey="mood"
                                stroke="#d946ef"
                                fillOpacity={1}
                                fill="url(#colorMood)"
                                strokeWidth={3}
                            />
                            <ReferenceLine
                                x={currentDay}
                                stroke="#f43f5e"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                label={{ value: 'Hoje', fill: '#f43f5e', fontSize: 11, fontWeight: 'bold', position: 'insideTop' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="liquid-glass-subtle rounded-2xl p-4 flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                <p>
                    O gráfico é gerado com base em modelos de ritmos hormonais médios. Fatores como sono, nutrição e estresse exercem papel ativo no seu bem-estar diário.
                </p>
            </div>

            {/* Espaçamento dedicado para nunca ser coberto pela barra de navegação flutuante */}
            <div className="h-28 w-full select-none pointer-events-none" aria-hidden="true" />
        </div>
    );
}
