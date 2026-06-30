import type { Metadata } from "next";
import "chiselui/styles.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Frostboard — SaaS admin dashboard",
    template: "%s",
  },
  description:
    "A modern admin dashboard template for SaaS products, built with Next.js 14 and chiselui.",
  openGraph: {
    title: "Frostboard — SaaS admin dashboard",
    description:
      "A modern admin dashboard template for SaaS products, built with Next.js 14 and chiselui.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frostboard — SaaS admin dashboard",
    description:
      "A modern admin dashboard template for SaaS products, built with Next.js 14 and chiselui.",
  },
};

/**
 * Applies the persisted chiselui theme to <html> before the page paints, so a
 * reload doesn't flash the wrong colour scheme before ThemeToggle hydrates.
 * Mirrors ThemeToggle's own logic: it reads the `chiselui-theme` key and writes
 * `data-theme` to documentElement (removing it for "system" to follow the OS).
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('chiselui-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
