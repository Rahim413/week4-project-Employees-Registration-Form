
const employeesContainer = document.getElementById("employees");
const searchForInfo = document.getElementById("search-result");

// Fetch and display all employees
async function getEmployeesInfo() {
  const response = await fetch("https://week4-project-buildfullstackguestbook-29zk.onrender.com/employees_info");
  if (response.ok) {
    const data = await response.json();
    employeesContainer.innerHTML = "";
    data.forEach(employee => {
      const p = document.createElement("p");
      p.textContent = `Employee: ${employee.name}, Job Title: ${employee.job_title}, Salary: £${employee.salary}`;
      employeesContainer.appendChild(p);
    });
  } else {
    employeesContainer.innerHTML = "<p>Error loading employees</p>";
  }
}

// Handle form submission to add new employee
const form = document.getElementById("employee-form");
form.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const response = await fetch("https://week4-project-buildfullstackguestbook-29zk.onrender.com/employees_info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    form.reset();
    getEmployeesInfo();
  } else {
    alert("Failed to add employee");
  }
});

// Search for employee by ID
const searchById = document.getElementById("search-button");
searchById.addEventListener("click", async () => {
  const employeeId = document.getElementById("employee-id").value;
  const response = await fetch(`https://week4-project-buildfullstackguestbook-29zk.onrender.com/employees_info/${employeeId}`);
  
  if (response.ok) {
    const data = await response.json();
    searchForInfo.innerHTML = `
      <p>Employee Name: ${data.name}</p>
      <p>Job Title: ${data.job_title}</p>
      <p>Salary: £${data.salary}</p>`;
  } else {
    searchForInfo.innerHTML = "<p>Employee not found</p>";
  }
});

getEmployeesInfo();
