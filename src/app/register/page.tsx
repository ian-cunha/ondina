'use client';

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiquidLoader } from "@/components/ui/liquid-loader";
import { Loader2, User, Mail, Lock, Users } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RegisterFormValues } from "@/features/auth/schemas";
import { getAuthErrorMessage } from "@/features/auth/errors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Image from "next/image";

export default function RegisterPage() {
    const { registerWithEmail } = useAuth();
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            partnerCode: "",
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        setAuthError(null);
        setIsLoading(true);
        try {
            await registerWithEmail(values.email, values.password, values.name);
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Erro ao criar usuário");

            await setDoc(doc(db, 'users', currentUser.uid), {
                displayName: values.name,
                email: values.email,
            }, { merge: true });

            toast.success("Conta criada com sucesso!");
            router.push("/onboarding");
        } catch (error) {
            let msg = getAuthErrorMessage(error, "Falha ao registrar");
            setAuthError(msg);
            toast.error(msg);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative">
            <div className="w-full max-w-md liquid-glass rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute -top-20 -left-20 w-44 h-44 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl pointer-events-none" />

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
                        Crie sua conta
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Comece a monitorar seu ciclo de forma inteligente
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Nome é obrigatório" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-muted-foreground">Nome</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Seu Nome"
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
                            rules={{
                                required: "Senha é obrigatória",
                                minLength: { value: 6, message: "Mínimo 6 caracteres" }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-muted-foreground">Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="Mínimo 6 caracteres"
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
                            name="confirmPassword"
                            rules={{
                                required: "Confirmação obrigatória",
                                validate: (val) => val === form.getValues("password") || "Senhas não conferem"
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-muted-foreground">Confirmar Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="Confirme sua senha"
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
                            Criar Conta
                        </Button>
                    </form>
                </Form>

                <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground font-medium">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-bold text-primary hover:underline transition-colors">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
