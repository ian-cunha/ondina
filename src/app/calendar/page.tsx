'use client';

import { useCycles } from '@/hooks/useCycles';
import { useAuth } from '@/hooks/useAuth';
import { usePartner } from '@/hooks/usePartner';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { LiquidLoader } from '@/components/ui/liquid-loader';
import { Loader2, Calendar as CalendarIcon, Droplet, CheckCircle2 } from 'lucide-react';
import { addDays, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarPage() {
    const { user } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();

    const targetUserId = linkedAccountId || (user ? user.uid : undefined);
    const { cycles, loading: cyclesLoading } = useCycles(targetUserId);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const loading = partnerLoading || cyclesLoading;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LiquidLoader size="lg" />
            </div>
        );
    }

    const periodDays = cycles.flatMap(cycle => {
        const start = new Date(cycle.startDate);
        return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
    });

    const isSelectedPeriodDay = date && periodDays.some(d => isSameDay(d, date));

    return (
        <div className="container max-w-lg mx-auto px-4 pt-4 md:px-6 md:pt-6 space-y-6 pb-12">
            <header className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight">Calendário</h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Visualize seus ciclos registrados e consulte dias específicos.
                </p>
            </header>

            {/* Liquid Glass Calendar Container */}
            <div className="liquid-glass rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col items-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    modifiers={{
                        period: periodDays
                    }}
                    modifiersStyles={{
                        period: {
                            backgroundColor: '#fda4af',
                            color: '#881337',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0 10px rgba(253, 164, 175, 0.6)'
                        }
                    }}
                    className="bg-transparent p-0 w-full max-w-xs"
                />

                {/* Legend Pill */}
                <div className="mt-4 pt-4 border-t border-white/30 dark:border-white/10 w-full flex items-center justify-center">
                    <div className="liquid-glass-subtle rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-md bg-rose-300 shadow-[0_0_8px_rgba(253,164,175,0.6)]" />
                        <span>Dias de Menstruação Registrados</span>
                    </div>
                </div>
            </div>

            {/* Selected Day Status Card */}
            <div className="liquid-glass liquid-glass-interactive rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-2xl liquid-glass-subtle flex items-center justify-center text-primary">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                            Data Selecionada
                        </span>
                        <h2 className="text-base font-bold capitalize text-foreground">
                            {date ? format(date, "EEEE, d 'de' MMMM, yyyy", { locale: ptBR }) : 'Selecione uma data'}
                        </h2>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10">
                    {isSelectedPeriodDay ? (
                        <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-sm">
                            <Droplet className="h-4 w-4 fill-rose-400" />
                            <span>Dia de menstruação registrado neste ciclo</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5 text-muted-foreground text-sm font-medium">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>Sem ocorrência de menstruação registrada para este dia.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Espaçamento dedicado para nunca ser coberto pela barra de navegação flutuante */}
            <div className="h-28 w-full select-none pointer-events-none" aria-hidden="true" />
        </div>
    );
}
