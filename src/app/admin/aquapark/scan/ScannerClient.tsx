'use client';

/**
 * Camera-based QR scanner for aquapark ticket verification.
 *
 * Uses html5-qrcode (handles getUserMedia + jsQR internally).
 * Mobile-first layout — designed to be opened on the host phone at the entrance.
 *
 * Flow:
 *   - Start camera → continuously scan
 *   - On detection → POST to /api/admin/aquapark/scan
 *   - Show result (success / specific failure reason)
 *   - Cooldown 3 seconds before next scan to avoid double-scanning
 *   - "Сканувати наступний" button to manually reset
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Check, X, AlertCircle, Camera, RefreshCw, KeyboardIcon } from 'lucide-react';
import { formatPrice } from '@/types/cart';
import { AquaparkTicket } from '@/types/aquapark';

type Result =
  | { kind: 'success'; ticket: AquaparkTicket }
  | { kind: 'failure'; reason: string; ticket?: AquaparkTicket }
  | null;

const REASON_LABEL: Record<string, string> = {
  'not-found': 'Квиток не знайдено',
  unpaid: 'Не оплачено',
  used: 'Квиток вже використано',
  cancelled: 'Квиток скасовано',
  'wrong-date': 'Не той день візиту',
};

const COOLDOWN_MS = 3000;

export function ScannerClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);

  const verify = useCallback(async (qrCode: string) => {
    try {
      const res = await fetch('/api/admin/aquapark/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode }),
      });
      const data = await res.json();
      if (data.ok && data.ticket) {
        setResult({ kind: 'success', ticket: data.ticket });
      } else {
        setResult({
          kind: 'failure',
          reason: data.reason ?? 'unknown',
          ticket: data.ticket,
        });
      }
    } catch {
      setResult({ kind: 'failure', reason: 'network' });
    }
  }, []);

  // Initialize scanner
  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;
    let html5Qrcode: InstanceType<typeof import('html5-qrcode').Html5Qrcode> | null = null;

    const init = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;
        const id = 'qr-reader';
        const el = document.getElementById(id);
        if (!el) return;

        html5Qrcode = new Html5Qrcode(id);
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 280, height: 280 } },
          (decodedText: string) => {
            // Cooldown to prevent double-scanning
            const now = Date.now();
            if (
              lastScanRef.current &&
              lastScanRef.current.code === decodedText &&
              now - lastScanRef.current.at < COOLDOWN_MS
            ) {
              return;
            }
            lastScanRef.current = { code: decodedText, at: now };
            verify(decodedText);
          },
          () => {
            // Per-frame "no code found" — silently ignored
          }
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не вдалось запустити камеру');
          setScanning(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      const inst = scannerRef.current;
      if (inst) {
        inst.stop().catch(() => {}).finally(() => {
          try {
            inst.clear();
          } catch {}
        });
        scannerRef.current = null;
      }
    };
  }, [scanning, verify]);

  const handleStart = () => {
    setError(null);
    setResult(null);
    setScanning(true);
  };

  const handleStop = () => {
    setScanning(false);
  };

  const handleNext = () => {
    setResult(null);
    lastScanRef.current = null;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      verify(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Camera area */}
      <div className="bg-[#0f1f18] rounded-3xl overflow-hidden shadow-2xl shadow-[#0f1f18]/30">
        {!scanning && !result && (
          <div className="aspect-square flex flex-col items-center justify-center text-center p-8 text-white">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Camera className="h-7 w-7 text-white/80" />
            </div>
            <p className="font-display text-xl font-semibold mb-2">Сканер вимкнено</p>
            <p className="text-sm text-white/60 mb-6 max-w-xs">
              Натисніть кнопку, щоб увімкнути камеру і сканувати QR-коди квитків.
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0f1f18] font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Увімкнути камеру
            </button>
          </div>
        )}

        {scanning && (
          <div ref={containerRef} className="relative">
            <div id="qr-reader" className="w-full aspect-square bg-black" />
          </div>
        )}

        {result && <ResultPanel result={result} />}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        {result && (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Сканувати наступний
          </button>
        )}
        {scanning && !result && (
          <button
            type="button"
            onClick={handleStop}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-[#1a3d2e]/15 text-[#1a3d2e] font-semibold text-sm hover:bg-[#1a3d2e]/5 transition-colors"
          >
            Зупинити
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowManual((v) => !v)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-[#1a3d2e]/15 text-[#1a3d2e] font-semibold text-sm hover:bg-[#1a3d2e]/5 transition-colors"
        >
          <KeyboardIcon className="h-4 w-4" />
          Ввести вручну
        </button>
      </div>

      {/* Manual input */}
      {showManual && (
        <form onSubmit={handleManualSubmit} className="bg-white border border-[#1a3d2e]/15 rounded-2xl p-4 flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="gluh-aqua-…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-sm focus:outline-none focus:border-[#1a3d2e]/40"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e]"
          >
            Перевірити
          </button>
        </form>
      )}
    </div>
  );
}

function ResultPanel({ result }: { result: NonNullable<Result> }) {
  if (result.kind === 'success') {
    const ticket = result.ticket;
    const totalQty = ticket.items.reduce((s, i) => s + i.quantity, 0);
    return (
      <div className="bg-emerald-500 text-white p-6 lg:p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 mb-1">
          Прохід дозволено
        </p>
        <h3 className="font-display text-3xl font-semibold mb-3">№{ticket.number}</h3>
        <div className="border-t border-white/20 pt-4 text-left max-w-xs mx-auto space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Клієнт</span>
            <span className="font-semibold">{ticket.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Квитків</span>
            <span className="font-semibold">{totalQty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Сума</span>
            <span className="font-semibold tabular-nums">{formatPrice(ticket.total)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Failure
  const reasonLabel = REASON_LABEL[result.reason] ?? 'Невідома помилка';
  const isSoftFail = result.reason === 'wrong-date';
  return (
    <div
      className={`${isSoftFail ? 'bg-amber-500' : 'bg-red-500'} text-white p-6 lg:p-10 text-center`}
    >
      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
        <X className="h-12 w-12 text-white" strokeWidth={3} />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 mb-1">
        Прохід заборонено
      </p>
      <h3 className="font-display text-2xl font-semibold mb-3">{reasonLabel}</h3>
      {result.ticket && (
        <div className="border-t border-white/20 pt-4 text-left max-w-xs mx-auto space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Квиток</span>
            <span className="font-semibold">№{result.ticket.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Клієнт</span>
            <span className="font-semibold">{result.ticket.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Дата</span>
            <span className="font-semibold">
              {new Date(result.ticket.date).toLocaleDateString('uk-UA', { dateStyle: 'short' })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
