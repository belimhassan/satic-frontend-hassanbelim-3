import { mockDashboardData } from "./data.js";

window.onload = () => {

  const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

/* TOGGLE OPEN/CLOSE */
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

/* CLICK OUTSIDE = CLOSE */
document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("active") &&
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    sidebar.classList.remove("active");
  }
});
  const tbody = document.getElementById("table-body");
  const searchInput = document.getElementById("search-input");
  const filter = document.getElementById("status-filter");
  const toggleBtn = document.getElementById("theme-toggle");

  /* ================= TABLE ================= */
  function renderTable(data) {
    if (!tbody) return;

    tbody.innerHTML = data.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>$${user.revenue.toFixed(2)}</td>
        <td class="status status-${user.status.toLowerCase()}">${user.status}</td>
        <td>${user.lastLogin}</td>
      </tr>
    `).join("");
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

  /* ================= THEME TOGGLE ================= */

  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateIcon();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateIcon();
  }

  function updateIcon() {
    if (!toggleBtn) return;

    const theme = document.documentElement.getAttribute("data-theme");
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

  initTheme();

  /* ================= CHARTS ================= */
  function createCharts() {
    const labels = mockDashboardData.map(u => u.name);
    const values = mockDashboardData.map(u => u.revenue);

    const barCanvas = document.getElementById("barChart");
    if (barCanvas) {
      new Chart(barCanvas, {
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
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    const lineCanvas = document.getElementById("lineChart");
    if (lineCanvas) {
      new Chart(lineCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Growth",
            data: values,
            borderColor: "#22c55e",
            fill: false,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  /* ================= INIT ================= */
  renderTable(mockDashboardData);
  createCharts();

};