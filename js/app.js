import { mockDashboardData } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // TABLE LOGIC
  // =========================
  const tbody = document.getElementById("table-body");
  const searchInput = document.getElementById("search-input");

  function renderTable(data) {
    const rows = data.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>$${user.revenue.toLocaleString()}</td>
        <td>
          <span class="status ${user.status.toLowerCase()}">
            ${user.status}
          </span>
        </td>
        <td>${user.lastLogin}</td>
      </tr>
    `).join("");

    tbody.innerHTML = rows;
  }

  // initial load
  renderTable(mockDashboardData);


  // =========================
  // LIVE SEARCH 🔍
  // =========================
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();

      const filtered = mockDashboardData.filter(user =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.status.toLowerCase().includes(value)
      );

      renderTable(filtered);
    });
  }


  // =========================
  // MENU TOGGLE (SAFE ✅)
  // =========================
  const menuBtn = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.getElementById("close-menu");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }


  // =========================
  // CHART.JS
  // =========================
  const ctx = document.getElementById("revenueChart");

  if (ctx) {
    const topUsers = [...mockDashboardData]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const labels = topUsers.map(u => u.name);
    const data = topUsers.map(u => u.revenue);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Revenue", // ✅ fix (no undefined)
          data: data,
          backgroundColor: "#3b82f6",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

});

// ===== THEME (Dark Mode + localStorage) =====

const toggleBtn = document.getElementById("theme-toggle");

// Page load pe theme set karo
(function initTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
})();

// Toggle button click
toggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  updateChartTheme(); // chart fix
});


// ===== FILTER (Data State) =====

const filter = document.getElementById("status-filter");

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


// ===== CHART THEME FIX =====

function updateChartTheme() {
  if (!revenueChart) return;

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-primary");

  revenueChart.options.scales.x.ticks.color = textColor;
  revenueChart.options.scales.y.ticks.color = textColor;

  revenueChart.update();
}