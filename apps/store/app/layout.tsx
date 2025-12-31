import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Changed from Inter to Outfit due to previous step
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/cart-drawer";
import { Footer } from "../components/Footer";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "POINTER. | Camisas de Futebol Premium",
    description: "A loja oficial de camisas de futebol de elite. Encontre o manto do seu time do coração com qualidade premium.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${outfit.className} min-h-screen bg-background font-sans antialiased`}>
                <Navbar />
                <CartDrawer />
                {children}
                <Footer />
            </body>
        </html>
    );
}
