/**
 * LiqPay Checkout API helpers (server-only).
 *
 * Docs: https://www.liqpay.ua/en/documentation/api/aquiring/checkout/doc
 *
 * Algorithm:
 *   data      = base64(JSON(params))
 *   signature = base64(sha1(private_key + data + private_key))
 *
 * The frontend submits a form to https://www.liqpay.ua/api/3/checkout
 * with `data` and `signature` fields. LiqPay redirects the user to the
 * payment page, then back to `result_url` after payment, and asynchronously
 * POSTs `data` and `signature` to `server_url` (our callback).
 *
 * STUB MODE: when `LIQPAY_PUBLIC_KEY` or `LIQPAY_PRIVATE_KEY` are missing,
 * the system bypasses the real LiqPay flow and marks orders as paid
 * immediately. This lets us develop the full UX without real keys.
 */

import crypto from 'crypto';

export interface LiqPayCheckoutParams {
  /** Order ID in our system */
  order_id: string;
  /** Amount in UAH (LiqPay expects decimal грн, not копійки) */
  amount: number;
  /** Currency, e.g. "UAH" */
  currency: 'UAH' | 'USD' | 'EUR';
  /** Description shown on LiqPay page */
  description: string;
  /** URL to redirect user after payment */
  result_url: string;
  /** Webhook URL (server-to-server) */
  server_url: string;
  /** Action: "pay" by default */
  action?: 'pay' | 'hold' | 'subscribe';
  /** API version */
  version?: number;
  /** Language: uk | en | ru */
  language?: 'uk' | 'en' | 'ru';
}

export interface LiqPaySignedPayload {
  data: string;
  signature: string;
  /** URL to POST the form to */
  endpoint: string;
}

export function isStubMode(): boolean {
  return !process.env.LIQPAY_PUBLIC_KEY || !process.env.LIQPAY_PRIVATE_KEY;
}

function getKeys(): { publicKey: string; privateKey: string } {
  const publicKey = process.env.LIQPAY_PUBLIC_KEY;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error('LIQPAY_PUBLIC_KEY/LIQPAY_PRIVATE_KEY not configured');
  }
  return { publicKey, privateKey };
}

/**
 * Build a signed LiqPay Checkout payload to redirect the user to.
 * Returns `{ data, signature, endpoint }` — frontend submits a form
 * to `endpoint` with hidden `data` and `signature` fields.
 */
export function buildCheckoutPayload(params: LiqPayCheckoutParams): LiqPaySignedPayload {
  const { publicKey, privateKey } = getKeys();
  const fullParams = {
    public_key: publicKey,
    version: 3,
    action: 'pay',
    language: 'uk',
    ...params,
  };
  const data = Buffer.from(JSON.stringify(fullParams)).toString('base64');
  const signature = sign(data, privateKey);
  return {
    data,
    signature,
    endpoint: 'https://www.liqpay.ua/api/3/checkout',
  };
}

/**
 * Verify a callback signature from LiqPay.
 * Returns the decoded params object if valid, or null if invalid.
 */
export function verifyCallback(
  data: string,
  signature: string
): Record<string, unknown> | null {
  let privateKey: string;
  try {
    privateKey = getKeys().privateKey;
  } catch {
    return null;
  }
  const expected = sign(data, privateKey);
  if (expected !== signature) return null;
  try {
    const json = Buffer.from(data, 'base64').toString('utf8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function sign(data: string, privateKey: string): string {
  return crypto
    .createHash('sha1')
    .update(privateKey + data + privateKey)
    .digest('base64');
}
