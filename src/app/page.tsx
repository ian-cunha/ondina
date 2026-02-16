'use client';

import { CycleStatusCircle } from '@/features/cycle/CycleStatusCircle';
import { useCyclePrediction } from '@/features/cycle/useCyclePrediction';
import { useAuth } from '@/hooks/useAuth';
import { useCycles } from '@/hooks/useCycles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, LogOut, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogPeriodDialog } from '@/features/cycle/LogPeriodDialog';
import { usePartner } from '@/hooks/usePartner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const { linkedAccountId, loading: partnerLoading, role } = usePartner();
  const router = useRouter();

  useEffect(() => {
    if (!partnerLoading && role === 'partner' && !linkedAccountId) {
      router.push('/settings');
    }
  }, [role, linkedAccountId, partnerLoading, router]);

  // If linkedAccountId exists, fetch THEIR cycles. Otherwise fetch MINE.
  // Note: useCycles handles undefined userId by using current user's UID (default)
  // BUT if linkedAccountId is set, we want to use THAT ID.
  const targetUserId = linkedAccountId || (user ? user.uid : undefined);

  const { cycles, loading: cyclesLoading } = useCycles(targetUserId);

  // If viewing partner data, we shouldn't show LogPeriodDialog or use user settings for prediction (ideally)
  // For now, useCyclePrediction calculates based on fetched cycles, so it's fine.

  const prediction = useCyclePrediction(cycles);

  const currentCycleStart = cycles.length > 0 ? new Date(cycles[0].startDate) : new Date();

  const isLoading = authLoading || (user && cyclesLoading) || partnerLoading || (role === 'partner' && !linkedAccountId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }



  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
        <div className="max-w-md text-center space-y-6 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-lg animate-pulse" />
            <Image
              src="/logo.svg"
              alt="Ondina Logo"
              width={120}
              height={120}
              className="relative h-32 w-32 drop-shadow-xl"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Ondina
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitoramento de ciclo reimaginado. Privado, bonito e inteligente.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 cursor-pointer">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 backdrop-blur-sm bg-background/50 cursor-pointer">
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 relative opacity-50 blur-sm pointer-events-none">
          <CycleStatusCircle
            startDate={new Date()}
            cycleLength={28}
          />
        </div>
      </main>
    )
  }

  const hasCycles = cycles.length > 0;
  const isPartnerMode = !!linkedAccountId;

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-background pb-24">

      {/* Partner Mode Banner */}
      {isPartnerMode && (
        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-between text-purple-700 dark:text-purple-300">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Modo Parceiro: Visualizando dados do ciclo compartilhado</span>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {isPartnerMode ? 'Ciclo Vinculado' : `Olá, ${user.displayName || 'Usuária'}`}
          </h1>
          <p className="text-muted-foreground">
            {isPartnerMode
              ? "Acompanhe as previsões e status atual."
              : (hasCycles ? "Resumo do seu ciclo" : "Vamos registrar seu primeiro ciclo")
            }
          </p>
        </div>
        <div className="flex gap-2">
          {!isPartnerMode && <LogPeriodDialog />}
          <Button variant="ghost" size="icon" onClick={() => logout()} className="cursor-pointer">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Empty State */}
      {!hasCycles && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-6 bg-muted rounded-full">
            <Loader2 className="h-12 w-12 text-muted-foreground animate-none" />
          </div>
          <h2 className="text-xl font-semibold">
            {isPartnerMode ? 'Nenhum ciclo compartilhado' : 'Nenhum ciclo registrado ainda'}
          </h2>
          <p className="text-muted-foreground text-center max-w-sm">
            {isPartnerMode
              ? "A usuária ainda não registrou nenhum ciclo."
              : "Comece a monitorar seu ciclo registrando o primeiro dia da sua última menstruação."
            }
          </p>
          {!isPartnerMode && <LogPeriodDialog />}
        </div>
      )}

      {hasCycles && (
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          <div className="relative flex-shrink-0">
            <CycleStatusCircle
              startDate={currentCycleStart}
              cycleLength={prediction.averageCycleLength}
            />
          </div>

          <div className="grid gap-4 w-full max-w-2xl grid-cols-1 md:grid-cols-2">
            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Próxima Menstruação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {prediction.nextPeriodStart?.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) || 'Desconhecido'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Data estimada de início</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/60 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Ovulação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-500">
                  {prediction.ovulationDate?.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) || 'Desconhecido'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Pico de fertilidade estimado</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-lg bg-card/60 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Janela Fértil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">
                    {prediction.fertileWindow ?
                      `${prediction.fertileWindow.start.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} - ${prediction.fertileWindow.end.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`
                      : 'Desconhecido'}
                  </p>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">Alta Chance</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Melhor momento para concepção</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
