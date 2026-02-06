import { useEffect, useState } from "react";
import axios from "axios";

/**
 * API base URL logic:
 * - Local run → http://127.0.0.1:8000
 * - Deployed (Vercel) → VITE_API_BASE_URL
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function App() {
  const [data, setData] = useState(null);
  const [credit, setCredit] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [gst, setGst] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/analysis/financial-insights`)
      .then(res => setData(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/analysis/creditworthiness`)
      .then(res => setCredit(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/analysis/cashflow-forecast?months=6`)
      .then(res => setForecast(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/analysis/gst-compliance`)
      .then(res => setGst(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/analysis/industry-benchmark?industry=Retail`)
      .then(res => setBenchmark(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/analysis/financial-products`)
      .then(res => setProducts(res.data.recommended_products));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>SME Financial Health</h1>
      <h2>Score: {data.score}</h2>

      <h3>Key Metrics</h3>
      <ul>
        <li>Revenue: ₹{data.metrics.revenue}</li>
        <li>Expenses: ₹{data.metrics.expenses}</li>
        <li>Profit Margin: {data.metrics.profit_margin}%</li>
        <li>Cash Balance: ₹{data.metrics.cash_balance}</li>
        <li>Runway: {data.metrics.runway_months} months</li>
      </ul>

      <h3>AI Insights</h3>
      <p style={{ whiteSpace: "pre-line" }}>{data.insights}</p>

      <h3>Credit Readiness</h3>
      {credit && (
        <ul>
          <li>DSCR: {credit.dscr}</li>
          <li>Avg Monthly Cash Flow: ₹{credit.average_monthly_cashflow}</li>
          <li>Monthly EMI: ₹{credit.total_monthly_emi}</li>
          <li>Status: {credit.lending_readiness}</li>
          {credit.blockers.length > 0 && (
            <li>Blockers: {credit.blockers.join(", ")}</li>
          )}
        </ul>
      )}

      <h3>Cash Flow Forecast</h3>
      {forecast && (
        <>
          <p>Current Cash Balance: ₹{forecast.current_cash_balance}</p>
          <p>Avg Monthly Cash Flow: ₹{forecast.average_monthly_cashflow}</p>

          {forecast.runway_months && (
            <p>Estimated Runway: {forecast.runway_months} months</p>
          )}

          {forecast.warnings.length > 0 && (
            <p style={{ color: "red" }}>
              Warnings: {forecast.warnings.join(", ")}
            </p>
          )}

          <ul>
            {Object.entries(forecast.forecast).map(([month, data]) => (
              <li key={month}>
                {month}: ₹{data.expected_balance}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>GST Compliance</h3>
      {gst && (
        <ul>
          <li>Total Output GST: ₹{gst.total_output_gst}</li>
          <li>Total Input GST: ₹{gst.total_input_gst}</li>
          <li>Net GST Payable: ₹{gst.net_gst_payable}</li>
          <li>Compliance Score: {gst.compliance_score}</li>

          {gst.unfiled_periods.length > 0 && (
            <li style={{ color: "red" }}>
              Unfiled Periods: {gst.unfiled_periods.join(", ")}
            </li>
          )}

          {gst.warnings.length > 0 && (
            <li>Warnings: {gst.warnings.join("; ")}</li>
          )}
        </ul>
      )}

      <h3>Industry Benchmark Comparison</h3>
      {benchmark && (
        <>
          <p><strong>Industry:</strong> {benchmark.industry}</p>

          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Your Business</th>
                <th>Industry Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gross Margin (%)</td>
                <td>{benchmark.your_kpis.gross_margin}</td>
                <td>{benchmark.industry_average.gross_margin}</td>
              </tr>
              <tr>
                <td>Net Margin (%)</td>
                <td>{benchmark.your_kpis.net_margin}</td>
                <td>{benchmark.industry_average.net_margin}</td>
              </tr>
              <tr>
                <td>DSCR</td>
                <td>{benchmark.your_kpis.dscr}</td>
                <td>{benchmark.industry_average.dscr}</td>
              </tr>
            </tbody>
          </table>

          <ul>
            {benchmark.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </>
      )}

      <h3>Recommended Financial Products</h3>
      <ul>
        {products.map((p, idx) => (
          <li key={idx}>
            <strong>{p.product}</strong>: {p.reason}
          </li>
        ))}
      </ul>

      <a
        href={`${API_BASE_URL}/reports/download`}
        target="_blank"
        rel="noreferrer"
      >
        Download Financial Report (PDF)
      </a>
    </div>
  );
}

export default App;
