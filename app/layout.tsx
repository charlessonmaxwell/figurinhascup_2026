import type { Metadata } from 'next';
import '../src/styles/globals.css';

export const metadata: Metadata = {
  title: 'Figurinhas Cup 2026',
  description: 'Colecione figurinhas do seu time favorito',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
