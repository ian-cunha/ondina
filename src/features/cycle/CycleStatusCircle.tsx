'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { differenceInDays, addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sparkles, Droplets, SunMedium, Moon } from 'lucide-react';

export type CyclePhase = 'Menstruação' | 'Folicular' | 'Ovulação' | 'Lútea';

interface CycleStatusCircleProps {
    startDate: Date;
    cycleLength?: number;
    periodLength?: number;
    className?: string;
}

const PHASE_CONFIG: Record<CyclePhase, {
    label: string;
    gradientId: string;
    from: string;
    to: string;
    glow: string;
    accentBg: string;
    textColor: string;
    badgeBorder: string;
    icon: React.ElementType;
}> = {
    'Menstruação': {
        label: 'Menstruação',
        gradientId: 'grad-menstruacao',
        from: '#f43f5e',
        to: '#fb7185',
        glow: 'rgba(244, 63, 94, 0.45)',
        accentBg: 'bg-rose-500/15',
        textColor: 'text-rose-500',
        badgeBorder: 'border-rose-500/30',
        icon: Droplets,
    },
    'Folicular': {
        label: 'Fase Folicular',
        gradientId: 'grad-folicular',
        from: '#a855f7',
        to: '#ec4899',
        glow: 'rgba(168, 85, 247, 0.45)',
        accentBg: 'bg-purple-500/15',
        textColor: 'text-purple-500',
        badgeBorder: 'border-purple-500/30',
        icon: Sparkles,
    },
    'Ovulação': {
        label: 'Ovulação',
        gradientId: 'grad-ovulacao',
        from: '#06b6d4',
        to: '#10b981',
        glow: 'rgba(6, 182, 212, 0.45)',
        accentBg: 'bg-cyan-500/15',
        textColor: 'text-cyan-500',
        badgeBorder: 'border-cyan-500/30',
        icon: SunMedium,
    },
    'Lútea': {
        label: 'Fase Lútea',
        gradientId: 'grad-lutea',
        from: '#f59e0b',
        to: '#fb923c',
        glow: 'rgba(245, 158, 11, 0.45)',
        accentBg: 'bg-amber-500/15',
        textColor: 'text-amber-500',
        badgeBorder: 'border-amber-500/30',
        icon: Moon,
    },
};

export function CycleStatusCircle({
    startDate,
    cycleLength = 28,
    periodLength = 5,
    className,
}: CycleStatusCircleProps) {
    const [currentDay, setCurrentDay] = React.useState(1);
    const [phase, setPhase] = React.useState<CyclePhase>('Menstruação');
    const [daysUntilNextPeriod, setDaysUntilNextPeriod] = React.useState(cycleLength);

    React.useEffect(() => {
        const today = new Date();
        const dayDiff = differenceInDays(today, startDate);
        let day = (dayDiff % cycleLength) + 1;
        if (day <= 0) {
            day += cycleLength;
        }
        setCurrentDay(Math.floor(day));

        if (day <= periodLength) {
            setPhase('Menstruação');
        } else if (day <= periodLength + 7) {
            setPhase('Folicular');
        } else if (day <= periodLength + 7 + 4) {
            setPhase('Ovulação');
        } else {
            setPhase('Lútea');
        }

        setDaysUntilNextPeriod(cycleLength - day + 1);
    }, [startDate, cycleLength, periodLength]);

    const currentConfig = PHASE_CONFIG[phase];
    const PhaseIcon = currentConfig.icon;

    // SVG Metrics
    const radius = 135;
    const strokeWidth = 14;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progressFraction = Math.min(Math.max(currentDay / cycleLength, 0), 1);
    const strokeDashoffset = circumference - progressFraction * circumference;

    // Calculate position for the glowing tip droplet
    const angleInDeg = progressFraction * 360 - 90;
    const angleInRad = (angleInDeg * Math.PI) / 180;
    const dropletX = radius + normalizedRadius * Math.cos(angleInRad);
    const dropletY = radius + normalizedRadius * Math.sin(angleInRad);

    return (
        <div className={cn("flex flex-col items-center justify-center p-2 select-none", className)}>
            {/* Outer Liquid Glass Frame */}
            <div className="relative flex items-center justify-center p-6 rounded-full liquid-glass shadow-2xl">
                {/* Ambient glow behind circle */}
                <div
                    className="absolute inset-4 rounded-full blur-2xl opacity-40 transition-all duration-1000 -z-10"
                    style={{ backgroundColor: currentConfig.glow }}
                />

                {/* SVG Progress Dial */}
                <div className="relative flex items-center justify-center">
                    <svg
                        height={radius * 2}
                        width={radius * 2}
                        className="transform -rotate-90 overflow-visible"
                    >
                        <defs>
                            <linearGradient id="grad-menstruacao" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#fb7185" />
                            </linearGradient>
                            <linearGradient id="grad-folicular" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                            <linearGradient id="grad-ovulacao" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <linearGradient id="grad-lutea" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#fb923c" />
                            </linearGradient>
                            {/* Filter for droplet soft glow */}
                            <filter id="droplet-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background track circle */}
                        <circle
                            stroke="currentColor"
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className="text-black/5 dark:text-white/5"
                        />

                        {/* Translucent guide line */}
                        <circle
                            stroke="currentColor"
                            fill="transparent"
                            strokeWidth={1}
                            r={normalizedRadius + strokeWidth / 2 + 3}
                            cx={radius}
                            cy={radius}
                            className="text-white/40 dark:text-white/10 stroke-dasharray-[3_4]"
                        />

                        {/* Liquid Progress Arc */}
                        <circle
                            stroke={`url(#${currentConfig.gradientId})`}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{
                                strokeDashoffset,
                                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.8s ease',
                                filter: `drop-shadow(0 0 8px ${currentConfig.glow})`
                            }}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />

                        {/* Glowing Tip Droplet */}
                        <circle
                            cx={dropletX}
                            cy={dropletY}
                            r={strokeWidth / 2 + 2}
                            fill="#ffffff"
                            filter="url(#droplet-glow)"
                            style={{
                                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                filter: `drop-shadow(0 0 6px ${currentConfig.from})`
                            }}
                        />
                        <circle
                            cx={dropletX}
                            cy={dropletY}
                            r={strokeWidth / 4}
                            fill={currentConfig.from}
                            style={{ transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        />
                    </svg>

                    {/* Concentric Inner Glass Lens */}
                    <div className="absolute inset-[44px] rounded-full flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-white/30 to-white/5 dark:from-white/10 dark:to-transparent backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[inset_0_4px_15px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.3)] overflow-hidden">
                        {/* Specular 3D Glass Highlight */}
                        <div className="absolute top-[2%] left-[15%] right-[15%] h-[35%] bg-gradient-to-b from-white/50 to-transparent rounded-full opacity-60 dark:opacity-20 blur-[1px] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                                Dia do Ciclo
                            </span>

                        <div className="relative my-1 flex items-baseline justify-center">
                            <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-foreground via-foreground to-foreground/75 bg-clip-text text-transparent">
                                {currentDay}
                            </span>
                            <span className="text-[11px] font-bold text-muted-foreground ml-1 opacity-60">
                                /{cycleLength}
                            </span>
                        </div>

                        {/* Liquid Phase Pill Badge */}
                        <div className={cn(
                            "mt-1 px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold border backdrop-blur-md transition-all duration-500",
                            currentConfig.accentBg,
                            currentConfig.textColor,
                            currentConfig.badgeBorder
                        )}>
                            <PhaseIcon className="w-3.5 h-3.5" />
                            <span>{phase}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Status Pill */}
            <div className="mt-5 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass-subtle shadow-sm">
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentConfig.from }} />
                    <span className="text-sm font-semibold text-foreground">
                        {daysUntilNextPeriod} {daysUntilNextPeriod === 1 ? 'dia' : 'dias'} para a próxima menstruação
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 capitalize font-medium">
                    Previsão para {format(addDays(new Date(), daysUntilNextPeriod), "d 'de' MMMM", { locale: ptBR })}
                </p>
            </div>
        </div>
    );
}
