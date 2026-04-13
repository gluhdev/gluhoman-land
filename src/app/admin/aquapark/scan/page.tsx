import { Metadata } from 'next';
import { ScannerClient } from './ScannerClient';

export const metadata: Metadata = {
  title: 'Сканер квитків — Глухомань',
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 lg:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Аквапарк
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
            Сканер квитків
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
          <p className="text-sm text-[#1a3d2e]/60 mt-3">
            Наведіть камеру на QR-код квитка. Сканування відбувається автоматично.
          </p>
        </div>

        <ScannerClient />
      </div>
    </div>
  );
}
