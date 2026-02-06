import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://sme-financial-platform-1.onrender.com";

const Card = ({ title, children }) => (
  <div style={{
    background: "#ffffff",
    padding: 20,
    marginBottom: 24,
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
  }}>
    <h2 style={{ marginBottom: 12 }}>{title}</h2>
    {children}
  </div>
);

function App() {
  const [data, setData] = useState(null);
  const [credit, setCredit] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [gst, setGst] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/analysis/financial-insights`)
      .then(res => setData(res.data));
    axios.get(`${API_BASE}/analysis/creditworthiness`)
      .then(res => setCredit(res.data));
    axios.get(`${API_BASE}/analysis/cashflow-forecast?months=6`)
      .then(res => setForecast(res.data));
    axios.get(`${API_BASE}/analysis/gst-compliance`)
      .then(res => setGst(res.data));
    axios.get(`${API_BASE}/analysis/industry-benchmark?industry=Retail`)
      .then(res => setBenchmark(res.data));
    axios.get(`${API_BASE}/analysis/financial-products`)
      .then(res => setProducts(res.data?.recommended_products || []));
  }, []);

  if (!data) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <h2>Loading Financial Dashboard…</h2>
        <p>Please wait while we analyze your business data.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: "#f5f7fb",
      minHeight: "100vh",
      padding: 40,
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <h1 style={{ marginBottom: 8 }}>SME Financial Health Dashboard</h1>
      <p style={{ color: "#555", marginBottom: 30 }}>
        AI-powered insights to understand your business finances clearly.
      </p>

      <Card title="📊 Financial Health Overview">
        <h3>Overall Score: {data.score}</h3>
        <ul>
          <li>Revenue: ₹{data.metrics?.revenue}</li>
          <li>Expenses: ₹{data.metrics?.expenses}</li>
          <li>Profit Margin: {data.metrics?.profit_margin}%</li>
          <li>Cash Balance: ₹{data.metrics?.cash_balance}</li>
          <li>Runway: {data.metrics?.runway_months} months</li>
        </ul>
      </Card>

      <Card title="🤖 AI Financial Insights">
        <p style={{ whiteSpace: "pre-line" }}>{data.insights}</p>
      </Card>

      {credit && (
        <Card title="🏦 Credit Readiness">
          <ul>
            <li>DSCR: {credit.dscr}</li>
            <li>Average Monthly Cash Flow: ₹{credit.average_monthly_cashflow}</li>
            <li>Total Monthly EMI: ₹{credit.total_monthly_emi}</li>
            <li>Status: {credit.lending_readiness}</li>
            {credit.blockers?.length > 0 && (
              <li style={{ color: "red" }}>
                Blockers: {credit.blockers.join(", ")}
              </li>
            )}
          </ul>
        </Card>
      )}

      {forecast && (
        <Card title="📈 Cash Flow Forecast (6 Months)">
          <p>Current Cash Balance: ₹{forecast.current_cash_balance}</p>
          <p>Avg Monthly Cash Flow: ₹{forecast.average_monthly_cashflow}</p>

          {forecast.warnings?.length > 0 && (
            <p style={{ color: "red" }}>
              Warnings: {forecast.warnings.join(", ")}
            </p>
          )}

          <ul>
            {Object.entries(forecast.forecast || {}).map(([month, f]) => (
              <li key={month}>{month}: ₹{f.expected_balance}</li>
            ))}
          </ul>
        </Card>
      )}

      {gst && (
        <Card title="🧾 GST Compliance">
          <ul>
            <li>Total Output GST: ₹{gst.total_output_gst}</li>
            <li>Total Input GST: ₹{gst.total_input_gst}</li>
            <li>Net GST Payable: ₹{gst.net_gst_payable}</li>
            <li>Compliance Score: {gst.compliance_score}</li>
            {gst.unfiled_periods?.length > 0 && (
              <li style={{ color: "red" }}>
                Unfiled Periods: {gst.unfiled_periods.join(", ")}
              </li>
            )}
          </ul>
        </Card>
      )}

      {benchmark && (
        <Card title="🏭 Industry Benchmarking">
          <p><strong>Industry:</strong> {benchmark.industry}</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Your Business</th>
                <th>Industry Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gross Margin</td>
                <td>{benchmark.your_kpis?.gross_margin}</td>
                <td>{benchmark.industry_average?.gross_margin}</td>
              </tr>
              <tr>
                <td>Net Margin</td>
                <td>{benchmark.your_kpis?.net_margin}</td>
                <td>{benchmark.industry_average?.net_margin}</td>
              </tr>
              <tr>
                <td>DSCR</td>
                <td>{benchmark.your_kpis?.dscr}</td>
                <td>{benchmark.industry_average?.dscr}</td>
              </tr>
            </tbody>
          </table>

          <ul>
            {(benchmark.insights || []).map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="💼 Recommended Financial Products">
        <ul>
          {products.map((p, idx) => (
            <li key={idx}>
              <strong>{p.product}</strong> — {p.reason}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="📄 Financial Report">
        <a
          href={`${API_BASE}/reports/download`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: "#4f46e5",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none"
          }}
        >
          Download Investor-Ready PDF Report
        </a>
      </Card>
    </div>
  );
}

export default App;
