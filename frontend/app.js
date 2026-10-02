const API_URL = "http://localhost:5000";

//login
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      message.textContent = data.error;
      return;
    }

    //when login is successful...

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    loadStudents();
  } catch (error) {
    console.error(error);
    message.textContent = "Could not connect to the server";
  }
});

//load the students

async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/students`, {
      credentials: "include",
    });

    const students = await response.json();
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach((student) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <span class="student-info">
          ${student.name} <span class="student-age">(${student.age} yrs old)</span>
        </span>
        <button class="btn-delete" onclick="deleteStudent(${student.id})">
          Delete
        </button>
      `;
      list.appendChild(item);
    });
  } catch (error) {
    console.error(error);
  }
}

//add a student
const studentForm = document.getElementById("studentForm");
studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("studentName").value;
  const age = document.getElementById("studentAge").value;
  const message = document.getElementById("studentMessage");

  try {
    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        age: Number(age),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      message.textContent = data.error;
      return;
    }

    message.textContent = "Student added successfully!";

    studentForm.reset();

    loadStudents();
  } catch (error) {
    console.error(error);
  }
});

//deleting a student - the fxn
async function deleteStudent(id) {
  try {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.error);

      return;
    }
    loadStudents();
  } catch (error) {
    console.error(error);
  }
}

//logging out
document.getElementById("logoutButton").addEventListener("click", async () => {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  document.getElementById("dashboard").style.display = "none";

  document.getElementById("loginPage").style.display = "block";
});
