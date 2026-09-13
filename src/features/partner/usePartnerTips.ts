export interface PartnerTips {
    physical: string[];
    emotional: string[];
    activity: string[];
    food: string[];
}

export function usePartnerTips(day: number): PartnerTips {
    const d = Math.max(1, Math.min(day, 28));

    if (d <= 5) {
        return {
            physical: [
                "Prepare uma bolsa de água quente ou compressa térmica para alívio de cólicas.",
                "Ofereça massagens suaves na lombar, onde a tensão menstrual costuma se acumular.",
                "Assuma proativamente as tarefas domésticas para que ela possa descansar sem culpa."
            ],
            emotional: [
                "Seja um porto seguro: paciência e acolhimento são fundamentais agora.",
                "Evite trazer discussões estressantes, cobranças ou exigir decisões complexas.",
                "Valide o cansaço dela; a queda hormonal reduz drasticamente a energia física."
            ],
            activity: [
                "Transforme a casa num refúgio: luzes baixas, ambiente silencioso e confortável.",
                "Programação ideal: maratona de séries ou filmes no sofá sob as cobertas.",
                "Evite forçar interações sociais ou eventos que exijam muita energia."
            ],
            food: [
                "Surpreenda com chás quentinhos e anti-inflamatórios (gengibre, camomila ou hortelã).",
                "Tenha à mão chocolate amargo (rico em magnésio, ótimo para humor e cólicas).",
                "Opte por refeições quentes, reconfortantes e fáceis de digerir, como caldos e sopas."
            ]
        };
    } else if (d <= 13) {
        return {
            physical: [
                "Ela está recuperando o vigor físico. É um ótimo momento para se exercitarem juntos.",
                "O toque físico volta a ser muito bem-vindo e a libido começa a despertar.",
                "Acompanhe o ritmo dela em caminhadas ao ar livre ou atividades mais intensas."
            ],
            emotional: [
                "O estrogênio em alta traz otimismo. Elogie a disposição e o brilho natural dela.",
                "Aproveite a clareza mental dela para alinhar metas e discutir projetos do casal.",
                "Incentive-a a experimentar coisas novas, ela está no auge da criatividade!"
            ],
            activity: [
                "Excelente fase para planejar dates fora de casa, aventuras ou viagens futuras.",
                "Atividades sociais, encontros com amigos e eventos culturais são super indicados.",
                "Aproveitem para resolver pendências que exigiam mais energia ou burocracia."
            ],
            food: [
                "Apoie a energia dela com refeições frescas, coloridas e ricas em nutrientes.",
                "Saladas vibrantes, proteínas magras e grãos integrais são perfeitos agora.",
                "Bom momento para experimentar novos restaurantes e culinárias exóticas."
            ]
        };
    } else if (d >= 14 && d <= 16) {
        return {
            physical: [
                "A energia e a libido estão no pico absoluto. Sintonize-se com esse ritmo.",
                "Abuse do contato físico, carinho e proximidade ao longo do dia.",
                "Ela se sente naturalmente mais atraente; faça com que ela saiba que você também acha."
            ],
            emotional: [
                "Ela está super sociável, magnética e confiante. Demonstre admiração.",
                "Deixe-a brilhar e tomar a liderança em escolhas de lazer ou dinâmicas do casal.",
                "A comunicação está fluida, facilitando o alinhamento de desejos e expectativas."
            ],
            activity: [
                "Surpreenda-a com um encontro romântico especial ou uma noite divertida.",
                "Fase perfeita para festas, celebrações ou reunir grandes grupos de amigos.",
                "Explorem juntos atividades que despertem os sentidos e a criatividade."
            ],
            food: [
                "Prepare ou peça pratos mais elaborados e estimulantes.",
                "Frutas vermelhas, frutos do mar ou comidas que tragam uma experiência sensorial.",
                "Um bom vinho ou o drink favorito dela acompanham bem o clima festivo da fase."
            ]
        };
    } else if (d <= 22) {
        return {
            physical: [
                "O ritmo começa a desacelerar. O conforto físico passa a ser prioridade.",
                "Abraços demorados e contato físico que transmita segurança são muito valorizados.",
                "Volte a assumir atividades físicas pesadas ou que exijam muito esforço da rotina."
            ],
            emotional: [
                "O aumento da progesterona traz foco e uma postura mais 'pé no chão'.",
                "Apoie-a na execução de tarefas, ela estará mais voltada para a produtividade.",
                "Transmita estabilidade e seja um parceiro presente no dia a dia."
            ],
            activity: [
                "Que tal organizarem ou decorarem a casa juntos? O instinto de 'aninhar' pode surgir.",
                "Programações caseiras ganham força: cozinhem juntos e curtam a própria companhia.",
                "Uma noite tranquila de leitura ou terminando um projeto pessoal lado a lado."
            ],
            food: [
                "O corpo começa a pedir alimentos mais densos e reconfortantes.",
                "Vegetais assados (abóbora, batata doce), grãos integrais e pratos quentes.",
                "Mantenha a hidratação alta para evitar o inchaço que começa a se formar."
            ]
        };
    } else {
        return {
            physical: [
                "O corpo dela está se preparando para menstruar. A energia cai e o cansaço aumenta.",
                "Massagens nos ombros e pescoço são perfeitas para aliviar a tensão acumulada.",
                "Crie condições para que ela durma mais cedo e descanse o máximo possível."
            ],
            emotional: [
                "A famosa TPM: Exercite a escuta ativa e tenha uma dose extra de empatia.",
                "Não leve frustrações ou respostas ríspidas para o lado pessoal; os hormônios estão oscilando.",
                "Seja extremamente paciente. Evite 'consertar' os problemas dela, apenas ouça e valide."
            ],
            activity: [
                "Proteja-a de estímulos excessivos: evite lugares cheios, barulhentos ou caóticos.",
                "Ofereça espaço se ela quiser ficar sozinha, mas esteja disponível se ela quiser colo.",
                "Cancele compromissos sociais se perceber que ela está sobrecarregada."
            ],
            food: [
                "Os 'desejos' são reais: abasteça a casa com os snacks e doces favoritos dela.",
                "Evitem excesso de sal, cafeína e álcool para não agravar o inchaço e a ansiedade.",
                "Alimentos ricos em magnésio (nozes, sementes) ajudam muito a estabilizar o humor."
            ]
        };
    }
}
