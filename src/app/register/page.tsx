'use client';

import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RegisterFormValues } from "@/features/auth/schemas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// ... imports
import { Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function RegisterPage() {
    const { registerWithEmail, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // State to toggle partner code input
    const [isPartner, setIsPartner] = useState(false);

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
            // 1. Create User
            await registerWithEmail(values.email, values.password, values.name);
            const user = auth.currentUser;
            if (!user) throw new Error("Erro ao criar usuário");

            // 2. Set Role
            const role = isPartner ? 'partner' : 'user';

            // 3. If Partner, Link (or try to)
            if (isPartner && values.partnerCode) {
                const code = values.partnerCode.toUpperCase();

                // Verify code first to avoid creating partner account with bad code?
                // Actually, account is created. We just link.
                const inviteRef = doc(db, 'invites', code);
                const inviteSnap = await getDoc(inviteRef);

                if (!inviteSnap.exists()) {
                    // If code is invalid, we still created the account but failed to link.
                    // We should probably warn user but proceed to onboarding to fix it?
                    // Or alert and stop redirect?
                    // Let's alert.
                    throw new Error("Código de parceiro inválido.");
                }

                const { inviterId } = inviteSnap.data();

                // REMOVED: Check if inviter already has a partner (Permissions prevent reading inviter doc)
                // We rely on Firestore Rules to fail the write if partnerId is already set.

                // Link

                // Link safely using Batch to ensure atomicity
                const batch = writeBatch(db);

                const userRef = doc(db, 'users', user.uid);
                const inviterRef = doc(db, 'users', inviterId);

                batch.set(userRef, {
                    role: 'partner',
                    linkedAccountId: inviterId
                }, { merge: true });

                batch.set(inviterRef, {
                    partnerId: user.uid
                }, { merge: true });

                await batch.commit();

                toast.success("Conta parceira criada e vinculada!");
                router.push("/"); // Go to Partner Dashboard directly
            } else {
                // Regular User - Don't assign role yet! Let Onboarding handle it.
                await setDoc(doc(db, 'users', user.uid), {
                    displayName: values.name,
                    email: values.email,
                    // role: 'user' // REMOVED: Force user to select role in onboarding
                }, { merge: true });

                toast.success("Conta criada com sucesso!");
                router.push("/onboarding");
            }
        } catch (error: any) {
            let msg = error.message || "Falha ao registrar";
            if (msg.includes("permission-denied") || msg.includes("Missing or insufficient permissions")) {
                msg = "Este código já está sendo usado por outro parceiro.";
            }
            setAuthError(msg);
            toast.error(msg);
            setIsLoading(false);
        }
    }

    // ... existing google login ...
    const handleGoogleLogin = async () => {
        // ... (same as before)
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
            <Card className="w-full max-w-md border-none shadow-2xl bg-card/60 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center tracking-tight">Crie sua conta</CardTitle>
                    <CardDescription className="text-center text-lg">
                        Comece a monitorar seu ciclo hoje
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* ... Name ... */}
                            {/* ... Email ... */}
                            {/* ... Password ... */}
                            {/* ... Confirm Password ... */}
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: "Nome é obrigatório" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Seu Nome" className="pl-10 bg-background/50" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                rules={{ required: "Email é obrigatório" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="seu@email.com" className="pl-10 bg-background/50" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                rules={{ required: "Senha é obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres" } }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="password" placeholder="******" className="pl-10 bg-background/50" {...field} />
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
                                        <FormLabel>Confirmar Senha</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="password" placeholder="******" className="pl-10 bg-background/50" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Partner Toggle */}
                            <div className="flex items-center space-x-2 py-2">
                                <Checkbox
                                    id="isPartner"
                                    checked={isPartner}
                                    onCheckedChange={(checked) => setIsPartner(checked as boolean)}
                                />
                                <label
                                    htmlFor="isPartner"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Quero acompanhar minha parceira
                                </label>
                            </div>

                            {/* Partner Code Input */}
                            {isPartner && (
                                <FormField
                                    control={form.control}
                                    name="partnerCode"
                                    rules={{ required: isPartner ? "Código do parceiro é obrigatório" : false }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código de Acesso</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                                                    <Input
                                                        placeholder="Código fornecido por ela"
                                                        className="pl-10 bg-background/50 border-purple-500/50 focus:border-purple-500 uppercase tracking-widest"
                                                        maxLength={6}
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {authError && <p className="text-sm text-red-500 font-medium text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">{authError}</p>}
                            <Button type="submit" className="w-full h-11 text-base rounded-xl transition-all hover:scale-[1.02]" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                Criar conta
                            </Button>
                        </form>
                    </Form>
                    {/* ... Google Login ... */}
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Entrar
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
