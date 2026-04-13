"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#f0fdf4",
          color: "#0f172a",
          padding: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "32rem",
            width: "100%",
            textAlign: "center",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Критична помилка
          </h1>
          <p style={{ color: "#475569", marginBottom: "1.5rem" }}>
            Виникла серйозна помилка. Будь ласка, спробуйте оновити сторінку.
          </p>
          {error?.digest && (
            <p
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginBottom: "1.5rem",
              }}
            >
              Код: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#047857",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Спробувати ще раз
          </button>
        </div>
      </body>
    </html>
  );
}
