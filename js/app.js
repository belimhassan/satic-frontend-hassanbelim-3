import { mockDashboardData } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {

  // ✅ TABLE
  const tbody = document.getElementById("table-body");

  function renderTable(data){
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

  renderTable(mockDashboardData);

  // ✅ MENU
  const menuBtn = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.getElementById("close-menu");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // ✅ CHART
  const topUsers = [...mockDashboardData]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const labels = topUsers.map(u => u.name);
  const data = topUsers.map(u => u.revenue);

  const ctx = document.getElementById("revenueChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: "#3b82f6",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

});
console.log("App is working 🚀");
console.log(mockDashboardData);

const menuBtn = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

const closeBtn = document.getElementById("close-menu");

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

