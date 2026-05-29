// src/lib/liqpay-redirect.ts — client-only DOM helper
/** Auto-POST a LiqPay form to the gateway (full top-level navigation). */
export function submitLiqPayForm(endpoint: string, data: string, signature: string): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = endpoint;
  form.acceptCharset = "utf-8";
  for (const [name, value] of [["data", data], ["signature", signature]] as const) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export interface LiqPayCreateResponse {
  mode: "liqpay" | "stub" | "already-paid";
  data?: string;
  signature?: string;
  endpoint?: string;
  entity?: { successPath?: string };
}
