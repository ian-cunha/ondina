'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { differenceInDays, addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type CyclePhase = 'Menstruação' | 'Folicular' | 'Ovulação' | 'Lútea';

interface CycleStatusCircleProps {
    startDate: Date;
    cycleLength?: number;
    periodLength?: number;
    className?: string;
}

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
        // Handle negative days (future start date) or cycle overflow
        // Use modulus to find day within cycle, ensure positive
        let day = (dayDiff % cycleLength) + 1;
        if (day <= 0) {
            day += cycleLength;
        }
        setCurrentDay(Math.floor(day));

        // Determine phase
        if (day <= periodLength) {
            setPhase('Menstruação');
        } else if (day <= periodLength + 7) { // Approximation
            setPhase('Folicular');
        } else if (day <= periodLength + 7 + 4) { // Approximation around ovulation
            // Ovulation is roughly 14 days before next period.
            // In 28 day cycle: day 14. 
            // Let's say Ovulation phase is day 12-16
            setPhase('Ovulação');
        } else {
            setPhase('Lútea');
        }

        setDaysUntilNextPeriod(cycleLength - day + 1);

    }, [startDate, cycleLength, periodLength]);

    // SVG Calculation
    const radius = 120;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (currentDay / cycleLength) * circumference;

    return (
        <div className={cn("flex flex-col items-center justify-center p-6", className)}>
            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background Circle */}
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-muted/20"
                    />
                    {/* Progress Circle */}
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={cn("transition-all duration-1000 ease-out", {
                            'text-pink-500': phase === 'Menstruação',
                            'text-purple-400': phase === 'Folicular',
                            'text-teal-400': phase === 'Ovulação',
                            'text-amber-400': phase === 'Lútea',
                        })}
                    />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Dia
                    </span>
                    <span className="text-6xl font-bold tracking-tight text-foreground">
                        {currentDay}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground mt-2">
                        Fase {phase}
                    </span>
                </div>
            </div>

            <div className="mt-8 text-center space-y-2">
                <p className="text-lg font-medium">
                    {daysUntilNextPeriod} dias para a menstruação
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                    {format(addDays(new Date(), daysUntilNextPeriod), "d 'de' MMMM", { locale: ptBR })}
                </p>
            </div>
        </div>
    );
}
