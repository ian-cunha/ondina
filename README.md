# 🌊 Ondina

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)

> **Ondina** é um Progressive Web App (PWA) de rastreamento de ciclo menstrual que une a precisão de dados, uma UX visual envolvente e privacidade rigorosa.

## 💡 Sobre o Projeto

O Ondina foi arquitetado para resolver o trilema dos aplicativos de saúde feminina: **Precisão vs. Design vs. Privacidade**.

Inspirado nos líderes de mercado, o projeto integra:
* **Precisão de Dados (Clue):** Algoritmos de previsão baseados em médias móveis dos últimos 3 ciclos.
* **UX Visual (Flo/Apple Health):** Interface intuitiva com visualização circular do ciclo e Bento Grid layouts.
* **Privacidade (Stardust):** Arquitetura *Privacy-first* com regras rigorosas de segurança no Firestore e preparação para criptografia.

## 🛠 Tech Stack

O projeto utiliza uma arquitetura moderna baseada no **Next.js 15 (App Router)**, priorizando Server Components para performance e Client Components para interatividade.

### Core
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
* **PWA:** Configuração de Manifesto e Service Workers para instalação nativa.

### Backend & Dados
* **BaaS:** Firebase (Authentication & Firestore).
* **State Management:** Zustand (Estado global leve) e React Query (Server state caching).
* **Validação:** Zod + React Hook Form.

### Features Específicas
* **Visualização de Dados:** Recharts (Gráficos de tendências).
* **Manipulação de Datas:** date-fns.

## 📱 Funcionalidades

### 1. Dashboard Intuitivo
* **Cycle Circle:** Componente visual (SVG/CSS) que indica o dia atual, fase do ciclo e previsão da próxima menstruação.
* **Bento Grid:** Cards resumidos para acesso rápido a sintomas, humor e previsões.

### 2. Engine de Logging
Sistema de tags categorizadas para registro diário:
* **Físico:** Cólica, Inchaço, Dor de cabeça.
* **Emocional:** Triste, Ansiosa, Feliz.
* **Fluxo:** Leve, Moderado, Intenso.

### 3. Algoritmo de Previsão
* Cálculo automático da próxima menstruação baseado na média histórica.
* Estimativa de janela fértil e ovulação (método padrão de 14 dias).

### 4. Privacidade e Segurança
* Autenticação via Firebase Auth.
* **Firestore Security Rules:** Acesso estrito onde `request.auth.uid == userId`.
* Estrutura de dados segregada (`users/{userId}/daily_logs`) para escalabilidade e segurança.
