// Define holes
const holes = [
    { number: 1, par: 4, distance: 400},
    { number: 2, par: 3, distance: 120},
    { number: 3, par: 4, distance: 410},
    { number: 4, par: 5, distance: 530},
    { number: 5, par: 3, distance: 140},
    { number: 6, par: 4, distance: 420},
    { number: 7, par: 3, distance: 190},
    { number: 8, par: 5, distance: 550},
    { number: 9, par: 4, distance: 430},
    { number: 10, par: 4, distance: 380},
    { number: 11, par: 3, distance: 180},
    { number: 12, par: 5, distance: 510},
    { number: 13, par: 4, distance: 440},
    { number: 14, par: 4, distance: 300},
    { number: 15, par: 3, distance: 200},
    { number: 16, par: 5, distance: 540},
    { number: 17, par: 4, distance: 410},
    { number: 18, par: 4, distance: 390}
];

// Initialize empty hole object for club names
const clubNames = {};

// Load settings when the page loads
loadSettings();

// Event listeners setup
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Function to save customized club distances to localStorage
function saveSettings() {
    const clubs = {};
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        clubs[input.id] = input.value;
    });
    localStorage.setItem('clubs', JSON.stringify(clubs));
    // Customized clubs alert
    alert("Your clubs have been customized.");
}

// Event listener for the "Start Round" button
document.querySelector('.startRoundBtn').addEventListener('click', function() {
    // Hide the "Start Round" button
    this.style.display = 'none';

    // Show the holes container
    const holesContainer = document.querySelector('.holes-container');
    holesContainer.style.display = 'block';

    const yardsCounter = document.querySelector('.yardsCounter');
    yardsCounter.style.display = 'block'

    // Hide certain features
    hideFieldsAndButton();

    // Start the round and load hole information and the suggested club for the first hole
    startRound(1);
});

// Function to start the round and display information for a specific hole
function startRound(holeNumber) {
    // Display information for the specified hole
    const hole = holes[holeNumber - 1];
    displayHole(hole);
   
    // Determine the suggested club based on distance
    const suggestedClub = suggestClub(hole.distance);
   
    // Retrieve customized yardage for the suggested club from localStorage
    const clubs = JSON.parse(localStorage.getItem('clubs'));
    const customYardage = clubs && clubs[suggestedClub.toLowerCase()];
   
    // Update HTML to display suggested club
    const clubSuggestionElement = document.getElementById('clubSuggestion');
    if (customYardage) {
        clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub} (${customYardage} yards)`;
    } else {
        clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;
    }
   
    // Enable the swing button for the current hole
    const swingBtn = document.getElementById(`swingBtn${holeNumber}`);
    swingBtn.disabled = false;
   
    // Declare remainingDistance outside the event listener function
    let remainingDistance = hole.distance;
   
    // Add event listener to the swing button
    swingBtn.addEventListener('click', function() {
        // Generate a random yardage less than or equal to the remaining distance
        const yardsTraveled = Math.min(remainingDistance, Math.floor(Math.random() * (remainingDistance + 1)));
        
        // Display the yards traveled
        const yardsTraveledSpan = document.getElementById('yardsTraveled');
        yardsTraveledSpan.textContent = `Yards Traveled: ${yardsTraveled}`;
        
        // Update Remaining distance to the hole
        remainingDistance -= yardsTraveled;
        
        // Display the remaining distance
        const remainingDistanceSpan = document.getElementById('remainingDistance');
        remainingDistanceSpan.textContent = `Remaining Distance: ${remainingDistance} yards`;
        
        // Determine the suggested club based on the updated remaining distance
        const newSuggestedClub = suggestClub(remainingDistance);
        const newClubSuggestionElement = document.getElementById('clubSuggestion');
        newClubSuggestionElement.textContent = `Suggested Club: ${newSuggestedClub}`;

        // Display a completion message if the remaining distance is 0 or less
        if (remainingDistance <= 0) {
            swingBtn.disabled = true;
            const holeCompletionMessage = document.getElementById('holeCompletionMessage');
            holeCompletionMessage.textContent = 'Hole Completed!';
            
            // Call the function to complete the hole
            completeHole(holeNumber);
        }
    });

    document.querySelector('.hole').scrollIntoView({ behavior: 'smooth' });
    
    // Check if all holes are completed
    if (holeNumber === holes.length) {
        // If all holes are completed, display a message or perform any final actions
        console.log('All holes completed!');
    }
}

// Function to hide the input fields and save button after saving settings
function hideFieldsAndButton() {
    // Hide the club-distances div
    const clubDistancesDiv = document.querySelector('.club-distances');
    if (clubDistancesDiv) {
        clubDistancesDiv.style.display = 'none';
    }
    
    // Hide the save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.style.display = 'none';
    }
    
    // Hide the instruction
    const instruction = document.querySelector('.yards-reset h3');
    if (instruction) {
        instruction.style.display = 'none';
    }

    // Hide the reset clubs button
    const resetClubsBtn = document.querySelector('.resetClubs');
    if (resetClubsBtn) {
        resetClubsBtn.style.display = 'none';
    }
    
    // Hide yardsReset Div
    const yardsReset = document.querySelector('.yardsReset');
    if (yardsReset) {
        yardsReset.style.display = 'none';
    }
    
    // Set result element color to black
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.style.color = 'rgb(0,152,67)';
    }
}

// Function to load customized club distances from localStorage
function loadSettings() {
    const clubs = JSON.parse(localStorage.getItem('clubs'));
    if (clubs) {
        for (let club in clubs) {
            document.getElementById(club).value = clubs[club];
        }
    }
}

// Function to check if all input fields in the club-distances div are filled
function allFieldsFilled() {
    const inputs = document.querySelectorAll('.club-distances input[type="number"]');
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value) {
            return false; // Return false if any input field is empty
        }
    }
    return true; // Return true if all input fields are filled
}

document.addEventListener('DOMContentLoaded', function () {
    // Hide the "Start Round" button initially
    document.querySelector('.startRoundBtn').style.display = 'none';
    
    // Add event listeners to input fields
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        input.addEventListener('input', handleClubDistanceInputChange);
    });
});

// Function to handle input change in club distances
function handleClubDistanceInputChange() {
    // Check if all fields are filled
    if (allFieldsFilled()) {
        // Show the "Start Round" button
        document.querySelector('.startRoundBtn').style.display = 'block';
        // Hide the message
        document.querySelector('.yardsReset h3').style.display = 'none';
    } else {
        // Hide the "Start Round" button
        document.querySelector('.startRoundBtn').style.display = 'none';
        // Show the message
        document.querySelector('.yardsReset h3').style.display = 'block';
    }
}

// Event listener for input change in club distances
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        input.addEventListener('input', handleClubDistanceInputChange);
    });
});

// function handleClubDistanceInputChange() {
//     // Check if all fields are filled
//     if (allFieldsFilled()) {
//         // Show the "Start Round" button
//         document.querySelector('.startRoundBtn').style.display = 'block';
//         // Hide the message
//         document.querySelector('h3').style.display = 'none';
//     } else {
//         // Hide the "Start Round" button
//         document.querySelector('.startRoundBtn').style.display = 'none';
//         // Show the message
//         document.querySelector('h3').style.display = 'block';
//     }
// }

// // Event listener for input change in club distances
// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//         input.addEventListener('input', handleClubDistanceInputChange);
//     });
// });


// Function to set up event listeners
function setupEventListeners() {
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.querySelector('.reset').addEventListener('click', function () {
        // localStorage.removeItem('clubs');
        // Remove the call to loadSettings() here
        document.getElementById('yardage').value = '';
    });

    document.querySelector('.resetClubs').addEventListener('click', function () {
        // Clear local storage
        localStorage.removeItem('clubs');

        // Reset all input fields within the club-distances div
        document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
            input.value = '';
        });

        // Redirect to the homepage
        window.location.href = 'index.html';
    });
}

// Function to suggest the appropriate club based on distance
function suggestClub(distance) {
    try {
        const yardage = parseInt(distance);
        if (isNaN(yardage) || yardage <= 0) {
            throw new Error('Please enter a valid positive integer for yardage.');
        }
        
        const clubDistancesJSON = localStorage.getItem("clubs");
        if (!clubDistancesJSON) {
            throw new Error('Club distances have not been set.');
        }
        
        const clubDistances = JSON.parse(clubDistancesJSON);
        const driverDistance = parseInt(clubDistances.driver);
        if (!isNaN(driverDistance) && yardage >= driverDistance) {
            return "Driver, swing for the fences!";
        }
        
        const clubs = [
            { name: "Putter, you got this...", distance: clubDistances.putter },
            { name: "60 Degree", distance: clubDistances.sixtyDegree },
            { name: "Sand Wedge", distance: clubDistances.wedgeSand },
            { name: "Pitching Wedge", distance: clubDistances.wedgePitch },
            { name: "9 Iron", distance: clubDistances.nineIron },
            { name: "8 Iron", distance: clubDistances.eightIron },
            { name: "7 Iron", distance: clubDistances.sevenIron },
            { name: "6 Iron", distance: clubDistances.sixIron },
            { name: "5 Iron", distance: clubDistances.fiveIron },
            { name: "4 Iron", distance: clubDistances.fourIron },
            { name: "3 Iron", distance: clubDistances.threeIron },
            { name: "5 Wood", distance: clubDistances.fiveWood },
            { name: "3 Wood", distance: clubDistances.threeWood }
        ];
        
        const suggestedClub = clubs.find(club => yardage <= parseInt(club.distance));
        return suggestedClub ? suggestedClub.name : "No club found for the entered yardage.";
    } catch (error) {
        console.error("Error suggesting club:", error.message);
        return "Club distances have not been set.";
    }
}

// Event listener for yardage input change
document.getElementById("yardage").addEventListener("input", function() {
    const yardage = document.getElementById("yardage").value;
    const suggestedClub = suggestClub(yardage);
    document.getElementById("result").innerText = suggestedClub;
});

// Load settings when the page loads
loadSettings();

// Event listeners setup
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Function to display the details for a specific hole
function displayHole(hole) {
    const holeElement = document.querySelector('.hole');
    holeElement.innerHTML = `
        <h2>Hole #${hole.number}</h2>
        <p>Par: ${hole.par}</p>
        <p>Distance: ${hole.distance} yards</p>
        <button id="swingBtn${hole.number}" class="swingBtn" disabled>Swing</button>
    `;
}

// Function to handle completion of a hole
function completeHole(holeNumber) {
    // Logic to handle completion of a hole, e.g., move to the next hole
    if (holeNumber < holes.length) {
        // Move to the next hole
        startRound(holeNumber + 1);
    } else {
        // All holes are completed, display a message or perform any final actions
        console.log('All holes completed!');
    }
}










// // Define holes
// const holes = [
//     { number: 1, par: 4, distance: 400},
//     { number: 2, par: 3, distance: 120},
//     { number: 3, par: 4, distance: 410},
//     { number: 4, par: 5, distance: 530},
//     { number: 5, par: 3, distance: 140},
//     { number: 6, par: 4, distance: 420},
//     { number: 7, par: 3, distance: 190},
//     { number: 8, par: 5, distance: 550},
//     { number: 9, par: 4, distance: 430},
//     { number: 10, par: 4, distance: 380},
//     { number: 11, par: 3, distance: 180},
//     { number: 12, par: 5, distance: 510},
//     { number: 13, par: 4, distance: 440},
//     { number: 14, par: 4, distance: 300},
//     { number: 15, par: 3, distance: 200},
//     { number: 16, par: 5, distance: 540},
//     { number: 17, par: 4, distance: 410},
//     { number: 18, par: 4, distance: 390}
// ];

// // Initialize empty hole object for club names
// const clubNames = {};

// // Load settings when the page loads
// loadSettings();

// // Event listeners setup
// document.addEventListener('DOMContentLoaded', setupEventListeners);

// // Function to save customized club distances to localStorage
// function saveSettings() {
//     const clubs = {};
//     document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//         clubs[input.id] = input.value;
//     });
//     localStorage.setItem('clubs', JSON.stringify(clubs));
//     // Customized clubs alert
//     alert("Your clubs have been customized.");
// }

// // Event listener for the "Start Round" button
// document.querySelector('.startRoundBtn').addEventListener('click', function() {
//     // Hide the "Start Round" button
//     this.style.display = 'none';

//     // Show the holes container
//     const holesContainer = document.querySelector('.holes-container');
//     holesContainer.style.display = 'block';

//     const yardsCounter = document.querySelector('.yardsCounter');
//     yardsCounter.style.display = 'block'

//     // Hide certain features
//     hideFieldsAndButton();

//     // Start the round and load hole information and the suggested club for the first hole
//     startRound(1);
// });

// // Function to start the round and display information for a specific hole
// function startRound(holeNumber) {
//     // Display information for the specified hole
//     const hole = holes[holeNumber - 1];
//     displayHole(hole);
   
//     // Determine the suggested club based on distance
//     const suggestedClub = suggestClub(hole.distance);
   
//     // Retrieve customized yardage for the suggested club from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
//     const customYardage = clubs && clubs[suggestedClub.toLowerCase()];
   
//     // Update HTML to display suggested club
//     const clubSuggestionElement = document.getElementById('clubSuggestion');
//     if (customYardage) {
//         clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub} (${customYardage} yards)`;
//     } else {
//         clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;
//     }
   
//     // Enable the swing button for the current hole
//     const swingBtn = document.getElementById(`swingBtn${holeNumber}`);
//     swingBtn.disabled = false;
   
//     // Declare remainingDistance outside the event listener function
//     let remainingDistance = hole.distance;
   
//     // Add event listener to the swing button
//     swingBtn.addEventListener('click', function() {
//         // Generate a random yardage less than or equal to the remaining distance
//         const yardsTraveled = Math.min(remainingDistance, Math.floor(Math.random() * (remainingDistance + 1)));
        
//         // Display the yards traveled
//         const yardsTraveledSpan = document.getElementById('yardsTraveled');
//         yardsTraveledSpan.textContent = `Yards Traveled: ${yardsTraveled}`;
        
//         // Update Remaining distance to the hole
//         remainingDistance -= yardsTraveled;
        
//         // Display the remaining distance
//         const remainingDistanceSpan = document.getElementById('remainingDistance');
//         remainingDistanceSpan.textContent = `Remaining Distance: ${remainingDistance} yards`;
        
//         // Determine the suggested club based on the updated remaining distance
//         const newSuggestedClub = suggestClub(remainingDistance);
//         const newClubSuggestionElement = document.getElementById('clubSuggestion');
//         newClubSuggestionElement.textContent = `Suggested Club: ${newSuggestedClub}`;

//         // Display a completion message if the remaining distance is 0 or less
//         if (remainingDistance <= 0) {
//             swingBtn.disabled = true;
//             const holeCompletionMessage = document.getElementById('holeCompletionMessage');
//             holeCompletionMessage.textContent = 'Hole Completed!';
            
//             // Call the function to complete the hole
//             completeHole(holeNumber);
//         }
//     });

//     document.querySelector('.hole').scrollIntoView({ behavior: 'smooth' });
    
//     // Check if all holes are completed
//     if (holeNumber === holes.length) {
//         // If all holes are completed, display a message or perform any final actions
//         console.log('All holes completed!');
//     }
// }

// // Function to hide the input fields and save button after saving settings
// function hideFieldsAndButton() {
//     // Hide the club-distances div
//     const clubDistancesDiv = document.querySelector('.club-distances');
//     if (clubDistancesDiv) {
//         clubDistancesDiv.style.display = 'none';
//     }
    
//     // Hide the save button
//     const saveBtn = document.getElementById('saveBtn');
//     if (saveBtn) {
//         saveBtn.style.display = 'none';
//     }
    
//     // Hide the instruction
//     const instruction = document.querySelector('.yards-reset h3');
//     if (instruction) {
//         instruction.style.display = 'none';
//     }

//     // Hide the reset clubs button
//     const resetClubsBtn = document.querySelector('.resetClubs');
//     if (resetClubsBtn) {
//         resetClubsBtn.style.display = 'none';
//     }
    
//     // Hide yardsReset Div
//     const yardsReset = document.querySelector('.yardsReset');
//     if (yardsReset) {
//         yardsReset.style.display = 'none';
//     }
    
//     // Set result element color to black
//     const resultElement = document.getElementById('result');
//     if (resultElement) {
//         resultElement.style.color = 'rgb(0,152,67)';
//     }
// }

// // Function to load customized club distances from localStorage
// function loadSettings() {
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
//     if (clubs) {
//         for (let club in clubs) {
//             document.getElementById(club).value = clubs[club];
//         }
//     }
// }

// // Function to check if all input fields in the club-distances div are filled
// function allFieldsFilled() {
//     const inputs = document.querySelectorAll('.club-distances input[type="number"]');
//     for (let i = 0; i < inputs.length; i++) {
//         if (!inputs[i].value) {
//             return false; // Return false if any input field is empty
//         }
//     }
//     return true; // Return true if all input fields are filled
// }

// // Function to handle input change in club distances
// // Function to handle input change in club distances
// function handleClubDistanceInputChange() {
//     // Check if all fields are filled
//     if (allFieldsFilled()) {
//         // Show the "Start Round" button
//         document.querySelector('.startRoundBtn').style.display = 'block';
//         // Hide the message
//         document.querySelector('.club-distances-message').style.display = 'none';
//         // Hide the instruction
//         const instruction = document.querySelector('.yardsReset h3');
//         if (instruction) {
//             instruction.style.display = 'none';
//         }
//     } else {
//         // Hide the "Start Round" button
//         document.querySelector('.startRoundBtn').style.display = 'none';
//         // Show the message
//         document.querySelector('.club-distances-message').style.display = 'block';
//         // Show the instruction
//         const instruction = document.querySelector('.yardsReset h3');
//         if (instruction) {
//             instruction.style.display = 'block';
//         }
//     }
// }

// function handleClubDistanceInputChange() {
//     // Check if all fields are filled
//     if (allFieldsFilled()) {
//         // Show the "Start Round" button
//         document.querySelector('.startRoundBtn').style.display = 'block';
//         // Hide the message
//         document.querySelector('.club-distances-message').style.display = 'none';
//     } else {
//         // Hide the "Start Round" button
//         document.querySelector('.startRoundBtn').style.display = 'none';
//         // Show the message
//         document.querySelector('.club-distances-message').style.display = 'block';
//     }
// }

// // Event listener for input change in club distances
// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//         input.addEventListener('input', handleClubDistanceInputChange);
//     });
// });


// // Function to set up event listeners
// function setupEventListeners() {
//     document.getElementById('saveBtn').addEventListener('click', saveSettings);
//     document.querySelector('.reset').addEventListener('click', function () {
//         // localStorage.removeItem('clubs');
//         // Remove the call to loadSettings() here
//         document.getElementById('yardage').value = '';
//     });

//     document.querySelector('.resetClubs').addEventListener('click', function () {
//         // Clear local storage
//         localStorage.removeItem('clubs');

//         // Reset all input fields within the club-distances div
//         document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//             input.value = '';
//         });

//         // Redirect to the homepage
//         window.location.href = 'index.html';
//     });
// }

// // Function to suggest the appropriate club based on distance
// function suggestClub(distance) {
//     try {
//         const yardage = parseInt(distance);
//         if (isNaN(yardage) || yardage <= 0) {
//             throw new Error('Please enter a valid positive integer for yardage.');
//         }
        
//         const clubDistancesJSON = localStorage.getItem("clubs");
//         if (!clubDistancesJSON) {
//             throw new Error('Club distances have not been set.');
//         }
        
//         const clubDistances = JSON.parse(clubDistancesJSON);
//         const driverDistance = parseInt(clubDistances.driver);
//         if (!isNaN(driverDistance) && yardage >= driverDistance) {
//             return "Driver, swing for the fences!";
//         }
        
//         const clubs = [
//             { name: "Putter, you got this...", distance: clubDistances.putter },
//             { name: "60 Degree", distance: clubDistances.sixtyDegree },
//             { name: "Sand Wedge", distance: clubDistances.wedgeSand },
//             { name: "Pitching Wedge", distance: clubDistances.wedgePitch },
//             { name: "9 Iron", distance: clubDistances.nineIron },
//             { name: "8 Iron", distance: clubDistances.eightIron },
//             { name: "7 Iron", distance: clubDistances.sevenIron },
//             { name: "6 Iron", distance: clubDistances.sixIron },
//             { name: "5 Iron", distance: clubDistances.fiveIron },
//             { name: "4 Iron", distance: clubDistances.fourIron },
//             { name: "3 Iron", distance: clubDistances.threeIron },
//             { name: "5 Wood", distance: clubDistances.fiveWood },
//             { name: "3 Wood", distance: clubDistances.threeWood }
//         ];
        
//         const suggestedClub = clubs.find(club => yardage <= parseInt(club.distance));
//         return suggestedClub ? suggestedClub.name : "No club found for the entered yardage.";
//     } catch (error) {
//         console.error("Error suggesting club:", error.message);
//         return "Club distances have not been set.";
//     }
// }

// // Event listener for yardage input change
// document.getElementById("yardage").addEventListener("input", function() {
//     const yardage = document.getElementById("yardage").value;
//     const suggestedClub = suggestClub(yardage);
//     document.getElementById("result").innerText = suggestedClub;
// });

// // Load settings when the page loads
// loadSettings();

// // Event listeners setup
// document.addEventListener('DOMContentLoaded', setupEventListeners);

// // Function to display the details for a specific hole
// function displayHole(hole) {
//     const holeElement = document.querySelector('.hole');
//     holeElement.innerHTML = `
//         <h2>Hole #${hole.number}</h2>
//         <p>Par: ${hole.par}</p>
//         <p>Distance: ${hole.distance} yards</p>
//         <button id="swingBtn${hole.number}" class="swingBtn" disabled>Swing</button>
//     `;
// }

// // Function to handle completion of a hole
// function completeHole(holeNumber) {
//     // Logic to handle completion of a hole, e.g., move to the next hole
//     if (holeNumber < holes.length) {
//         // Move to the next hole
//         startRound(holeNumber + 1);
//     } else {
//         // All holes are completed, display a message or perform any final actions
//         console.log('All holes completed!');
//     }
// }