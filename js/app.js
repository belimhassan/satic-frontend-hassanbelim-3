import { mockDashboardData } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {

  const tbody = document.getElementById("table-body");

  function renderTable(data){

    tbody.innerHTML = "";

    const rows = data.map(user => {
  return `
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
      <td>${user.lastLogin}</td> <!-- ADD -->
    </tr>
  `;
}).join("");

    tbody.innerHTML = rows;
  }

  renderTable(mockDashboardData);

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