
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../../services/auth.service';
import { Lock } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const googleToken = searchParams.get('google_token');
        if (googleToken) {
            authService.setAuthToken(googleToken);
            router.push('/');
            return;
        }

        // If already logged in, redirect to dashboard
        if (authService.isAuthenticated()) {
            router.push('/');
        }
    }, [router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.login(email, password);
            router.push('/');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-neutral-950 text-white overflow-hidden">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 font-bold tracking-widest uppercase text-xs text-white/50">
                    POINTER Admin
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
                        GERENCIE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">SUA DINASTIA.</span>
                    </h1>
                    <p className="text-neutral-400 max-w-md text-lg">
                        Controle total sobre inventário, pedidos e métricas de desempenho em tempo real.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-neutral-600 font-mono">
                    System Level: Alpha v1.0
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-950 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-2xl">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
                        <p className="text-neutral-400 mt-2">Entre com suas credenciais de administrador.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                    Email Corporativo
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-700 font-mono text-sm"
                                    placeholder="admin@jersey.store"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">
                                    Senha de Acesso
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-700 font-mono text-sm"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Acessar Painel
                                        {/* <span className="group-hover:translate-x-1 transition-transform">→</span> */}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-neutral-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-neutral-950 px-2 text-neutral-500">Ou continue com</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`}
                            className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                        >
                            <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M24 12.276c0-.85-.076-1.666-.217-2.456H12.273v4.643h6.576c-.283 1.516-1.144 2.802-2.435 3.665v3.047h3.942c2.306-2.123 3.634-5.247 3.634-8.899z" />
                                <path fill="#34A853" d="M12.273 24c3.3 0 6.069-1.092 8.09-2.956l-3.942-3.047c-1.095.733-2.495 1.168-4.148 1.168-3.183 0-5.877-2.15-6.84-5.043H1.365v3.171C3.39 21.192 7.502 24 12.273 24z" />
                                <path fill="#FBBC05" d="M5.433 14.122c-.244-.733-.385-1.516-.385-2.327 0-.81.14-1.593.385-2.326V6.298H1.365C.493 8.038 0 10.005 0 12.205c0 2.2.493 4.167 1.365 5.907l4.068-3.99z" />
                                <path fill="#4285F4" d="M12.273 4.672c1.795 0 3.407.618 4.674 1.826l3.504-3.504C18.337.95 15.57 0 12.273 0 7.502 0 3.39 2.808 1.365 6.298l4.068 3.17C6.396 6.822 9.09 4.672 12.273 4.672z" />
                            </svg>
                            Google Workspace
                        </button>
                    </div>

                    <div className="text-center pt-8 border-t border-neutral-900">
                        <p className="text-xs text-neutral-600">
                            Esqueceu sua senha? <a href="#" className="underline hover:text-white transition-colors">Contate o suporte técnico.</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">Carregando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
