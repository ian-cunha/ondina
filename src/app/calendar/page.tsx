'use client';

import { useCycles } from '@/hooks/useCycles';
import { useAuth } from '@/hooks/useAuth';
import { usePartner } from '@/hooks/usePartner';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { addDays, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarPage() {
    const { user } = useAuth();
    const { linkedAccountId, loading: partnerLoading } = usePartner();

    // Determine whose data to show
    const targetUserId = linkedAccountId || (user ? user.uid : undefined);

    const { cycles, loading: cyclesLoading } = useCycles(targetUserId);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const loading = partnerLoading || cyclesLoading;

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    // Basic modifiers for styling
    // In a real app, calculate actual period days based on start + duration
    // For MVP, assume 5 days period for each logged cycle
    const periodDays = cycles.flatMap(cycle => {
        const start = new Date(cycle.startDate);
        return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
    });

    return (
        <div className="container max-w-lg mx-auto p-4 space-y-6 pb-24">
            <h1 className="text-3xl font-bold">Calendário</h1>

            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
                <CardContent className="p-4 flex justify-center">
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
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%'
                            }
                        }}
                        className="rounded-md border-none"
                    />
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Dias de Menstruação (Registrados)</span>
            </div>

            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="capitalize">
                        {date ? format(date, "d 'de' MMMM, yyyy", { locale: ptBR }) : 'Selecione uma data'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {date && periodDays.some(d => isSameDay(d, date)) ? (
                        <p className="text-primary font-medium">Dia de Menstruação</p>
                    ) : (
                        <p className="text-muted-foreground">Sem registros para este dia.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
