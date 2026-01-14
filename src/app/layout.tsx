import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BAGLOBAL | Pagamentos Internacionais e Comércio Exterior",
  description: "Gestão avançada de pagamentos, antecipação de recebíveis e pagamento de fornecedores em USD e USDt com compliance e segurança.",
  keywords: ["pagamentos internacionais", "comércio exterior", "fintech", "USDt", "gestão financeira"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} font-inter antialiased bg-background-base text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
