/**
 * Mapeia erros de autenticação do Firebase para mensagens amigáveis em português.
 */
export function getAuthErrorMessage(
    error: unknown,
    defaultMessage = "Ocorreu um erro na autenticação. Tente novamente."
): string {
    if (!error) return defaultMessage;

    let code = "";
    let rawMessage = "";

    if (typeof error === "string") {
        rawMessage = error;
    } else if (typeof error === "object" && error !== null) {
        if ("code" in error && typeof (error as { code: unknown }).code === "string") {
            code = (error as { code: string }).code.toLowerCase();
        }
        if ("message" in error && typeof (error as { message: unknown }).message === "string") {
            rawMessage = (error as { message: string }).message;
        }
    }

    if (!code && rawMessage) {
        code = (rawMessage.match(/auth\/[a-z0-9-]+/i)?.[0] || "").toLowerCase();
    }

    switch (code) {
        case "auth/invalid-credential":
            return "E-mail ou senha incorretos. Verifique os dados e tente novamente.";
        case "auth/user-not-found":
            return "Nenhuma conta foi encontrada com este e-mail.";
        case "auth/wrong-password":
            return "Senha incorreta. Verifique os dados e tente novamente.";
        case "auth/invalid-email":
            return "O formato do e-mail informado é inválido.";
        case "auth/user-disabled":
            return "Esta conta de usuário foi desativada.";
        case "auth/email-already-in-use":
            return "Este e-mail já está sendo utilizado por outra conta.";
        case "auth/weak-password":
            return "A senha é muito fraca. Ela deve conter no mínimo 6 caracteres.";
        case "auth/too-many-requests":
            return "Muitas tentativas sem sucesso. Aguarde alguns instantes e tente novamente.";
        case "auth/network-request-failed":
            return "Falha na conexão de rede. Verifique sua internet e tente novamente.";
        case "auth/popup-closed-by-user":
            return "O login foi cancelado (janela fechada antes de concluir).";
        case "auth/popup-blocked":
            return "A janela de login foi bloqueada pelo navegador. Permita pop-ups para continuar.";
        case "auth/cancelled-popup-request":
            return "A solicitação de login em pop-up foi cancelada.";
        case "auth/account-exists-with-different-credential":
            return "Já existe uma conta associada a este e-mail com outro método de login.";
        case "auth/requires-recent-login":
            return "Esta ação exige autenticação recente. Por favor, faça login novamente.";
        case "auth/expired-action-code":
            return "O link ou código expirou.";
        case "auth/invalid-action-code":
            return "O código ou link informado é inválido.";
        default:
            break;
    }

    // Se contiver texto cru do Firebase ou menção ao auth/, não exibe o erro cru
    if (rawMessage.includes("Firebase:") || rawMessage.includes("auth/")) {
        return defaultMessage;
    }

    // Se for uma mensagem amigável lançada pela própria aplicação
    if (rawMessage && !rawMessage.toLowerCase().includes("firebase")) {
        return rawMessage;
    }

    return defaultMessage;
}
