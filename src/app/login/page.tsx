'use client';

import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LoginFormValues } from "@/features/auth/schemas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
        } catch (error: any) {
            const msg = error.message || "Falha ao entrar";
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
        } catch (error: any) {
            const msg = error.message || "Falha ao entrar com Google";
            setAuthError(msg);
            toast.error(msg);
            setIsGoogleLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
            <Card className="w-full max-w-md border-none shadow-2xl bg-card/60 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center tracking-tight">Ondina</CardTitle>
                    <CardDescription className="text-center text-lg">
                        Bem-vinda de volta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="seu@email.com" className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-primary" {...field} />
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
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="password" placeholder="******" className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-primary" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {authError && <p className="text-sm text-red-500 font-medium text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">{authError}</p>}
                            <Button type="submit" className="w-full h-11 text-base rounded-xl transition-all hover:scale-[1.02]" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                Entrar <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Ou entre com</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full h-11 rounded-xl hover:bg-white/50 dark:hover:bg-zinc-800/50" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>}
                        Google
                    </Button>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Criar conta
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
