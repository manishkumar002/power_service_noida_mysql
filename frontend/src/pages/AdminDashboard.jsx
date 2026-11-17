import { useEffect, useMemo, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FiGrid,
  FiBox,
  FiMessageSquare,
  FiBell,
  FiArrowUpRight,
  FiTrendingUp,
} from "react-icons/fi";
import { getAdminDashboard, getErrorMessage } from "../api/services";

// Har card/graph ka apna color theme, icon aur chart-type
const CARD_CONFIG = [
  {
    key: "totalCategories",
    label: "Categories",
    to: "/admin/categories",
    icon: FiGrid,
    color: "#6366f1", // indigo
    chartType: "area",
  },
  {
    key: "totalProducts",
    label: "Products",
    to: "/admin/products",
    icon: FiBox,
    color: "#0ea5e9", // sky
    chartType: "bar",
  },
  {
    key: "totalEnquiries",
    label: "Total Enquiries",
    to: "/admin/enquiries",
    icon: FiMessageSquare,
    color: "#22c55e", // green
    chartType: "area",
  },
  {
    key: "newEnquiries",
    label: "New Enquiries",
    to: "/admin/enquiries",
    icon: FiBell,
    color: "#f59e0b", // amber
    chartType: "bar",
  },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Real backend trend data nikalta hai stats response se.
 * Ye in shapes ko support karta hai (jo bhi backend bheje):
 *   stats.trends.totalProducts = [{ day: "Mon", value: 12 }, ...]
 *   stats.trends.totalProducts = [12, 18, 9, 20, 14, 22, 17]   // plain numbers
 *   stats.totalProductsTrend   = [...]                          // key + "Trend"
 *
 * Agar backend mein aisa koi history field nahi mila, to null return
 * karta hai — is case mein hum random fake data NAHI banate, balki
 * neeche ek flat (stable) line dikhate hain jo actual current value
 * ko represent karti hai, jab tak real history API na jud jaaye.
 */
const getRealTrend = (stats, key) => {
  const raw = stats?.trends?.[key] ?? stats?.[`${key}Trend`] ?? null;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  return raw.map((item, i) => {
    if (typeof item === "number") {
      return { day: DAY_LABELS[i] ?? `D${i + 1}`, v: item };
    }
    return {
      day: item.day ?? item.label ?? DAY_LABELS[i] ?? `D${i + 1}`,
      v: item.value ?? item.count ?? item.v ?? 0,
    };
  });
};

// Fallback jab backend history nahi deta: current value ki ek flat/stable
// line, taaki graph "fake random" na dikhaye jab tak real trend data na aaye.
const buildFallbackTrend = (value = 0) =>
  DAY_LABELS.map((d) => ({ day: d, v: value }));

const SkeletonBlock = ({ h = 16, w = "100%" }) => (
  <div className="skeleton-line" style={{ height: h, width: w }} />
);

const StatCard = ({ config, value, loading }) => {
  const Icon = config.icon;

  // Real trend data se % change nikalta hai (first vs last day).
  // Agar backend se real history nahi aayi, badge hide ho jaata hai
  // (fake number dikhane ke bajaye).
  const trend = config.trend ?? [];
  const first = trend[0]?.v ?? 0;
  const last = trend[trend.length - 1]?.v ?? 0;
  const changePct = first > 0 ? Math.round(((last - first) / first) * 100) : 0;
  const showChange = config.isRealTrend && trend.length > 1;
  const isPositive = changePct >= 0;

  return (
    <Col sm={6} lg={3}>
      <Card
        as={Link}
        to={config.to}
        className="sh-card admin-stat-card text-decoration-none"
        style={{ "--accent": config.color }}
      >
        <Card.Body>
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div
              className="admin-stat-icon"
              style={{ background: `${config.color}1a`, color: config.color }}
            >
              <Icon size={20} />
            </div>
            <span className="admin-stat-arrow">
              <FiArrowUpRight size={16} />
            </span>
          </div>

          <div className="text-muted small admin-stat-label">
            {config.label}
          </div>

          {loading ? (
            <>
              <SkeletonBlock h={30} w="50%" />
              <div className="mt-2">
                <SkeletonBlock h={12} w="35%" />
              </div>
            </>
          ) : (
            <>
              <div className="admin-stat-value" style={{ color: config.color }}>
                {value}
              </div>
              {showChange && (
                <div
                  className={`admin-stat-change ${
                    isPositive ? "is-up" : "is-down"
                  }`}
                >
                  <FiTrendingUp
                    size={13}
                    style={{
                      transform: isPositive ? "none" : "rotate(180deg)",
                    }}
                  />
                  <span>
                    {isPositive ? "+" : ""}
                    {changePct}% this week
                  </span>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

const TrendCard = ({ config, data, loading }) => (
  <Col md={6} xl={3}>
    <Card className="sh-card trend-card">
      <Card.Body>
        <div className="d-flex align-items-center mb-1">
          <span className="trend-dot" style={{ background: config.color }} />
          <span className="trend-title flex-grow-1 ms-2">{config.label}</span>
        </div>

        {loading ? (
          <SkeletonBlock h={140} />
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            {config.chartType === "area" ? (
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id={`grad-${config.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={config.color}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor={config.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eef1f6"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #eef1f6",
                    fontSize: 12,
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={config.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${config.key})`}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eef1f6"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #eef1f6",
                    fontSize: 12,
                  }}
                  labelStyle={{ fontWeight: 600 }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} fill={config.color} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  </Col>
);

const OverviewChart = ({ cards, loading }) => {
  const data = DAY_LABELS.map((day, i) => {
    const row = { day };
    cards.forEach((c) => {
      row[c.key] = c.trend[i]?.v ?? 0;
    });
    return row;
  });

  return (
    <Card className="sh-card overview-card">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h2 className="section-title mb-0">Weekly Overview</h2>
          <div className="d-flex gap-3 flex-wrap">
            {CARD_CONFIG.map((c) => (
              <span key={c.key} className="legend-item">
                <span className="trend-dot" style={{ background: c.color }} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <SkeletonBlock h={260} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
            >
              <defs>
                {CARD_CONFIG.map((c) => (
                  <linearGradient
                    key={c.key}
                    id={`ov-grad-${c.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={c.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={c.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eef1f6"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #eef1f6",
                  fontSize: 12,
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              {CARD_CONFIG.map((c) => (
                <Area
                  key={c.key}
                  type="monotone"
                  dataKey={c.key}
                  name={c.label}
                  stroke={c.color}
                  strokeWidth={2.5}
                  fill={`url(#ov-grad-${c.key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => setStats(data.data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Sirf tab recompute hota hai jab `stats` badalta hai — random flicker nahi.
  const cardsWithTrend = useMemo(
    () =>
      CARD_CONFIG.map((c) => {
        const value = stats?.[c.key] ?? 0;
        const realTrend = getRealTrend(stats, c.key);
        return {
          ...c,
          value,
          trend: realTrend ?? buildFallbackTrend(value),
          isRealTrend: Boolean(realTrend),
        };
      }),
    [stats],
  );

  return (
    <>
      <style>{DASHBOARD_STYLES}</style>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="page-title mb-1">Dashboard</h1>
          <p className="page-subtitle mb-0">
            Overview of your store's key metrics
          </p>
        </div>
      </div>

      {/* Stat cards (no chart here) */}
      <Row className="g-3 mb-4">
        {cardsWithTrend.map((c) => (
          <StatCard key={c.key} config={c} value={c.value} loading={loading} />
        ))}
      </Row>

      {/* Combined weekly overview graph, niche full-width */}
      <div className="mb-4">
        <OverviewChart cards={cardsWithTrend} loading={loading} />
      </div>

      {/* Individual trend graphs, stat cards ke niche alag section mein */}
      <h2 className="section-title mb-3">Metric Trends</h2>
      <Row className="g-3">
        {cardsWithTrend.map((c) => (
          <TrendCard key={c.key} config={c} data={c.trend} loading={loading} />
        ))}
      </Row>
    </>
  );
};

const DASHBOARD_STYLES = `
  .page-title {
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    color: #94a3b8;
    font-size: 0.92rem;
  }

  .section-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1e293b;
  }

  /* ---- Stat cards ---- */
  .admin-stat-card {
    position: relative;
    border: 1px solid rgba(15, 23, 42, 0.06);
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    height: 100%;
  }

  .admin-stat-card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: var(--accent, #6366f1);
    opacity: 0.9;
  }

  .admin-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.18);
    border-color: rgba(15, 23, 42, 0.1);
  }

  .admin-stat-card:hover .admin-stat-arrow {
    opacity: 1;
    transform: translate(2px, -2px);
  }

  .admin-stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-stat-arrow {
    color: #94a3b8;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .admin-stat-label {
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 0.72rem;
  }

  .admin-stat-value {
    font-size: 2.1rem;
    font-weight: 800;
    line-height: 1.1;
    margin-top: 4px;
    margin-bottom: 6px;
  }

  .admin-stat-change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 999px;
  }

  .admin-stat-change.is-up {
    color: #16a34a;
    background: #16a34a14;
  }

  .admin-stat-change.is-down {
    color: #dc2626;
    background: #dc262614;
  }

  /* ---- Overview + trend cards ---- */
  .overview-card,
  .trend-card {
    border: 1px solid rgba(15, 23, 42, 0.06);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    height: 100%;
  }

  .trend-title {
    font-weight: 600;
    font-size: 0.88rem;
    color: #334155;
  }

  .trend-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 500;
  }

  /* ---- Skeleton loading ---- */
  .skeleton-line {
    background: linear-gradient(90deg, #eef1f6 25%, #e2e6ee 37%, #eef1f6 63%);
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease infinite;
    border-radius: 8px;
  }

  @keyframes skeleton-shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
`;

export default AdminDashboard;
