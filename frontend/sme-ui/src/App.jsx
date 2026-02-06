import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://sme-financial-platform-1.onrender.com";

/* ---------- Helpers ---------- */
const money = (v) =>
  v == null ? "—" : `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const percent = (v) =>
  v == null ? "—" : `${Number(v).toFixed(2)}%`;

/* ---------- Layout ---------- */

const Page = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#f4f6fb",
      display: "flex",
      justifyContent: "center",
      overflowX: "hidden"
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 1280,
        padding: "32px 20px",
        boxSizing: "border-box",
        fontFamily: "Inter, system-ui, -apple-system"
      }}
    >
      {children}
    </div>
  </div>
);

/* ---------- Components ---------- */

const Section = ({ title, subtitle, children }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 22, marginBottom: 6 }}>{title}</h2>
    {subtitle && <p style={{ color: "#6b7280", marginBottom: 18 }}>{subtitle}</p>}
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)"
      }}
    >
      {children}
    </div>
  </section>
);

const KPI = ({ label, value }) => (
  <div
    style={{
      background: "linear-gradient(180deg, #ffffff, #f8fafc)",
      borderRadius: 16,
      padding: 22,
      boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
      minWidth: 0
    }}
  >
    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
  </div>
);

const Badge = ({ text, type }) => {
  const map = {
    good: "#16a34a",
    warn: "#d97706",
    bad: "#dc2626"
  };
  return (
    <span
      style={{
        padding: "8px 16px",
        borderRadius: 999,
        background: map[type] + "22",
        color: map[type],
        fontWeight: 600,
        fontSize: 14
      }}
    >
      {text}
    </span>
  );
};

/* ---------- App ---------- */

function App() {
  const [data, setData] = useState(null);
  const [credit, setCredit] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [gst, setGst] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/analysis/financial-insights`).then(r => setData(r.data));
    axios.get(`${API_BASE}/analysis/creditworthiness`).then(r => setCredit(r.data));
    axios.get(`${API_BASE}/analysis/cashflow-forecast?months=6`).then(r => setForecast(r.data));
    axios.get(`${API_BASE}/analysis/gst-compliance`).then(r => setGst(r.data));
    axios.get(`${API_BASE}/analysis/financial-products`)
      .then(r => setProducts(r.data?.recommended_products || []));
  }, []);

  if (!data) {
    return (
      <Page>
        <h2>Analyzing your finances…</h2>
        <p>AI is evaluating your business health.</p>
      </Page>
    );
  }

  return (
    <Page>

      {/* ---------- HERO ---------- */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          borderRadius: 28,
          padding: "48px 40px",
          color: "#fff",
          marginBottom: 56
        }}
      >
        <h1 style={{ fontSize: 40, fontWeight: 800 }}>
          SME Financial Health Dashboard
        </h1>
        <p style={{ opacity: 0.9, fontSize: 16, marginTop: 10 }}>
          AI-powered clarity for cash flow, compliance & credit readiness
        </p>
      </div>

      {/* ---------- KPIs ---------- */}
      <Section
        title="📊 Financial Health Snapshot"
        subtitle="Instant view of business performance"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 28
          }}
        >
          <KPI label="Revenue" value={money(data.metrics?.revenue)} />
          <KPI label="Expenses" value={money(data.metrics?.expenses)} />
          <KPI label="Profit Margin" value={percent(data.metrics?.profit_margin)} />
          <KPI label="Cash Balance" value={money(data.metrics?.cash_balance)} />
          <KPI
            label="Runway"
            value={
              data.metrics?.runway_months == null
                ? "—"
                : `${data.metrics.runway_months} months`
            }
          />
        </div>

        <Badge
          text={`Overall Health Score: ${data.score}`}
          type={data.score > 70 ? "good" : data.score > 40 ? "warn" : "bad"}
        />
      </Section>

      {/* ---------- AI INSIGHTS ---------- */}
      <Section
        title="🤖 AI Executive Summary"
        subtitle="Actionable insights derived from your data"
      >
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
          {data.insights}
        </p>
      </Section>

      {/* ---------- CREDIT ---------- */}
      {credit && (
        <Section
          title="🏦 Credit Readiness"
          subtitle="Funding & loan eligibility analysis"
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div>DSCR: <strong>{credit.dscr}</strong></div>
            <div>Avg Monthly Cash Flow: {money(credit.average_monthly_cashflow)}</div>
            <div>Total EMI: {money(credit.total_monthly_emi)}</div>
            <div>Status: <strong>{credit.lending_readiness}</strong></div>
          </div>
        </Section>
      )}

      {/* ---------- FORECAST ---------- */}
      {forecast && (
        <Section
          title="📈 Cash Flow Forecast"
          subtitle="Next 6 months projection"
        >
          <ul>
            {Object.entries(forecast.forecast || {}).map(([m, f]) => (
              <li key={m}>{m}: {money(f.expected_balance)}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* ---------- GST ---------- */}
      {gst && (
        <Section
          title="🧾 GST Compliance"
          subtitle="Tax exposure & compliance health"
        >
          <ul>
            <li>Total Output GST: {money(gst.total_output_gst)}</li>
            <li>Total Input GST: {money(gst.total_input_gst)}</li>
            <li>Net GST Payable: {money(gst.net_gst_payable)}</li>
            <li>Compliance Score: {gst.compliance_score}</li>
          </ul>
        </Section>
      )}

      {/* ---------- PRODUCTS ---------- */}
      <Section
        title="💼 Recommended Financial Products"
        subtitle="AI-suggested growth & funding options"
      >
        <ul>
          {products.map((p, i) => (
            <li key={i}>
              <strong>{p.product}</strong> — {p.reason}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- REPORT ---------- */}
      <Section title="📄 Download Report">
        <a
          href={`${API_BASE}/reports/download`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "14px 22px",
            background: "#4f46e5",
            color: "#fff",
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          Download Investor-Ready PDF
        </a>
      </Section>

    </Page>
  );
}

export default App;
