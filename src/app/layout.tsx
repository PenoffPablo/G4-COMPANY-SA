import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import { UIProvider } from "@/context/UIContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "G4 Company S.A | Visión Global de Negocios",
  description: "Firma especializada en apertura y desarrollo de mercados para empresas productivas. Exportación y Desarrollo Comercial Externalizado.",
  icons: {
    icon: "/logo-g4.ico"
  },
  openGraph: {
    title: "G4 Company S.A | Visión Global de Negocios",
    description: "Desarrollo de mercados internacionales para empresas productivas de alto valor agregado.",
    url: "https://g4-company.vercel.app/",
    siteName: "G4 Company S.A",
    images: [
      {
        url: "/logo-g4.webp",
        width: 1200,
        height: 1200,
        alt: "Logo G4 Company S.A",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "G4 Company S.A | Visión Global de Negocios",
    description: "Desarrollo de mercados internacionales para empresas productivas.",
    images: ["/logo-g4.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <UIProvider>
                <Header />
                {children}
              </UIProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
