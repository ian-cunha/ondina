export interface MoodDataPoint {
    day: number;
    mood: number; // 0-100 scale
    label: string; // e.g., "Menstruação", "Folicular", "Ovulação", "Lútea"
    hormones: {
        estrogen: 'low' | 'rising' | 'peak' | 'dropping';
        progesterone: 'low' | 'rising' | 'peak' | 'dropping';
    }
}

export function useMoodPrediction(currentCycleDay: number = 1, cycleLength: number = 28) {

    // Generate standard 28-day curve (scaled to cycleLength if needed, but for MVP standard is fine)
    // We will stick to a standard 28-day model for the graph for simplicity in this MVP
    // If cycleLength is widely different, we could stretch the follicular/luteal phases.

    const generateCurve = (): MoodDataPoint[] => {
        const data: MoodDataPoint[] = [];

        for (let i = 1; i <= 28; i++) {
            let mood = 50;
            let label = "";
            let estrogen: any = 'low';
            let progesterone: any = 'low';

            if (i <= 5) {
                // Menstruation: Low but rising slightly as relief sets in
                label = "Menstruação";
                mood = 40 + (i * 2); // 42 -> 50
                estrogen = 'low';
                progesterone = 'low';
            } else if (i <= 13) {
                // Follicular: Estrogen rising -> Happiness rising
                label = "Folicular";
                mood = 50 + ((i - 5) * 5); // 55 -> 90
                estrogen = 'rising';
            } else if (i === 14) {
                // Ovulation: Peak
                label = "Ovulação";
                mood = 100;
                estrogen = 'peak';
            } else if (i <= 20) {
                // Early Luteal: Progesterone rising (calm but high)
                label = "Lútea (Cedo)";
                mood = 90 - ((i - 14) * 2); // 88 -> 78
                estrogen = 'dropping';
                progesterone = 'rising';
            } else {
                // Late Luteal (PMS): Drops
                label = "TPM";
                mood = 78 - ((i - 20) * 5); // 73 -> 33 (Low point just before period)
                estrogen = 'low';
                progesterone = 'dropping';
            }

            data.push({ day: i, mood, label, hormones: { estrogen, progesterone } });
        }
        return data;
    };

    const data = generateCurve();

    // Get current day status safely
    const normalizedDay = Math.min(Math.max(currentCycleDay, 1), 28);
    const currentStatus = data.find(d => d.day === normalizedDay) || data[0];

    return {
        chartData: data,
        currentStatus,
    };
}
