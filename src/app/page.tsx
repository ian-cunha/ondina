'use client';

import { CycleStatusCircle } from '@/features/cycle/CycleStatusCircle';
import { useCyclePrediction } from '@/features/cycle/useCyclePrediction';
import { useAuth } from '@/hooks/useAuth';
import { useCycles } from '@/hooks/useCycles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut, Eye, Calendar, Sparkles, User, Smile } from 'lucide-react';
import { LogPeriodDialog } from '@/features/cycle/LogPeriodDialog';
import { usePartner } from '@/hooks/usePartner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LiquidLoader } from '@/components/ui/liquid-loader';
import { useMoodPrediction } from '@/features/mood/useMoodPrediction';
import { differenceInDays } from 'date-fns';

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const { linkedAccountId, loading: partnerLoading, role } = usePartner();
  const router = useRouter();

  useEffect(() => {
    if (!partnerLoading && role === 'partner' && !linkedAccountId) {
      router.push('/settings');
    }
  }, [role, linkedAccountId, partnerLoading, router]);

  const targetUserId = linkedAccountId || (user ? user.uid : undefined);
  const { cycles, loading: cyclesLoading } = useCycles(targetUserId);
  const prediction = useCyclePrediction(cycles);

  const currentCycleStart = cycles.length > 0 ? new Date(cycles[0].startDate) : new Date();
  
  const currentDay = cycles.length > 0 ? differenceInDays(new Date(), currentCycleStart) + 1 : 1;
  const { currentStatus } = useMoodPrediction(currentDay);

  const isLoading = authLoading || (user && cyclesLoading) || partnerLoading || (role === 'partner' && !linkedAccountId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LiquidLoader size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-foreground relative">
        <div className="liquid-glass rounded-3xl p-8 md:p-10 max-w-md w-full text-center space-y-6 flex flex-col items-center shadow-2xl relative overflow-hidden">
          {/* Internal specular highlight reflection */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl pointer-events-none" />

          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-fuchsia-500 to-cyan-400 opacity-30 blur-lg animate-pulse" />
            <div className="relative p-3 liquid-glass-pill rounded-full">
              <Image
                src="/logo.svg"
                alt="Ondina Logo"
                width={88}
                height={88}
                className="h-20 w-20 drop-shadow-md"
                priority
              />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
              Ondina
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-medium">
              O ciclo feminino em harmonia. Privado, intuitivo e com estética fluida.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <Button asChild className="liquid-button-primary rounded-2xl h-12 flex-1 font-semibold text-base cursor-pointer">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline" className="liquid-glass-pill rounded-2xl h-12 flex-1 font-semibold text-base cursor-pointer hover:bg-white/40 dark:hover:bg-white/10">
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 opacity-35 blur-[2px] pointer-events-none transform scale-90">
          <CycleStatusCircle
            startDate={new Date()}
            cycleLength={28}
          />
        </div>
      </main>
    );
  }

  const hasCycles = cycles.length > 0;
  const isPartnerMode = !!linkedAccountId;

  return (
    <main className="flex min-h-screen flex-col px-4 pt-4 md:px-8 md:pt-8 max-w-5xl mx-auto pb-12">

      {/* Partner Mode Banner */}
      {isPartnerMode && (
        <div className="mb-6 p-3.5 liquid-glass rounded-2xl flex items-center justify-between text-purple-700 dark:text-purple-300 border-purple-500/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-purple-500/20">
              <Eye className="h-4 w-4 text-purple-500" />
            </div>
            <span className="text-xs md:text-sm font-medium">
              Modo Parceiro: Visualizando dados do ciclo compartilhado
            </span>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-12 w-12 rounded-2xl shrink-0 liquid-glass flex items-center justify-center text-primary shadow-md">
            <User className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
              {isPartnerMode ? 'Ciclo Vinculado' : `Olá, ${user.displayName || 'Bem-vinda'}`}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">
              {isPartnerMode
                ? "Acompanhe o ritmo hormonal e previsões atuais."
                : (hasCycles ? "Seu ciclo em tempo real" : "Vamos registrar seu primeiro ciclo")
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isPartnerMode && <LogPeriodDialog />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            className="liquid-glass-pill rounded-full h-11 w-11 text-muted-foreground hover:text-destructive cursor-pointer transition-colors shrink-0"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Empty State */}
      {!hasCycles && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="liquid-glass rounded-3xl p-8 max-w-md w-full flex flex-col items-center space-y-4 shadow-xl">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold">
              {isPartnerMode ? 'Nenhum ciclo compartilhado' : 'Nenhum ciclo registrado ainda'}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {isPartnerMode
                ? "A usuária ainda não registrou nenhum ciclo para compartilhamento."
                : "Comece registrando o primeiro dia da sua última menstruação para gerar previsões inteligentes."
              }
            </p>
            {!isPartnerMode && (
              <div className="pt-2">
                <LogPeriodDialog />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cycles Dashboard Grid */}
      {hasCycles && (
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Hero Dial */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
            <CycleStatusCircle
              startDate={currentCycleStart}
              cycleLength={prediction.averageCycleLength}
            />
          </div>

          {/* Liquid Glass Metric Cards */}
          <div className="grid gap-4 w-full max-w-xl grid-cols-1 sm:grid-cols-2">
            {/* Card: Próxima Menstruação */}
            <div className="liquid-glass liquid-glass-interactive rounded-3xl p-5 relative overflow-hidden bg-gradient-to-br from-rose-500/[0.06] to-transparent">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Próxima Menstruação
                </span>
                <div className="h-8 w-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-rose-500 tracking-tight">
                {prediction.nextPeriodStart?.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) || 'Calculando...'}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">Data estimada de início</p>
            </div>

            {/* Card: Ovulação */}
            <div className="liquid-glass liquid-glass-interactive rounded-3xl p-5 relative overflow-hidden bg-gradient-to-br from-purple-500/[0.06] to-transparent">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ovulação
                </span>
                <div className="h-8 w-8 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-500">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-purple-500 tracking-tight">
                {prediction.ovulationDate?.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) || 'Calculando...'}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">Pico fértil estimado</p>
            </div>

            {/* Card: Janela Fértil */}
            <div className="sm:col-span-2 liquid-glass liquid-glass-interactive rounded-3xl p-5 relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.06] to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Janela Fértil
                </span>
                <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  Alta Chance
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {prediction.fertileWindow ?
                    `${prediction.fertileWindow.start.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} – ${prediction.fertileWindow.end.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`
                    : 'Calculando...'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Período mais propício para concepção
              </p>
            </div>

            {/* Card: Humor Estimado (Apenas Partner Mode) */}
            {isPartnerMode && (
              <div className="sm:col-span-2 liquid-glass liquid-glass-interactive rounded-3xl p-5 relative overflow-hidden bg-gradient-to-br from-fuchsia-500/[0.06] to-transparent">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Estado Emocional Estimado
                  </span>
                  <div className="h-8 w-8 rounded-full bg-fuchsia-500/15 flex items-center justify-center text-fuchsia-500">
                    <Smile className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                  {currentStatus.mood > 80 ? "Radiante 🤩" :
                   currentStatus.mood > 60 ? "Bem 🙂" :
                   currentStatus.mood > 40 ? "Reflexiva 😐" : "Sensível 🥺"}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
                  {currentStatus.hormones.estrogen === 'peak' ? "Estrogênio no pico. Ela pode estar se sentindo confiante e comunicativa." :
                   currentStatus.hormones.progesterone === 'rising' ? "Progesterona em ascensão. Boa fase para oferecer apoio, conforto e tranquilidade." :
                   currentStatus.hormones.progesterone === 'dropping' ? "Hormônios em queda. Tenha empatia extra, ela pode estar mais sensível à tensão." :
                   "Novo ciclo iniciado. Período natural de recolhimento, ofereça carinho e descanso."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Espaçamento dedicado para nunca ser coberto pela barra de navegação flutuante */}
      <div className="h-28 w-full select-none pointer-events-none" aria-hidden="true" />
    </main>
  );
}
