import { useMemo } from 'react';
import { addDays, differenceInDays, parseISO, isValid } from 'date-fns';
import { Cycle } from '@/types';

interface Prediction {
    nextPeriodStart: Date | null;
    ovulationDate: Date | null;
    fertileWindow: { start: Date; end: Date } | null;
    averageCycleLength: number;
}

const DEFAULT_CYCLE_LENGTH = 28;
const LUTEAL_PHASE_LENGTH = 14;

export function useCyclePrediction(cycles: Cycle[]): Prediction {
    return useMemo(() => {
        if (!cycles || cycles.length === 0) {
            return {
                nextPeriodStart: null,
                ovulationDate: null,
                fertileWindow: null,
                averageCycleLength: DEFAULT_CYCLE_LENGTH,
            };
        }

        // Sort cycles by start date descending (newest first)
        const sortedCycles = [...cycles].sort((a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );

        // Get the most recent cycle
        const lastCycle = sortedCycles[0];
        const lastCycleStart = parseISO(lastCycle.startDate);

        if (!isValid(lastCycleStart)) {
            return {
                nextPeriodStart: null,
                ovulationDate: null,
                fertileWindow: null,
                averageCycleLength: DEFAULT_CYCLE_LENGTH,
            };
        }

        // Calculate average cycle length from last 3 cycles
        let totalLength = 0;
        let count = 0;

        // We can only calculate length if we have a previous cycle to compare with, 
        // OR if the cycle object itself has a 'length' property.
        // Stragety: Use 'length' property if available, otherwise calculate diff between starts.

        // Check if we have enough history to calculate average
        // If we have explicit lengths in the cycle objects
        const cyclesWithLengths = sortedCycles.filter(c => c.length);

        if (cyclesWithLengths.length > 0) {
            const recentCycles = cyclesWithLengths.slice(0, 3);
            const sum = recentCycles.reduce((acc, c) => acc + (c.length || DEFAULT_CYCLE_LENGTH), 0);
            totalLength = sum;
            count = recentCycles.length;
        } else if (sortedCycles.length >= 2) {
            // Calculate rough lengths based on start dates
            // Note: This is an approximation if we don't have recorded lengths
            for (let i = 0; i < Math.min(sortedCycles.length - 1, 3); i++) {
                const current = parseISO(sortedCycles[i].startDate);
                const previous = parseISO(sortedCycles[i + 1].startDate);
                if (isValid(current) && isValid(previous)) {
                    const diff = differenceInDays(current, previous);
                    totalLength += diff;
                    count++;
                }
            }
        }

        const averageLength = count > 0 ? Math.round(totalLength / count) : DEFAULT_CYCLE_LENGTH;

        // Predict next dates
        const nextPeriodStart = addDays(lastCycleStart, averageLength);
        const ovulationDate = addDays(nextPeriodStart, -LUTEAL_PHASE_LENGTH);
        const fertileWindowStart = addDays(ovulationDate, -5);
        const fertileWindowEnd = addDays(ovulationDate, 1);

        return {
            nextPeriodStart,
            ovulationDate,
            fertileWindow: { start: fertileWindowStart, end: fertileWindowEnd },
            averageCycleLength: averageLength,
        };

    }, [cycles]);
}
