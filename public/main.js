// Define an empty object to store club names
const clubNames = {};

// Get all labels within the club-distances div
document.querySelectorAll('.club-distances label').forEach(label => {
    // Extract the 'for' attribute of each label (which corresponds to the input ID)
    const key = label.getAttribute('for');
    // Extract the label text content and remove the colon ':' if present
    let value = label.textContent.trim();
    // Special handling for certain clubs
    if (key === 'driver') {
        // Append additional text for the driver club
        value = 'Driver, swing for the fences';
    } else if (key === 'putter') {
        // Append additional text for the putter club
        value = 'Putter, you got this';
    } else {
        // Remove the colon ':' for other clubs
        value = value.replace(':', '');
    }
    // Store the club name in the clubNames object
    clubNames[key] = value;
});


// Function to save customized club distances to localStorage
function saveSettings() {
    let clubs = {};
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
            clubs[input.id] = input.value;
        });

    localStorage.setItem('clubs', JSON.stringify(clubs));

    // Hide the fields and save button after saving
    hideFieldsAndButton();
}

// Function to hide the input fields and save button after saving settings
function hideFieldsAndButton() {
    // Loop through each input field
    Object.keys(clubNames).forEach(club => {
        // Hide the label associated with the input field
        document.querySelector(`label[for="${club}"]`).style.display = 'none';
        // Hide the input field
        document.getElementById(club).style.display = 'none';
    });

    // Move the resultElement inside the club-distances div
    const resultElement = document.getElementById('result');
    const clubDistancesDiv = document.querySelector('.club-distances');
    if (clubDistancesDiv && resultElement) {
        clubDistancesDiv.appendChild(resultElement);
    }

    // Hide the save button
    document.getElementById('saveBtn').style.display = 'none';
    document.querySelector('.yards-reset h3').style.display = 'none';
    resultElement.style.color = 'black'
}

    // Call loadSettings when the page loads to populate the input fields
    window.onload = function() {
        loadSettings();
    
    // Check if settings are already saved and hide fields if necessary
    if (localStorage.getItem('clubs')) {
        hideFieldsAndButton();
    }
};


// Function to load customized club distances from localStorage
function loadSettings() {
    let clubs = JSON.parse(localStorage.getItem('clubs'));
    if (clubs) {
        for (let club in clubs) {
            document.getElementById(club).value = clubs[club];
        }
    }
}

// Call loadSettings when the page loads to populate the input fields
window.onload = loadSettings;

document.getElementById('saveBtn').addEventListener('click', saveSettings);

document.querySelector('.reset').addEventListener('click', function() {
    // localStorage.removeItem('clubs');
    loadSettings();
    document.getElementById('yardage').value = '';
});

document.querySelector('.resetClubs').addEventListener('click', function() {
    localStorage.removeItem('clubs');
    loadSettings();
     // Reset all input fields within the club-distances div
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        input.value = '';
    });

    window.location.href = 'index.html';
});

document.getElementById('yardage').addEventListener('input', function() {
    let yards = Number(this.value);
    let resultElement = document.getElementById('result');

    if (isNaN(yards) || yards <= 0) {
        resultElement.textContent = 'Please enter a valid yardage.';
        return;
    }

    let clubs = JSON.parse(localStorage.getItem('clubs'));
    if (!clubs) {
        resultElement.textContent = 'Please customize your club distances first.';
        return;
    }

    let club = '';
    for (let clubName in clubs) {
        if (yards < clubs[clubName]) {
            club = clubName;
            break;
        }
    }

    if (!club) {
        club = 'driver'; // Default to 'Driver' if no club is found
    }

    resultElement.textContent = `Use your ${clubNames[club]}!`;
});