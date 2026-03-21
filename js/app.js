import { mockDashboardData } from "./data.js";

const tbody = document.getElementById("table-body");
const searchInput = document.getElementById("search-input");
const filter = document.getElementById("status-filter");
const toggleBtn = document.getElementById("theme-toggle");

let revenueChart;

/* ================= TABLE ================= */
function renderTable(data) {
  const rows = data.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>$${user.revenue.toFixed(2)}</td>
      <td>
        <span class="status status-${user.status.toLowerCase()}">
          ${user.status}
        </span>
      </td>
      <td>${user.lastLogin}</td>
    </tr>
  `).join("");

  tbody.innerHTML = rows;
}

/* ================= SEARCH ================= */
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = mockDashboardData.filter(user =>
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );

    renderTable(filtered);
  });
}

/* ================= FILTER ================= */
if (filter) {
  filter.addEventListener("change", (e) => {
    const value = e.target.value.toLowerCase();

    if (value === "all") {
      renderTable(mockDashboardData);
    } else {
      const filtered = mockDashboardData.filter(user =>
        user.status.toLowerCase() === value
      );

      renderTable(filtered);
    }
  });
}

/* ================= THEME ================= */
(function initTheme() {
  const saved = localStorage.getItem("theme");

  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
})();

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

/* ================= CHART (OPTIMIZED) ================= */
function createChart() {
  const ctx = document.getElementById("revenueChart");
  if (!ctx) return;

  // 🔥 PERFORMANCE FIX: only top 5 users
  const topData = [...mockDashboardData]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const labels = topData.map(u => u.name);
  const values = topData.map(u => u.revenue);

  revenueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Revenue",
        data: values,
        backgroundColor: "#3b82f6"
      }]
    },
    options: {
      maintainAspectRatio: false
    }
  });
}

/* ================= INIT ================= */
renderTable(mockDashboardData);

// 🔥 PERFORMANCE BOOST: load chart after page load
requestIdleCallback(() => {
  createChart();
});
