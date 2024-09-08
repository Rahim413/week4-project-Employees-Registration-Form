const searchForInfo = document.getElementById('search-result');

// form submission to add a new employee
const form = document.getElementById('employee-form');
form.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = {
    FirstName: document.getElementById('first-name').value,
    LastName: document.getElementById('last-name').value,
    Email: document.getElementById('email').value,
    PhoneNumber: document.getElementById('phone').value,
    JobTitle: document.getElementById('job-title').value,
    Salary: document.getElementById('salary').value,
    DateOfBirth: document.getElementById('dob').value,
    StartDate: document.getElementById('start-date').value,
    Gender: document.querySelector('input[name="gender"]:checked').value
  };

  try {
    const response = await fetch('https://week4-project-buildfullstackguestbook.onrender.com/employees_registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      form.reset();
      searchForInfo.innerHTML = '<p>Employee added successfully. Search for details to view the updated list.</p>';
    } else if (response.status === 400) {
      const errorData = await response.json();
      searchForInfo.innerHTML = `<p style="color: red;">${errorData.message}</p>`;
    } else {
      alert('Failed to add employee');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred');
  }
});

// Search for employee by last name
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', async () => {
  const lastName = document.getElementById('search').value;
  const response = await fetch(`https://week4-project-buildfullstackguestbook.onrender.com/employees_registration/search?lastname=${lastName}`);

  if (response.ok) {
    const data = await response.json();
    searchForInfo.innerHTML = `
      <h3>Employee Details:</h3>
      <p>Employee Name: ${data.firstname} ${data.lastname}</p>
      <p>Job Title: ${data.jobtitle}</p>
      <p>Salary: £${data.salary}</p>
      <p>Email: ${data.email}</p>
      <p>Phone Number: ${data.phonenumber}</p>
      <p>Date of Birth: ${data.dateofbirth}</p>
      <p>Start Date: ${data.startdate}</p>
      <p>Gender: ${data.gender}</p>`;
  } else {
    searchForInfo.innerHTML = '<p>Employee not found</p>';
  }
});
