export interface PartnerTips {
    physical: string[];
    emotional: string[];
    activity: string[];
    food: string[];
}

export function usePartnerTips(day: number): PartnerTips {
    // Normalize day to 1-28 for standard tip logic
    const d = Math.max(1, Math.min(day, 28));

    if (d <= 5) {
        // Menstruation (1-5)
        return {
            physical: ["Ofereça uma bolsa de água quente.", "Massagem leve nas costas ou pés.", "Garanta que ela descanse."],
            emotional: ["Seja paciente e acolhedor.", "Evite pedir muitas decisões complexas.", "Valide o que ela sente."],
            activity: ["Noite de filmes no sofá.", "Fiquem em casa tranquilos.", "Prepare um banho relaxante (se possível)."],
            food: ["Chocolate amargo (ajuda no humor).", "Chás quentes (camomila, gengibre).", "Comidas reconfortantes e nutritivas."]
        };
    } else if (d <= 13) {
        // Follicular (6-13) - Rising Energy
        return {
            physical: ["Acompanhe em exercícios físicos.", "Caminhadas ao ar livre.", "Toque físico e carinho."],
            emotional: ["Elogie a disposição dela.", "Incentive novos projetos.", "Ótimo momento para conversas profundas."],
            activity: ["Sair para jantar.", "Passeios, trilhas ou academia.", "Planejar viagens futuras."],
            food: ["Alimentos frescos e leves.", "Saladas coloridas.", "Proteínas magras."]
        };
    } else if (d === 14) {
        // Ovulation (14) - Peak
        return {
            physical: ["Alto nível de energia e libido.", "Esteja sintonizado com ela.", "Toque e proximidade."],
            emotional: ["Ela está super confiante.", "Admire e elogie.", "Deixe ela liderar as escolhas."],
            activity: ["Encontro romântico especial.", "Atividades sociais com amigos.", "Uma noite divertida fora."],
            food: ["Pratos sofisticados.", "Vinho ou drinks (se beberem).", "Frutas vermelhas."]
        };
    } else if (d <= 20) {
        // Early Luteal (15-20) - Calming down
        return {
            physical: ["Conforto e estabilidade.", "Abraços longos.", "Ajude com tarefas domésticas pesadas."],
            emotional: ["Momento de foco e produtividade.", "Apoie nas metas dela.", "Transmita segurança."],
            activity: ["Arrumar a casa juntos.", "Cozinhar juntos algo elaborado.", "Ler ou ver séries."],
            food: ["Vegetais de raiz (cenoura, batata).", "Grãos integrais.", "Sopas nutritivas."]
        };
    } else {
        // Late Luteal / PMS (21-28)
        return {
            physical: ["Não force atividades intensas.", "Massagem no pescoço/ombros.", "Deixe ela dormir mais."],
            emotional: ["Tenha EXTREMA paciência.", "Não leve irritações para o lado pessoal.", "Escute mais do que fale."],
            activity: ["Evite eventos sociais lotados.", "Ambiente calmo e silencioso.", "Deixe ela ter tempo sozinha se quiser."],
            food: ["Evite sal (inchaço).", "Magnésio (nozes, sementes).", "Cumpra os desejos alimentares dela!"]
        };
    }
}
