
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para o Início
                    </Link>
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">SOBRE NÓS</h1>

                <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
                    <p>
                        A <span className="text-primary font-bold">POINTER</span> nasceu da paixão pelo futebol e pelo design.
                        Somos uma boutique especializada em camisas de futebol premium, focada em trazer não apenas o uniforme,
                        mas a história e a glória que cada peça carrega.
                    </p>
                    <p>
                        Trabalhamos apenas com produtos oficiais e licenciados, garantindo que cada fio conte a história verdadeira do seu time do coração.
                        Nossa curadoria é meticulosa, buscando as peças mais icônicas das temporadas atuais e passadas.
                    </p>
                    <p>
                        Mais do que uma loja, somos um ponto de encontro para quem entende que futebol é muito mais que um jogo.
                    </p>
                </div>

                <div className="mt-12 p-8 bg-neutral-900 rounded-2xl border border-white/5">
                    <h2 className="text-2xl font-bold mb-4 text-white">Nosso Compromisso</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Produtos 100% Originais
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Envio Rápido e Seguro
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Atendimento Especializado
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
