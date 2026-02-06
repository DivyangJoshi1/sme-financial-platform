import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://sme-financial-platform-1.onrender.com";

/* ---------- Reusable Components ---------- */

const Page = ({ children }) => (
  <div style={{
    background: "#f4f6fb",
    minHeight: "100vh",
    padding: "32px 40px",
    fontFamily: "Inter, system-ui, -apple-system"
  }}>
    {children}
  </div>
);

const Section = ({ title, subtitle, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ marginBottom: 4 }}>{title}</h2>
    {subtitle && <p style={{ color: "#666", marginBottom: 16 }}>{subtitle}</p>}
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: 24,
      boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
    }}>
      {children}
    </div>
  </div>
);

const KPI = ({ label, value }) => (
  <div style={{
    background: "#f9fafc",
    borderRadius: 12,
    padding: 18,
    boxShadow: "inset 0 0 0 1px #e6e9f0"
  }}>
    <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
  </div>
);

const Badge = ({ text, type }) => {
  const colors = {
    good: "#16a34a",
    warn: "#d97706",
    bad: "#dc2626"
  };
  return (
    <span style={{
      padding: "6px 12px",
      borderRadius: 999,
      background: colors[type] + "20",
      color: colors[type],
      fontSize: 13,
      fontWeight: 500
    }}>
      {text}
    </span>
  );
};

/* ---------- Main App ---------- */

function App() {
  const [data, setData] = useState(null);
  const [credit, setCredit] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [gst, setGst] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/analysis/financial-insights`).then(r => setData(r.data));
    axios.get(`${API_BASE}/analysis/creditworthiness`).then(r => setCredit(r.data));
    axios.get(`${API_BASE}/analysis/cashflow-forecast?months=6`).then(r => setForecast(r.data));
    axios.get(`${API_BASE}/analysis/gst-compliance`).then(r => setGst(r.data));
    axios.get(`${API_BASE}/analysis/industry-benchmark?industry=Retail`).then(r => setBenchmark(r.data));
    axios.get(`${API_BASE}/analysis/financial-products`)
      .then(r => setProducts(r.data?.recommended_products || []));
  }, []);

  if (!data) {
    return (
      <Page>
        <h2>Analyzing your business finances…</h2>
        <p>Please wait while AI evaluates your financial data.</p>
      </Page>
    );
  }

  return (
    <Page>

      {/* ---------- Header ---------- */}
      <div style={{
        background: "linear-gradient(135deg, #4f46e5, #6366f1)",
        padding: "28px 32px",
        borderRadius: 18,
        color: "#fff",
        marginBottom: 40
      }}>
        <h1 style={{ marginBottom: 6 }}>SME Financial Health Dashboard</h1>
        <p style={{ opacity: 0.9 }}>
          AI-powered clarity for cash flow, compliance & credit readiness
        </p>
      </div>

      {/* ---------- Financial Overview ---------- */}
      <Section
        title="📊 Financial Health Snapshot"
        subtitle="High-level view of business performance"
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20
        }}>
          <KPI label="Revenue" value={`₹${data.metrics?.revenue}`} />
          <KPI label="Expenses" value={`₹${data.metrics?.expenses}`} />
          <KPI label="Profit Margin" value={`${data.metrics?.profit_margin}%`} />
          <KPI label="Cash Balance" value={`₹${data.metrics?.cash_balance}`} />
          <KPI label="Runway" value={`${data.metrics?.runway_months} months`} />
        </div>

        <Badge
          text={`Overall Health Score: ${data.score}`}
          type={data.score > 70 ? "good" : data.score > 40 ? "warn" : "bad"}
        />
      </Section>

      {/* ---------- AI Insights ---------- */}
      <Section
        title="🤖 AI Executive Summary"
        subtitle="What the numbers actually mean"
      >
        <p style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
          {data.insights}
        </p>
      </Section>

      {/* ---------- Credit ---------- */}
      {credit && (
        <Section
          title="🏦 Credit Readiness"
          subtitle="Loan & funding eligibility assessment"
        >
          <div style={{ display: "grid", gap: 10 }}>
            <div>DSCR: <strong>{credit.dscr}</strong></div>
            <div>Avg Monthly Cash Flow: ₹{credit.average_monthly_cashflow}</div>
            <div>Total EMI: ₹{credit.total_monthly_emi}</div>
            <div>Status: <strong>{credit.lending_readiness}</strong></div>
            {credit.blockers?.length > 0 && (
              <div style={{ color: "#dc2626" }}>
                Blockers: {credit.blockers.join(", ")}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ---------- Forecast ---------- */}
      {forecast && (
        <Section
          title="📈 Cash Flow Forecast"
          subtitle="Projected balances over next 6 months"
        >
          <div style={{ marginBottom: 10 }}>
            Current Cash: ₹{forecast.current_cash_balance}
          </div>
          <div style={{ marginBottom: 10 }}>
            Avg Monthly Cash Flow: ₹{forecast.average_monthly_cashflow}
          </div>

          <ul>
            {Object.entries(forecast.forecast || {}).map(([m, f]) => (
              <li key={m}>{m}: ₹{f.expected_balance}</li>
            ))}
          </ul>

          {forecast.warnings?.length > 0 && (
            <p style={{ color: "#dc2626" }}>
              ⚠ {forecast.warnings.join(", ")}
            </p>
          )}
        </Section>
      )}

      {/* ---------- GST ---------- */}
      {gst && (
        <Section
          title="🧾 GST Compliance"
          subtitle="Tax exposure & filing risks"
        >
          <ul>
            <li>Total Output GST: ₹{gst.total_output_gst}</li>
            <li>Total Input GST: ₹{gst.total_input_gst}</li>
            <li>Net GST Payable: ₹{gst.net_gst_payable}</li>
            <li>Compliance Score: {gst.compliance_score}</li>
          </ul>
        </Section>
      )}

      {/* ---------- Products ---------- */}
      <Section
        title="💼 Recommended Financial Products"
        subtitle="AI-suggested funding & optimization options"
      >
        <ul>
          {products.map((p, i) => (
            <li key={i}>
              <strong>{p.product}</strong> — {p.reason}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- Report ---------- */}
      <Section title="📄 Download Report">
        <a
          href={`${API_BASE}/reports/download`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "12px 18px",
            background: "#4f46e5",
            color: "#fff",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 500
          }}
        >
          Download Investor-Ready PDF
        </a>
      </Section>

    </Page>
  );
}

export default App;
