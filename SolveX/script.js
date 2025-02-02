function goHome() {
    window.location.reload();
}
function toggleExperiments() {
    const dropdown = document.getElementById('experimentDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function subjectSelected(subject) {
    alert("You selected: " + subject);
}

function showContact() {
    alert("Contact Us: \nEmail: contact@example.com\nPhone: (123) 456-7890");
}

function toggleExperiments() {
    const dropdown = document.getElementById('experimentDropdown');
    dropdown.style.display = dropdown.style.display === "none" || dropdown.style.display === "" ? "block" : "none";
}

function searchExperiments() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const experimentList = document.getElementById('experimentList');
    const experiments = experimentList.getElementsByTagName('li');

    if (searchInput) {
        experimentList.style.display = ""; // Show the list
        let found = false; // Flag to check if any experiment matches
        for (let i = 0; i < experiments.length; i++) {
            const experiment = experiments[i].textContent.toLowerCase();
            if (experiment.includes(searchInput)) {
                experiments[i].style.display = ""; // Show experiment
                found = true; // At least one match found
            } else {
                experiments[i].style.display = "none"; // Hide experiment
            }
        }
        if (!found) {
            experimentList.style.display = "none"; // Hide the list if no matches
        }
    } else {
        experimentList.style.display = "none"; // Hide the list if search input is empty
    }
}
function generateAreaInputs() {
    const numAreas = parseInt(document.getElementById('numAreas').value);
    if (isNaN(numAreas) || numAreas <= 0) {
        alert("Invalid number of areas. Please enter a positive integer.");
        return;
    }

    const areaInputsDiv = document.getElementById('areaInputs');
    areaInputsDiv.innerHTML = ''; // Clear previous inputs

    for (let i = 0; i < numAreas; i++) {
        areaInputsDiv.innerHTML += `
            <label for="area${i + 1}">Area of Cross-Section ${i + 1} in m²:</label>
            <input type="number" id="area${i + 1}" name="area${i + 1}" required>
            <br>
            <label for="potentialHead${i + 1}">Potential Head at Area ${i + 1} in meters:</label>
            <input type="number" id="potentialHead${i + 1}" name="potentialHead${i + 1}" required>
            <br>
            <label for="pressureHead${i + 1}">Pressure Head at Area ${i + 1} in meters:</label>
            <input type="number" id="pressureHead${i + 1}" name="pressureHead${i + 1}" required>
            <br><br>
        `;
    }
}
function calculate() {
    try {
        const numAreas = parseInt(document.getElementById('numAreas').value);
        const finalRise = getValidInput(parseFloat(document.getElementById('finalRise').value), "Final Rise");
        const initialRise = getValidInput(parseFloat(document.getElementById('initialRise').value), "Initial Rise");
        const width = getValidInput(parseFloat(document.getElementById('width').value), "Width");
        const length = getValidInput(parseFloat(document.getElementById('length').value), "Length");
        const time = getValidInput(parseFloat(document.getElementById('time').value), "Time");

        // Calculate total rise and volume of discharged fluid (V)
        const totalRise = finalRise - initialRise; // Total rise in meters
        if (totalRise <= 0) {
            throw new Error("Total rise must be greater than zero.");
        }
        const volume = totalRise * width * length; // Volume = Rise * Width * Length

        // Calculate actual discharge (Q)
        const Q = volume / time; // Q = V / t

        // Clear previous results
        const resultBody = document.getElementById('resultBody');
        resultBody.innerHTML = '';

        // Calculate for each area
        for (let i = 0; i < numAreas; i++) {
            const area = getValidInput(parseFloat(document.getElementById(`area${i + 1}`).value), `Area ${i + 1}`);
            const potentialHead = getValidInput(parseFloat(document.getElementById(`potentialHead${i + 1}`).value), `Potential Head ${i + 1}`);
            const pressureHead = getValidInput(parseFloat(document.getElementById(`pressureHead${i + 1}`).value), `Pressure Head ${i + 1}`);

            // Calculate velocity (V) at this area
            const velocity = Q / area; // V = Q / A

            // Calculate kinetic head (Kinetic Head = V² / (2g))
            const g = 9.81; // Acceleration due to gravity in m/s²
            const kineticHead = Math.pow(velocity, 2) / (2 * g);

            // Calculate total head
            const totalHead = kineticHead + potentialHead + pressureHead;

            // Create a new row for the results table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${area.toFixed(5)}</td>
                <td>${velocity.toFixed(5)}</td>
                <td>${kineticHead.toFixed(5)}</td>
                <td>${totalHead.toFixed(5)}</td>
            `;
            resultBody.appendChild(row);
        }
    } catch (error) {
        alert(error.message);
    }
}

