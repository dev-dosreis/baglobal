import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BAGLOBAL | Soluções Financeiras Internacionais",
  description: "Especialistas em pagamentos internacionais, câmbio e gestão de ativos digitais. Soluções seguras e ágeis para seu negócio global.",
  keywords: ["pagamentos internacionais", "comércio exterior", "fintech", "USDt", "gestão financeira", "câmbio", "ativos virtuais", "PSAV"],
  authors: [{ name: "BAGLOBAL" }],
  openGraph: {
    title: "BAGLOBAL | Soluções Financeiras Internacionais",
    description: "Gestão avançada de pagamentos, antecipação de recebíveis e pagamento de fornecedores em USD e USDt.",
    url: "https://baglobal.com.br",
    siteName: "BAGLOBAL",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo-final.png",
        width: 800,
        height: 600,
        alt: "BAGLOBAL Logo",
      },
    ],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
