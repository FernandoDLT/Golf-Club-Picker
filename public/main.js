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

// Initialize Club Name
initializeClubNames();

// Load settings when the page loads
loadSettings();

// Event listeners setup
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Function to initialize club names based on labels within the club-distances div
function initializeClubNames() {
    // Get all labels within the club-distances div
    document.querySelectorAll('.club-distances label').forEach(label => {
        // Extract the 'for' attribute of each label (which corresponds to the input ID)
        const key = label.getAttribute('for');
        // Extract the text content between the label tags
        let value = label.innerText.trim();
        // Store the club name in the clubNames object
        clubNames[key] = value;
    });
}

// Function to suggest the appropriate club based on yards entered
function suggestClubBasedOnYards(yards) {
    // Retrieve customized club distances from localStorage
    const clubs = JSON.parse(localStorage.getItem('clubs'));
    
    // If no customized distances are found, return 'Putter'
    if (!clubs) {
        return 'Putter';
    }
    
    // Check each club's customized distance and return the first one that matches the condition
    for (const club in clubs) {
        if (yards <= clubs[club]) {
            return club;
        }
    }
    
    // If no club matches, return 'Putter'
    return 'Putter';
}

// function suggestClubBasedOnYards(yards) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return yards >= 230 ? 'Driver' : 'Putter';
//     }
//     // Check each club's customized distance and return the first one that matches the condition
//     for (const club in clubs) {
//         if (yards <= clubs[club]) {
//             return club;
//         }
//     }
//     return yards >= 230 ? 'Driver' : 'Putter'; // Default suggestion
// }

// Event listener for the yardage input field
const yardageInput = document.getElementById('yardage');
yardageInput.addEventListener('input', function() {
    const yards = parseInt(this.value);
    const suggestedClub = suggestClubBasedOnYards(yards);
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.textContent = `Suggested Club: ${clubNames[suggestedClub]}`;
        resultElement.style.color = 'rgb(0,152,67)';
    }
});

// Function to save customized club distances to localStorage
function saveSettings() {
    const clubs = {};
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
        const label = document.querySelector(`label[for="${club}"]`);
        if (label) {
            label.style.display = 'none';
        }
        
        // Hide the input field
        const inputField = document.getElementById(club);
        if (inputField) {
            inputField.style.display = 'none';
        }
    });
    
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

// Function to set up event listeners
function setupEventListeners() {
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
}

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
    
    function suggestRemaining(distance, currentClub) {
        // Retrieve customized club distances from localStorage
        const clubs = JSON.parse(localStorage.getItem('clubs'));
        
        // If no customized distances are found or if the current club is not customized, return the default remaining distance
        if (!clubs || !clubs[currentClub]) {
            return distance;
        }
        
        // Calculate the remaining distance based on the customized yardage of the current club
        const customYardage = clubs[currentClub];
        const remainingDistance = distance - customYardage;
        
        // Ensure the remaining distance is non-negative
        return Math.max(remainingDistance, 0);
    }

    // Add event listener to the swing button
    swingBtn.addEventListener('click', function() {
        // Generate a random yardage less than or equal to the remaining distance
        const yardsTraveled = Math.min(remainingDistance, Math.floor(Math.random() * (remainingDistance + 1)));
        
        // Display the yards traveled
        const yardsTraveledSpan = document.getElementById('yardsTraveled');
        yardsTraveledSpan.textContent = `Yards Traveled: ${yardsTraveled}`;
        
        // Update remainingDistance to the hole
        remainingDistance -= yardsTraveled;
        
        // Display the remaining distance
        const remainingDistanceSpan = document.getElementById('remainingDistance');
        remainingDistanceSpan.textContent = `Remaining Distance: ${remainingDistance} yards`;
        
        // Determine the suggested club based on the updated remaining distance
        const suggestedClub = suggestClub(remainingDistance);
        const clubSuggestionElement = document.getElementById('clubSuggestion');
        clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;
        
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

// Function to suggest the appropriate club based on distance
function suggestClub(distance) {
    // Retrieve customized club distances from localStorage
    const clubs = JSON.parse(localStorage.getItem('clubs'));
    
    // Check if customized distances are available
    if (clubs) {
        // Iterate through the customized distances and find the appropriate club
        for (const club in clubs) {
            // Parse the distance for comparison
            const customDistance = parseInt(clubs[club]);
            // If the custom distance matches, return the club
            if (distance <= customDistance) {
                return club;
            }
        }
    }
    
    // If no matching club is found, return 'Putter' as the default suggestion
    return 'Putter';
}

// function suggestClub(distance) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return distance >= 230 ? 'Driver' : 'Putter';
//     }
    
//     // Check if the distance is equal to or greater than 230 yards
//     if (distance >= 230) {
//         return 'Driver';
//     } else {
//         // Iterate through the customized distances and find the appropriate club
//         for (const club in clubs) {
//             // Parse the distance for comparison
//             const customDistance = parseInt(clubs[club]);
//             // If the custom distance matches, return the club
//             if (distance <= customDistance) {
//                 return club;
//             }
//         }
//     }
    
//     // If no matching club is found, return 'Putter' as the default suggestion
//     return 'Putter';
// }

// function suggestClub(distance) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return distance >= 230 ? 'Driver' : 'Putter';
//     }
    
//     // Check if the distance is equal to or greater than 230 yards
//     if (distance >= 230) {
//         return 'Driver';
//     } else {
//         // Check each club's customized distance and return the first one that matches the condition
//         for (const club in clubs) {
//             if (distance <= clubs[club]) {
//                 return club;
//             }
//         }
//     }
    
//     // If no matching club is found, return 'Putter' as the default suggestion
//     return 'Putter';
// }

// function suggestClub(distance) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return distance >= 230 ? 'Driver' : 'Other Club';
//     }
    
//     // Check each club's customized distance and return the first one that matches the condition
//     for (const club in clubs) {
//         if (distance <= clubs[club]) {
//             return club;
//         }
//     }
//     // Default suggestion changed to Putter
//     return distance >= 230 ? 'Driver' : 'Putter';
// }

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

// Start the round
startRound(1);


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

// // Initialize Club Name after clubNames is declared
// initializeClubNames();

// // Load settings when the page loads
// loadSettings();

// // Event listeners setup
// document.addEventListener('DOMContentLoaded', setupEventListeners);

// // Function to initialize club names
// function initializeClubNames() {
//     // Get all labels within the club-distances div
//     document.querySelectorAll('.club-distances label').forEach(label => {
//         // Extract the 'for' attribute of each label (which corresponds to the input ID)
//         const key = label.getAttribute('for');
//         // Extract the label text content and remove the colon ':' if present
//         let value = label.textContent.trim();
//         // Special handling for certain clubs
//         if (key === 'driver') {
//             // Append additional text for the driver club
//             value = 'Driver, swing for the fences';
//         } else if (key === 'putter') {
//             // Append additional text for the putter club
//             value = 'Putter, you got this';
//         } else {
//             // Remove the colon ':' for other clubs
//             value = value.replace(':', '');
//         }
//         // Store the club name in the clubNames object
//         clubNames[key] = value;
//     });
// }


// // Function to save customized club distances to localStorage
// function saveSettings() {
//     const clubs = {};
//     document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//         clubs[input.id] = input.value;
//     });
//     localStorage.setItem('clubs', JSON.stringify(clubs));
//     // Hide the fields and save button after saving
//     hideFieldsAndButton();
// }

// // Function to hide the input fields and save button after saving settings
// function hideFieldsAndButton() {
//     // Loop through each input field
//     Object.keys(clubNames).forEach(club => {
//         // Hide the label associated with the input field
//         const label = document.querySelector(`label[for="${club}"]`);
//         if (label) {
//             label.style.display = 'none';
//         }
        
//         // Hide the input field
//         const inputField = document.getElementById(club);
//         if (inputField) {
//             inputField.style.display = 'none';
//         }
//     });

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

// // Function to set up event listeners
// function setupEventListeners() {
//     document.getElementById('saveBtn').addEventListener('click', saveSettings);
//     document.querySelector('.reset').addEventListener('click', function() {
//         // localStorage.removeItem('clubs');
//         loadSettings();
//         document.getElementById('yardage').value = '';
//     });

//     document.querySelector('.resetClubs').addEventListener('click', function() {
//         localStorage.removeItem('clubs');
//         loadSettings();
//         // Reset all input fields within the club-distances div
//         document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//             input.value = '';
//         });
        
//         window.location.href = 'index.html';
//     });
// }

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

// // Function to suggest the appropriate club based on distance
// function suggestClub(distance) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return distance >= 230 ? 'Driver' : 'Putter';
//     }
    
//     // Check each club's customized distance and return the first one that matches the condition
//     for (const club in clubs) {
//         if (distance <= clubs[club]) {
//             return club;
//         }
//     }
//     return distance >= 230 ? 'Driver' : 'Putter'; // Default suggestion
// }

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

// // Start the round
// startRound(1);

// Define holes
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

// // Initialize Club Name
// initializeClubNames();

// // Load settings when the page loads
// loadSettings();

// // Event listeners setup
// document.addEventListener('DOMContentLoaded', setupEventListeners);

// // Function to initialize club names
// function initializeClubNames() {
//     // Get all labels within the club-distances div
//     document.querySelectorAll('.club-distances label').forEach(label => {
//         // Extract the 'for' attribute of each label (which corresponds to the input ID)
//         const key = label.getAttribute('for');
//         // Extract the label text content and remove the colon ':' if present
//         let value = label.textContent.trim();
//         // Special handling for certain clubs
//         if (key === 'driver') {
//             // Append additional text for the driver club
//             value = 'Driver, swing for the fences';
//         } else if (key === 'putter') {
//             // Append additional text for the putter club
//             value = 'Putter, you got this';
//         } else {
//             // Remove the colon ':' for other clubs
//             value = value.replace(':', '');
//         }
//         // Store the club name in the clubNames object
//         clubNames[key] = value;
//     });
// }

// // Function to save customized club distances to localStorage
// function saveSettings() {
//     const clubs = {};
//     document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//         clubs[input.id] = input.value;
//     });
//     localStorage.setItem('clubs', JSON.stringify(clubs));
//     // Hide the fields and save button after saving
//     hideFieldsAndButton();
// }

// // Function to hide the input fields and save button after saving settings
// function hideFieldsAndButton() {
//     // Loop through each input field
//     Object.keys(clubNames).forEach(club => {
//         // Hide the label associated with the input field
//         const label = document.querySelector(`label[for="${club}"]`);
//         if (label) {
//             label.style.display = 'none';
//         }
        
//         // Hide the input field
//         const inputField = document.getElementById(club);
//         if (inputField) {
//             inputField.style.display = 'none';
//         }
//     });

//     // Hide the club-distances div
//                 const clubDistancesDiv = document.querySelector('.club-distances');
//                 if (clubDistancesDiv) {
//                     clubDistancesDiv.style.display = 'none';
//                 }
                
//                 // Hide the save button
//                 const saveBtn = document.getElementById('saveBtn');
//                 if (saveBtn) {
//                     saveBtn.style.display = 'none';
//                 }
                
//                 // Hide the instruction
//                 const instruction = document.querySelector('.yards-reset h3');
//                 if (instruction) {
//                     instruction.style.display = 'none';
//                 }

//                 // Hide the reset clubs button
//                 const resetClubsBtn = document.querySelector('.resetClubs');
//                 if (resetClubsBtn) {
//                     resetClubsBtn.style.display = 'none';
//                 }
                
//                 // Hide yardsReset Div
//                 const yardsReset = document.querySelector('.yardsReset');
//                 if (yardsReset) {
//                     yardsReset.style.display = 'none';
//                 }
                
//                 // Set result element color to black
//                 const resultElement = document.getElementById('result');
//                 if (resultElement) {
//                     resultElement.style.color = 'rgb(0,152,67)';
//                 }
// }

// // Function to suggest the appropriate club based on yards entered
// function suggestClubBasedOnYards(yards) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return yards >= 230 ? 'Driver' : 'Putter';
//     }
    
//     // Check each club's customized distance and return the first one that matches the condition
//     for (const club in clubs) {
//         if (yards <= clubs[club]) {
//             return club;
//         }
//     }
//     return yards >= 230 ? 'Driver' : 'Putter'; // Default suggestion
// }

// // Event listener for the yardage input field
// const yardageInput = document.getElementById('yardage');
// yardageInput.addEventListener('input', function() {
//     const yards = parseInt(this.value);
//     const suggestedClub = suggestClubBasedOnYards(yards);
//     const resultElement = document.getElementById('result');
//     if (resultElement) {
//         resultElement.textContent = `Suggested Club: ${suggestedClub}`;
//         resultElement.style.color = 'rgb(0,152,67)';
//     }
// });


// // Function to load customized club distances from localStorage
// function loadSettings() {
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
//     if (clubs) {
//         for (let club in clubs) {
//             document.getElementById(club).value = clubs[club];
//         }
//     }
// }

// // Function to set up event listeners
// function setupEventListeners() {
//     document.getElementById('saveBtn').addEventListener('click', saveSettings);
//     document.querySelector('.reset').addEventListener('click', function() {
//         // localStorage.removeItem('clubs');
//         loadSettings();
//         document.getElementById('yardage').value = '';
//     });

//     document.querySelector('.resetClubs').addEventListener('click', function() {
//         localStorage.removeItem('clubs');
//         loadSettings();
//         // Reset all input fields within the club-distances div
//         document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
//             input.value = '';
//         });
        
//         window.location.href = 'index.html';
//     });
// }

// // Function to start the round and display information for a specific hole
// function startRound(holeNumber) {
//     // Display information for the specified hole
//     const hole = holes[holeNumber - 1];
//     displayHole(hole);
    
//     // Determine the suggested club based on distance
//     const suggestedClub = suggestClub(hole.distance);
    
//     // Update HTML to display suggested club
//     const clubSuggestionElement = document.getElementById('clubSuggestion');
//     clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;

//     // Enable the swing button for the current hole
//     const swingBtn = document.getElementById(`swingBtn${holeNumber}`);
//     swingBtn.disabled = false;

//     document.querySelector('.hole').scrollIntoView({ behavior: 'smooth' });

//     // Check if all holes are completed
//     if (holeNumber === holes.length) {
//         // If all holes are completed, display a message or perform any final actions
//         console.log('All holes completed!');
//     }
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
//       const clubSuggestionElement = document.getElementById('clubSuggestion');
//     if (customYardage) {
//         clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub} (${customYardage} yards)`;
//     } else {
//         clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;
//     }
//     // const clubSuggestionElement = document.getElementById('clubSuggestion');
//     // clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;

//     // Enable the swing button for the current hole
//     const swingBtn = document.getElementById(`swingBtn${holeNumber}`);
//     swingBtn.disabled = false;

// // Declare remainingDistance outside the event listener function
// let remainingDistance = hole.distance;
    
// function suggestRemaining(distance, currentClub) {
//     // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found or if the current club is not customized, return the default remaining distance
//     if (!clubs || !clubs[currentClub]) {
//         return distance;
//     }
    
//     // Calculate the remaining distance based on the customized yardage of the current club
//     const customYardage = clubs[currentClub];
//     const remainingDistance = distance - customYardage;
//     // const remainingDistance = distance - clubs[currentClub];
    
//     // Ensure the remaining distance is non-negative
//     return Math.max(remainingDistance, 0);
// }

// // Add event listener to the swing button
// swingBtn.addEventListener('click', function() {
//     // Generate a random yardage less than or equal to the remaining distance
//     const yardsTraveled = Math.min(remainingDistance, Math.floor(Math.random() * (remainingDistance + 1)));

//     // Display the yards traveled
//     const yardsTraveledSpan = document.getElementById('yardsTraveled');
//     yardsTraveledSpan.textContent = `Yards Traveled: ${yardsTraveled}`;

//     // Update Remaining distance to the hole
//     // remainingDistance = suggestRemaining(remainingDistance, currentClub);
    
//     remainingDistance -= yardsTraveled;

//     // Display the remaining distance
//     const remainingDistanceSpan = document.getElementById('remainingDistance');
//     remainingDistanceSpan.textContent = `Remaining Distance: ${remainingDistance} yards`;

//     // Determine the suggested club based on the updated remaining distance
//     const suggestedClub = suggestClub(remainingDistance);
//     const clubSuggestionElement = document.getElementById('clubSuggestion');
//     clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;

//     // Display a completion message if the remaining distance is 0 or less
//     if (remainingDistance <= 0) {
//         swingBtn.disabled = true;
//         const holeCompletionMessage = document.getElementById('holeCompletionMessage');
//         holeCompletionMessage.textContent = 'Hole Completed!';
        
//         // Call the function to complete the hole
//         completeHole(holeNumber);
//     }
// });

//     document.querySelector('.hole').scrollIntoView({ behavior: 'smooth' });

//     // Check if all holes are completed
//     if (holeNumber === holes.length) {
//         // If all holes are completed, display a message or perform any final actions
//         console.log('All holes completed!');
//     }
// }

// // Function to suggest the appropriate club based on distance
// function suggestClub(distance) {
//         // Retrieve customized club distances from localStorage
//     const clubs = JSON.parse(localStorage.getItem('clubs'));
    
//     // If no customized distances are found, use the default logic
//     if (!clubs) {
//         return distance >= 230 ? 'Driver' : 'Other Club';
//     }
    
//     // Check each club's customized distance and return the first one that matches the condition
//     for (const club in clubs) {
//         if (distance <= clubs[club]) {
//             return club;
//         }
//     }
//     // NOT SURE HERE!!!!!! Changed other club to Putter
//     return distance >= 230 ? 'Driver' : 'Putter';
// }

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

// // Start the round
// startRound(1);