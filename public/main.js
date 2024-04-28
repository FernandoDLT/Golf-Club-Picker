const holes = [
    { number: 1, par: 4, distance: 400},
    { number: 2, par: 3, distance: 120}
    // { number: 3, par: 4, distance: 410},
    // { number: 4, par: 5, distance: 530},
    // { number: 5, par: 3, distance: 140},
    // { number: 6, par: 4, distance: 420},
    // { number: 7, par: 3, distance: 190},
    // { number: 8, par: 5, distance: 550},
    // { number: 9, par: 4, distance: 430},
    // { number: 10, par: 4, distance: 380},
    // { number: 11, par: 3, distance: 180},
    // { number: 12, par: 5, distance: 510},
    // { number: 13, par: 4, distance: 440},
    // { number: 14, par: 4, distance: 300},
    // { number: 15, par: 3, distance: 200},
    // { number: 16, par: 5, distance: 540},
    // { number: 17, par: 4, distance: 410},
    // { number: 18, par: 4, distance: 390}
];

document.addEventListener('DOMContentLoaded', function () {
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
        document.getElementById(`${club}`).style.display = 'none';
    });

    // Hide the club-distances div
    document.querySelector('.club-distances').style.display = 'none';
    // Hide the save button
    document.getElementById('saveBtn').style.display = 'none';
    // Hide the instruction
    document.querySelector('.yards-reset h3').style.display = 'none';
    
    // Set result element color to black
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.style.color = 'rgb(0,152,67)';
    }
}

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
    
// All your existing JavaScript code goes here
// Function to start the round and display information for hole number one
function startRound() {
    // Display information for hole number one
    const hole = holes[0]; // Hole number one
    displayHole(hole); // Display hole information

    // Determine the suggested club based on distance
    const suggestedClub = suggestClub(hole.distance);

    // Update HTML to display suggested club
    const clubSuggestionElement = document.getElementById('clubSuggestion');
    clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;
}

// Function to suggest the appropriate club based on distance
function suggestClub(distance) {
    if (distance >= 230) {
        return 'Driver';
    } else {
        // Add conditions for other clubs if needed
        return 'Other Club'; // Default suggestion
    }
}

// Function to display the details for a specific hole
function displayHole(hole) {
    const holeElement = document.querySelector('.hole');
    holeElement.innerHTML = `
    <h2>Hole #${hole.number}</h2>
    <p>Par: ${hole.par}</p>
    <p>Distance: ${hole.distance} yards</p>
    `;
}

// Event listener for the "Start Round" button
document.getElementById('startRoundBtn').addEventListener('click', startRound);

});

// let currentHole = 0; // Index of the current hole
// let totalScore = 0; // Total score for the round

// // Function to start the round and display the first hole
// function startRound() {
//     currentHole = 0; // Start from the first hole
//     totalScore = 0; // Reset the total score
//     displayHole(currentHole); // Display the details for the first hole
// }

//     // Function to display the details for a specific hole
// function displayHole(index) {
//     const hole = holes[index];
//     const holeElement = document.querySelector('.hole');
//     holeElement.innerHTML = `
//         <h2>Hole #${hole.number}</h2>
//         <p>Par: ${hole.par}</p>
//         <p>Distance: ${hole.distance} yards</p>
//     `;
//     // Enable the swing button
//     const swingBtn = document.getElementById(`swingBtn${hole.number}`);
//     swingBtn.disabled = false;
//     swingBtn.textContent = 'Swing';
//     console.log(`swingBtn${hole.number}:`, swingBtn);

//     // Event listener for the swing button
//     swingBtn.addEventListener('click', function() {
//         // Simulate yards traveled (random value between 200 and 350)
//         const yardsTraveled = Math.floor(Math.random() * (350 - 200 + 1)) + 200;
//         // Update display with result
//         holeElement.innerHTML += `<p>Yards Traveled: ${yardsTraveled}</p>`;
//         // Disable swing button after swing
//         swingBtn.disabled = true;
//         // Update the hole distance
//         hole.distance -= yardsTraveled;
//         if (hole.distance <= 0) {
//             hole.distance = 0; // Ensure distance doesn't go negative
//             // Show message indicating hole completion
//             holeElement.innerHTML += `<p>Hole completed!</p>`;
//             // Update hole completion message
//             document.getElementById('holeCompletionMessage').textContent = 'Hole completed!';
//         } else {
//             // Show remaining distance for the hole
//             holeElement.innerHTML += `<p>Remaining Distance: ${hole.distance} yards</p>`;
//             // Update remaining distance
//             document.getElementById('remainingDistance').textContent = `Remaining Distance: ${hole.distance} yards`;
//         }
//     });
// }


// function displayHole(index) {
//     const hole = holes[index];
//     const holeElement = document.querySelector('.hole');
//     holeElement.innerHTML = `
//         <h2>Hole #${hole.number}</h2>
//         <p>Par: ${hole.par}</p>
//         <p>Distance: ${hole.distance} yards</p>
//     `;
//     // Enable the swing button
//     const swingBtn = document.getElementById(`swingBtn${hole.number}`);
//     swingBtn.disabled = false;
//     swingBtn.textContent = 'Swing';

//     // Event listener for the swing button
//     swingBtn.addEventListener('click', function() {
//         // Simulate yards traveled (random value between 200 and 350)
//         const yardsTraveled = Math.floor(Math.random() * (350 - 200 + 1)) + 200;
//         // Update display with result
//         holeElement.innerHTML += `<p>Yards Traveled: ${yardsTraveled}</p>`;
//         // Disable swing button after swing
//         swingBtn.disabled = true;
//         // Update the hole distance
//         hole.distance -= yardsTraveled;
//         if (hole.distance <= 0) {
//             hole.distance = 0; // Ensure distance doesn't go negative
//             // Show message indicating hole completion
//             holeElement.innerHTML += `<p>Hole completed!</p>`;
//         } else {
//             // Show remaining distance for the hole
//             holeElement.innerHTML += `<p>Remaining Distance: ${hole.distance} yards</p>`;
//         }
//     });
// }

// function displayHole(index) {
//     const hole = holes[index];
//     const holeElement = document.querySelector('.hole');
//     holeElement.innerHTML = `
//         <h2>Hole #${hole.number}</h2>
//         <p>Par: ${hole.par}</p>
//         <p>Distance: ${hole.distance} yards</p>
//     `;
//     // Enable the swing button
//     const swingBtn = document.getElementById(`swingBtn${hole.number}`);
//     swingBtn.disabled = false;
//     swingBtn.textContent = 'Swing';

//     // Event listener for the swing button
//     swingBtn.addEventListener('click', function() {
//         // Simulate yards traveled (random value between 200 and 350)
//         const yardsTraveled = Math.floor(Math.random() * (350 - 200 + 1)) + 200;
//         // Update display with result
//         holeElement.innerHTML += `<p>Yards Traveled: ${yardsTraveled}</p>`;
//         // Disable swing button after swing
//         swingBtn.disabled = true;
//         // Update the hole distance
//         hole.distance <= yardsTraveled;
//         if (hole.distance <= 0) {
//             hole.distance = 0;

//             holeElement.innerHTML += `<p>Hole Completed</p>`;
//         } else {
//             holeElement.innerHTML += `<p>Remaining Distance: ${hole.distance} yards</p>`;
//         }
//     });
// }

// Event listener for the "Start Round" button
// document.getElementById('startRoundBtn').addEventListener('click', startRound);
