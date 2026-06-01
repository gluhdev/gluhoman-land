'use client';

/**
 * Shared error-display helpers for admin create/edit forms.
 *
 * The menu / aquapark / hotel server actions all return the same failure shape:
 *   { ok: false, error: parsed.error.flatten().fieldErrors }
 * i.e. `error` is a map of fieldName -> string[] (zod fieldErrors). On success
 * they redirect() (which throws and propagates), so useActionState only ever
 * receives this failure state.
 */

/** zod `flatten().fieldErrors` shape: each field maps to a list of messages. */
export type FieldErrors = Partial<Record<string, string[] | undefined>>;

export type ActionErrorState = { ok: false; error: FieldErrors } | null;

/** Inline per-field error messages, rendered directly under an input. */
export function FieldErrorList({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <>
      {errors.map((msg, i) => (
        <p key={i} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {msg}
        </p>
      ))}
    </>
  );
}

/**
 * Top-level error summary shown near the submit button. Lists every field error
 * (prefixed with its Ukrainian label) so validation failures HTML `required`
 * can't catch are never silent.
 */
export function FormErrorSummary({
  state,
  fieldLabels,
}: {
  state: ActionErrorState;
  fieldLabels: Record<string, string>;
}) {
  if (!state || state.ok !== false) return null;

  const entries = Object.entries(state.error).flatMap(([field, msgs]) =>
    (msgs ?? []).map((msg) => ({ field, msg }))
  );

  if (entries.length === 0) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
      >
        Не вдалося зберегти. Перевірте введені дані.
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <p className="font-semibold mb-1">Не вдалося зберегти:</p>
      <ul className="list-disc pl-5 space-y-0.5">
        {entries.map(({ field, msg }, i) => (
          <li key={i}>
            <span className="font-medium">{fieldLabels[field] ?? field}:</span> {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
