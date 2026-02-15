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
import { Loader2, Plus, Calendar as CalendarIcon } from 'lucide-react';
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
        } catch (error: any) {
            toast.error(error.message || "Erro ao registrar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-5 w-5" /> Registrar Ciclo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Menstruação</DialogTitle>
                    <DialogDescription>
                        Selecione o primeiro dia do seu ciclo menstrual.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={ptBR}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="rounded-md border shadow"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!date || loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
