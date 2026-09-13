'use client';

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiquidLoader } from "@/components/ui/liquid-loader";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoginFormValues } from "@/features/auth/schemas";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        setAuthError(null);
        setIsLoading(true);
        try {
            await loginWithEmail(values.email, values.password);
            toast.success("Login realizado com sucesso!");
            router.push("/");
        } catch (error) {
            const msg = getAuthErrorMessage(error, "Falha ao entrar");
            setAuthError(msg);
            toast.error(msg);
            setIsLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        setAuthError(null);
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
            toast.success("Login com Google realizado!");
            router.push("/");
        } catch (error) {
            const msg = getAuthErrorMessage(error, "Falha ao entrar com Google");
            setAuthError(msg);
            toast.error(msg);
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative">
            {/* Liquid Glass Modal Card */}
            <div className="w-full max-w-md liquid-glass rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
                {/* Specular highlight */}
                <div className="absolute -top-20 -left-20 w-44 h-44 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl pointer-events-none" />

                {/* Header */}
                <div className="text-center space-y-2 flex flex-col items-center">
                    <div className="p-2.5 rounded-2xl liquid-glass-pill mb-1">
                        <Image
                            src="/logo.svg"
                            alt="Ondina"
                            width={48}
                            height={48}
                            className="h-12 w-12 drop-shadow-sm"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
                        Ondina
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Bem-vinda de volta ao seu espaço seguro
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: "Email é obrigatório",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-muted-foreground">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="seu@email.com"
                                                className="pl-10 h-12 rounded-2xl liquid-glass-input"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            rules={{ required: "Senha é obrigatória" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-muted-foreground">Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-12 rounded-2xl liquid-glass-input"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {authError && (
                            <div className="text-xs text-rose-500 font-medium text-center bg-rose-500/10 p-3 rounded-2xl border border-rose-500/25">
                                {authError}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold rounded-2xl liquid-button-primary cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? <LiquidLoader size="sm" className="mr-2" /> : null}
                            <span>Entrar</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </Form>

                {/* Divider */}
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/40 dark:border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-3 text-muted-foreground font-semibold">
                            Ou continue com
                        </span>
                    </div>
                </div>

                {/* Google Login */}
                <Button
                    variant="outline"
                    className="w-full h-12 rounded-2xl liquid-glass-pill hover:bg-white/50 dark:hover:bg-white/10 font-semibold cursor-pointer"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                >
                    {isGoogleLoading ? (
                        <LiquidLoader size="sm" className="mr-2" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                    )}
                    Google
                </Button>

                {/* Footer Link */}
                <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground font-medium">
                        Ainda não tem uma conta?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline transition-colors">
                            Cadastre-se gratuitamente
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
