import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';
import { getTicketsByStatus, getTicketsByCategory, getTicketsByPriority, getTicketsTrend, getAvgRating } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title);

const CHART_COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#f05252', '#00d4aa', '#a855f7'];

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#e8eaf0', font: { family: 'DM Sans' } } } },
  scales: {
    x: { ticks: { color: '#7c859e' }, grid: { color: '#252a3a' } },
    y: { ticks: { color: '#7c859e' }, grid: { color: '#252a3a' } },
  },
};

const doughnutOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom', labels: { color: '#e8eaf0', font: { family: 'DM Sans' } } } },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminAnalytics() {
  const [statusData, setStatusData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTicketsByStatus(),
      getTicketsByCategory(),
      getTicketsByPriority(),
      getTicketsTrend(),
      getAvgRating(),
    ])
      .then(([s, c, p, t, r]) => {
        setStatusData(s.data);
        setCategoryData(c.data);
        setPriorityData(p.data);
        setTrendData(t.data);
        setRating(r.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toChartData = (arr) => ({
    labels: arr.map((d) => d._id),
    datasets: [{ data: arr.map((d) => d.count), backgroundColor: CHART_COLORS, borderWidth: 0 }],
  });

  const toBarData = (arr, label) => ({
    labels: arr.map((d) => d._id),
    datasets: [{
      label,
      data: arr.map((d) => d.count),
      backgroundColor: CHART_COLORS[0],
      borderRadius: 6,
    }],
  });

  const toTrendData = (arr) => ({
    labels: arr.map((d) => `${MONTHS[d._id.month - 1]} ${d._id.year}`),
    datasets: [{
      label: 'Tickets Created',
      data: arr.map((d) => d.count),
      borderColor: '#4f6ef7',
      backgroundColor: 'rgba(79,110,247,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4f6ef7',
    }],
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">Analytics</div>
            <div className="page-subtitle">Ticket trends and performance insights</div>
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Summary row */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
              <div className="stat-card blue">
                <div className="stat-num">{statusData?.reduce((a, d) => a + d.count, 0) || 0}</div>
                <div className="stat-label">Total Tickets</div>
              </div>
              <div className="stat-card green">
                <div className="stat-num">{rating?.avgRating ? rating.avgRating.toFixed(1) : '—'}</div>
                <div className="stat-label">Avg Rating ⭐</div>
              </div>
              <div className="stat-card teal">
                <div className="stat-num">{rating?.total || 0}</div>
                <div className="stat-label">Feedback Received</div>
              </div>
            </div>

            <div className="charts-grid">
              {/* Status Doughnut */}
              <div className="chart-card">
                <div className="chart-title">Tickets by Status</div>
                {statusData?.length ? <Doughnut data={toChartData(statusData)} options={doughnutOptions} /> : <p className="text-muted">No data</p>}
              </div>

              {/* Priority Doughnut */}
              <div className="chart-card">
                <div className="chart-title">Tickets by Priority</div>
                {priorityData?.length ? <Doughnut data={toChartData(priorityData)} options={doughnutOptions} /> : <p className="text-muted">No data</p>}
              </div>

              {/* Category Bar */}
              <div className="chart-card">
                <div className="chart-title">Tickets by Category</div>
                {categoryData?.length
                  ? <Bar data={toBarData(categoryData, 'Tickets')} options={chartOptions} />
                  : <p className="text-muted">No data</p>}
              </div>

              {/* Monthly Trend Line */}
              <div className="chart-card">
                <div className="chart-title">Monthly Ticket Trend</div>
                {trendData?.length
                  ? <Line data={toTrendData(trendData)} options={{ ...chartOptions, scales: { x: chartOptions.scales.x, y: { ...chartOptions.scales.y, beginAtZero: true } } }} />
                  : <p className="text-muted">No trend data yet</p>}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
