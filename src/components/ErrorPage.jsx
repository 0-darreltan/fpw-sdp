import { useRouteError, Link } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Route error:", error);

  const status = error?.status || error?.statusCode || 500;
  const statusText =
    error?.statusText || (status === 404 ? "Not Found" : "Server Error");
  const message =
    error?.data?.message ||
    error?.message ||
    "Terjadi kesalahan yang tidak terduga.";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#071029 0%, #0b1220 100%)",
        padding: "2rem",
        boxSizing: "border-box",
        color: "#E6EEF8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          background: "#071427",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <img
          src="/"
          alt="error"
          onError={(e) => (e.currentTarget.src = "/fallback.png")}
          style={{
            width: 180,
            height: 180,
            objectFit: "cover",
            borderRadius: 8,
            flex: "none",
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
          }}
        />

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, color: "#FF7A7A" }}>
            WAH, TERJADI KESALAHAN
          </h1>

          <p style={{ margin: "8px 0 16px", color: "#AFC7DE" }}>
            <strong>{status}</strong> — {statusText}
          </p>

          <p style={{ margin: 0, color: "#DDE9F8", lineHeight: 1.5 }}>
            {message}
          </p>

          {error?.stack && (
            <pre
              style={{
                marginTop: 16,
                background: "#031420",
                padding: 12,
                borderRadius: 8,
                overflowX: "auto",
                color: "#9EE2E6",
                fontSize: 12,
              }}
            >
              {String(error.stack)}
            </pre>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Link
              to="/"
              style={{
                background: "#2563EB",
                color: "white",
                padding: "10px 14px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Kembali ke Beranda
            </Link>

            <button
              onClick={() => window.history.back()}
              style={{
                background: "transparent",
                color: "#E6EEF8",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
              }}
            >
              Kembali
            </button>

            <a
              href={`mailto:admin@example.com?subject=Error%20${status}`}
              style={{
                color: "#93C5FD",
                textDecoration: "underline",
                fontSize: 14,
              }}
            >
              Laporkan masalah
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
