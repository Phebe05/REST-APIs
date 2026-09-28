async function loadStudents() {

    const response = await fetch(
        "http://localhost:5000/students"
    );

    const students = await response.json();

    const list = document.getElementById("studentList");

    list.innerHTML = ""; // Clears old list items before rendering

    students.forEach(student => {

        const item = document.createElement("li");

        item.textContent =
            `${student.name} - ${student.age}`;

        list.appendChild(item);
    });
}


async function addStudent() {

    const name =
        document.getElementById("name").value;

    const age =
        document.getElementById("age").value;

    const response = await fetch(
        "http://localhost:5000/students",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                age: Number(age)
            })
        }
    );

    const student = await response.json();

    console.log(student);

    loadStudents();
}