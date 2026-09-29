import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Editorial display face for headlines. Regular + italic only, by design.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "How Long Would You Live? A Longevity Projection Model",
  description:
    "If biological aging were solved, how long would people actually live? An interactive, sourced model of lifespan under solved aging, with your own life drawn into it.",
  openGraph: {
    title: "How Long Would You Live? A Longevity Projection Model",
    description:
      "Solving aging is not immortality. The math says centuries, a real chance at forever, and a gap that is measured in lifetimes. See where you land.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="bg-white text-zinc-900">
        {children}
      </body>
    </html>
  );
}
