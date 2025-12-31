
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-white/5 pt-20 pb-10 text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Jersey<span className="text-neutral-600">Store</span></h2>
                        </Link>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                            Kits de futebol premium para o verdadeiro fã. Produtos autênticos, designs lendários e entrega para todo o Brasil.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Facebook className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Youtube className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-white/40">Loja</h3>
                        <ul className="space-y-4 text-sm font-medium text-neutral-400">
                            <li><Link href="/collections/all" className="hover:text-primary transition-colors">Todas as Camisas</Link></li>
                            <li><Link href="/collections/new" className="hover:text-primary transition-colors">Lançamentos</Link></li>
                            <li><Link href="/collections/best-sellers" className="hover:text-primary transition-colors">Mais Vendidos</Link></li>
                            <li><Link href="/sale" className="text-accent hover:text-white transition-colors">Ofertas</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-white/40">Suporte</h3>
                        <ul className="space-y-4 text-sm font-medium text-neutral-400">
                            <li><Link href="/order-status" className="hover:text-primary transition-colors">Meus Pedidos</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Frete e Entrega</Link></li>
                            <li><Link href="/returns" className="hover:text-primary transition-colors">Trocas e Devoluções</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-white/40">Fique Ligado</h3>
                        <p className="text-neutral-500 text-xs mb-4">Inscreva-se para lançamentos exclusivos e 10% de desconto no seu primeiro pedido.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <button className="bg-primary text-black font-bold uppercase tracking-wider text-xs px-6 rounded-lg hover:bg-white transition-colors">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-neutral-600 text-xs">
                        © 2024 Jersey Store Inc. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6">
                        <div className="h-5 w-8 bg-white/10 rounded-sm opacity-50 hover:opacity-100 transition-opacity"></div>
                        <div className="h-5 w-8 bg-white/10 rounded-sm opacity-50 hover:opacity-100 transition-opacity"></div>
                        <div className="h-5 w-8 bg-white/10 rounded-sm opacity-50 hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a href={href} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-black hover:bg-white transition-all duration-300">
            {icon}
        </a>
    );
}
