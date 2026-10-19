import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baglobal.com.br"),
  title: { default: "BAGLOBAL | Soluções Financeiras Internacionais", template: "%s | BAGLOBAL" },
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
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BAGLOBAL Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  twitter: { card: "summary_large_image", title: "BAGLOBAL | Soluções Financeiras Internacionais", description: "Pagamentos internacionais e gestão financeira para sua empresa.", images: ["/og-image.png"] },
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

export const viewport: Viewport = { themeColor: "#0B0C0F" };

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
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
