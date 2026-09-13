'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCycles } from '@/hooks/useCycles';
import { toast } from 'sonner';
import { LiquidLoader } from "@/components/ui/liquid-loader";
import { Loader2, Plus } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

export function LogPeriodDialog() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addCycle } = useCycles();

    const handleSave = async () => {
        if (!date) return;
        setLoading(true);
        try {
            await addCycle(date);
            toast.success("Menstruação registrada com sucesso!");
            setOpen(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao registrar";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="liquid-button-primary rounded-full px-5 py-2.5 h-11 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer">
                    <Plus className="h-5 w-5" />
                    <span>Registrar Ciclo</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] liquid-glass border-white/60 dark:border-white/15 rounded-3xl p-6 shadow-2xl">
                <DialogHeader className="space-y-1.5">
                    <DialogTitle className="text-xl font-bold tracking-tight">Registrar Menstruação</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Selecione o primeiro dia do seu ciclo menstrual.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-3">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={ptBR}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="rounded-2xl liquid-glass-subtle p-3 shadow-inner"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!date || loading} className="w-full liquid-button-primary rounded-xl h-11 font-medium">
                        {loading ? <LiquidLoader size="sm" className="mr-2" /> : null}
                        Salvar Registro
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
