'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function TicketQrDisplay({ qrCode }: { qrCode: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(qrCode, {
      width: 220,
      margin: 2,
      color: { dark: '#0f1f18', light: '#fdfaf0' },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [qrCode]);

  if (!dataUrl) {
    return <div className="w-[220px] h-[220px] bg-[#1a3d2e]/5 animate-pulse rounded-xl" />;
  }
  return (
    <div className="inline-block bg-white p-3 rounded-xl border border-[#1a3d2e]/15">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="QR-код квитка" width={220} height={220} />
    </div>
  );
}
