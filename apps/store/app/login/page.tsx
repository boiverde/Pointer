
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para a Loja
                    </Link>
                </div>

                <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2 tracking-tighter">BEM-VINDO</h1>
                        <p className="text-neutral-400 text-sm">Entre na sua conta para acompanhar pedidos</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Senha</label>
                            <input
                                type="password"
                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button className="w-full bg-white text-black font-black py-4 rounded-lg hover:bg-neutral-200 transition-colors uppercase tracking-widest text-sm mt-4">
                            Entrar
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-neutral-500 text-sm">
                            Ainda não tem conta? <Link href="#" className="text-white underline decoration-1 underline-offset-4">Criar conta</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
