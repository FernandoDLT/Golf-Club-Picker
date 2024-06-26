// Event listeners setup
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Define holes
const holes = [
    { number: 1, par: 4, distance: 400 },
    { number: 2, par: 3, distance: 120 },
    { number: 3, par: 4, distance: 410 },
    { number: 4, par: 5, distance: 530 },
    { number: 5, par: 3, distance: 140 },
    { number: 6, par: 4, distance: 420 },
    { number: 7, par: 3, distance: 190 },
    { number: 8, par: 5, distance: 550 },
    { number: 9, par: 4, distance: 430 },
    { number: 10, par: 4, distance: 380 },
    { number: 11, par: 3, distance: 180 },
    { number: 12, par: 5, distance: 510 },
    { number: 13, par: 4, distance: 440 },
    { number: 14, par: 4, distance: 300 },
    { number: 15, par: 3, distance: 200 },
    { number: 16, par: 5, distance: 540 },
    { number: 17, par: 4, distance: 410 },
    { number: 18, par: 4, distance: 390 }
];

// Initialize empty hole object for club names
const clubNames = {};

// Load settings when the page loads
loadSettings();

// Function to save customized club distances to localStorage
function saveSettings() {
    const clubs = {};
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        clubs[input.id] = input.value;
    });
    localStorage.setItem('clubs', JSON.stringify(clubs));
    // Customized clubs alert
    // alert("Your clubs have been customized.");
    // Show the "Start Round" button
    document.querySelector('.startRoundBtn').style.display = 'inline-block';
}

// Event listener for the "Start Round" button
document.querySelector('.startRoundBtn').addEventListener('click', function () {
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

// Event listener for the "New Round" button
document.getElementById('new-round').addEventListener('click', function () {
    // Redirect to the homepage
    window.location.href = 'index.html';
});


// Initialize variables to store total strokes and par for the round
let totalStrokes = 0;
const parForRound = 73; // Assuming the par for the round is 73

function startRound(holeNumber) {
    // Display information for the specified hole
    const hole = holes[holeNumber - 1];
    displayHole(hole);

    // Initialize strokes for the current hole
    let strokes = 0;

    // Determine the suggested club based on distance
    const suggestedClub = suggestClub(hole.distance);

    // Retrieve customized yardage for the suggested club from localStorage
    const clubs = JSON.parse(localStorage.getItem('clubs'));
    const customYardage = clubs && clubs[suggestedClub.toLowerCase()];

    // Update HTML to display suggested club
    const clubSuggestionElement = document.getElementById(`clubSuggestion${holeNumber}`);
    if (clubSuggestionElement) {
        if (customYardage) {
            clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub} (${customYardage} yards)`;
        } else {
            clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;
        }
    } else {
        console.error(`clubSuggestionElement${holeNumber} not found.`);
    }

    // Enable the swing button for the current hole
    const swingBtn = document.getElementById(`swingBtn${holeNumber}`);
    if (swingBtn) {
        swingBtn.disabled = false;
    } else {
        console.error(`swingBtn${holeNumber} not found.`);
    }

    // Declare yardsToTheHole outside the event listener function
    let yardsToTheHole = hole.distance;

    // Display the yardage information and remaining distance
    const yardageInformationElement = document.getElementById('yardageInformation');
    if (yardageInformationElement) {
        yardageInformationElement.textContent = `Yardage Information: ${hole.distance} yards`;
    }

    const yardsToTheHoleSpan = document.getElementById('yardsToTheHole');
    if (yardsToTheHoleSpan) {
        yardsToTheHoleSpan.textContent = `Yards To The Hole: ${hole.distance} yards`;
    }

    // Initialize yards traveled to 0
    const yardsTraveledSpan = document.getElementById('yardsTraveled');
    if (yardsTraveledSpan) {
        yardsTraveledSpan.textContent = `Yards Traveled: 0 yards`;
    }

    // Add event listener to the swing button
    if (swingBtn) {
        let swingInterval;
        swingBtn.addEventListener('mousedown', function () {
            // Record the start time when the button is pressed down
            swingStartTime = new Date().getTime();

            // Show and initialize progress bar
            const progressBar = document.getElementById(`swingProgressBar${holeNumber}`);
            if (progressBar) {
                progressBar.style.display = 'block';
                progressBar.value = 0;

                // Update progress bar value every 100ms while the button is held down
                swingInterval = setInterval(function () {
                    const swingDuration = new Date().getTime() - swingStartTime;
                    const maxDuration = 3000; // Maximum duration for full power (3 seconds)
                    const powerPercentage = Math.min(100, (swingDuration / maxDuration) * 100); // Cap at 100%
                    progressBar.value = powerPercentage;
                }, 1);
            }
        });

        swingBtn.addEventListener('mouseup', function () {
            // Clear the interval when the button is released
            clearInterval(swingInterval);

            // Calculate the duration of holding down the button
            const swingDuration = new Date().getTime() - swingStartTime;

            // Calculate the power percentage based on the duration
            const maxDuration = 3000; // Maximum duration for full power (3 seconds)
            const powerPercentage = Math.min(100, (swingDuration / maxDuration) * 100); // Cap at 100%

            // Call the function to perform the swing with the calculated power percentage
            performSwing(powerPercentage);

            // Hide progress bar after the swing
            const progressBar = document.getElementById(`swingProgressBar${holeNumber}`);
            if (progressBar) {
                progressBar.style.display = 'block';
            }
        });

        // Function to perform the swing with a given power percentage
        function performSwing(powerPercentage) {
            console.log(`Swing power: ${powerPercentage}%`);
            const progressBar = document.getElementById(`swingProgressBar${holeNumber}`);
            if (progressBar) {
                progressBar.value = 0; // Reset progress bar after swing
            }

            // Increment the strokes
            strokes++;

            // Update the strokes displayed on the UI
            const strokesSpan = document.getElementById(`strokes${holeNumber}`);
            if (strokesSpan) {
                strokesSpan.textContent = strokes;
            }

            // Generate a random yardage less than or equal to the remaining distance
            const yardsTraveled = Math.min(yardsToTheHole, Math.floor(Math.random() * yardsToTheHole) + 1);

            // Update the yards traveled displayed on the UI
            if (yardsTraveledSpan) {
                yardsTraveledSpan.textContent = `Yards Traveled: ${yardsTraveled} yards`;
            }

            // Update remaining distance to the hole
            yardsToTheHole -= yardsTraveled;

            // Display the remaining distance
            if (yardsToTheHoleSpan) {
                yardsToTheHoleSpan.textContent = `Yards To The Hole: ${yardsToTheHole} yards`;
            }

            // Determine the suggested club based on the updated remaining distance
            const newSuggestedClub = suggestClub(yardsToTheHole);
            const newClubSuggestionElement = document.getElementById(`clubSuggestion${holeNumber}`);
            if (newClubSuggestionElement) {
                if (yardsToTheHole > 0) {
                    newClubSuggestionElement.textContent = `Suggested Club: ${newSuggestedClub}`;
                } else {
                    // Hide the suggested club element if remaining distance is 0 or less
                    newClubSuggestionElement.style.display = 'block';
                }
            } else {
                console.error(`clubSuggestionElement${holeNumber} not found.`);
            }

            // Calculate the score for the current hole
            const scoreSpan = document.getElementById(`score${holeNumber}`);
            if (scoreSpan) {
                scoreSpan.textContent = strokes;
            } else {
                console.error(`score${holeNumber} not found.`);
            }

            // Increment the total strokes for the round
            totalStrokes++;

            // Display a completion message if the remaining distance is 0 or less
            if (yardsToTheHole <= 0) {
                if (swingBtn) {
                    swingBtn.disabled = true;
                }
                const holeCompletionMessage = document.getElementById('holeCompletionMessage');
                if (holeCompletionMessage) {
                    holeCompletionMessage.textContent = 'Hole Completed!';
                }

                // Hide the swing button
                if (swingBtn) {
                    swingBtn.style.display = 'none';
                }

                // Call the function to complete the hole
                completeHole(holeNumber);

                // Check if it's the last hole to display the total score
                if (holeNumber === 18) {
                    const totalStrokesSpan = document.getElementById('totalStrokes');
                    if (totalStrokesSpan) {
                        totalStrokesSpan.textContent = `Total Strokes: ${totalStrokes}`;
                    }
                    // Calculate the relative score compared to par
                    const relativeScore = totalStrokes - parForRound;
                    const totalScoreSpan = document.getElementById('totalScore');
                    if (totalScoreSpan) {
                        if (relativeScore === 0) {
                            totalScoreSpan.textContent = 'You shot even par';
                        } else if (relativeScore > 0) {
                            totalScoreSpan.textContent = `You shot ${relativeScore} over par`;
                        } else {
                            totalScoreSpan.textContent = `You shot ${Math.abs(relativeScore)} under par`;
                        }
                    }

                    // Hide the "Yards Traveled" and "Remaining Distance" elements
                    if (yardsTraveledSpan) {
                        yardsTraveledSpan.style.display = 'none';
                    }
                    if (yardsToTheHoleSpan) {
                        yardsToTheHoleSpan.style.display = 'none';
                    }
                }
            }
        }
    }

    document.querySelector('.hole').scrollIntoView({ behavior: 'smooth' });
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

// Add event listener to input fields when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Hide the "Start Round" button initially
    document.querySelector('.startRoundBtn').style.display = 'none';

    // Add event listeners to input fields
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        input.addEventListener('input', handleClubDistanceInputChange);
    });
});

// Function to save customized club distances to localStorage
function saveSettings() {
    // Check if all input fields are filled
    if (!allFieldsFilled()) {
        // Display an alert or message to notify the user
        alert("Please fill in all club distances before saving.");
        return; // Exit the function if any field is not filled
    }
    
    const clubs = {};
    document.querySelectorAll('.club-distances input[type="number"]').forEach(input => {
        clubs[input.id] = input.value;
    });
    localStorage.setItem('clubs', JSON.stringify(clubs));
    
    // Call handleClubDistanceInputChange to check if all fields are filled
    handleClubDistanceInputChange();
    
    // Show the "Start Round" button if all fields are filled
    if (allFieldsFilled()) {
        document.querySelector('.startRoundBtn').style.display = 'inline-block';
    }
    
    // Hide the save button
    document.getElementById('saveBtn').style.display = 'none';

}

// Function to handle input change in club distances
function handleClubDistanceInputChange() {
    // Check if all fields are filled
    if (allFieldsFilled()) {
        // Hide the message
        document.querySelector('.yardsReset h3').style.display = 'none';
    } else {
        // Show the message
        document.querySelector('.yardsReset h3').style.display = 'block';
    }
}

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
        console.log("Distance:", distance); // Debugging statement
        const yardage = parseInt(distance);
        console.log("Yardage:", yardage); // Debugging statement
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

        const threeWoodDistance = parseInt(clubDistances.threeWood);
        if (!isNaN(threeWoodDistance) && yardage >= threeWoodDistance && yardage < driverDistance) {
            return "3 Wood";
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
            // { name: "3 Wood", distance: clubDistances.threeWood },
        ];

        const suggestedClub = clubs.find(club => yardage <= parseInt(club.distance));
        return suggestedClub ? suggestedClub.name : "No club found for the entered yardage.";
    } catch (error) {
        // console.error("Error suggesting club:", error.message);
        return "Club distances have not been set.";
    }
}

// Event listener for yardage input change
document.getElementById("yardage").addEventListener("input", function () {
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
        <div class="clubSuggestion" id="clubSuggestion${hole.number}">Suggested Club:</div>
        <button id="swingBtn${hole.number}" class="swingBtn" disabled>Swing</button>
        <button id="nextHoleBtn">Next Hole</button>
        <div class="strokes-container">
            <span class="strokes-label">Strokes:</span>
            <span id="strokes${hole.number}" class="strokes">0</span>
        </div>
        `;
}

// Function to handle completion of a hole
function completeHole(holeNumber) {
    const completedHole = holes[holeNumber - 1]; // Retrieve the completed hole's information

    // Create a container div for the completed hole
    const holeContainer = document.createElement('div');
    holeContainer.classList.add('hole-container'); // Add a class for styling

    // Create HTML elements to represent the completed hole's information
    const holeInfo = document.createElement('div');
    holeInfo.classList.add('hole-info'); // Add a class for styling
    holeInfo.innerHTML = `
        <h2>Hole #${completedHole.number}</h2>
        <p>Par: ${completedHole.par}</p>
        <p>Distance: ${completedHole.distance} yards</p>
        <p>Strokes: ${document.getElementById('strokes' + holeNumber).textContent}</p>
    `;

    // Append the completed hole's information to the hole container
    holeContainer.appendChild(holeInfo);

    // Append the hole container to the previousHoleResults div in descending order
    const previousHoleResults = document.getElementById('previousHoleResults');
    const existingContainers = previousHoleResults.querySelectorAll('.hole-container');
    if (existingContainers.length > 0) {
        // If there are existing containers, insert new container before the first one
        previousHoleResults.insertBefore(holeContainer, existingContainers[0]);
    } else {
        // If no existing containers, simply append the new container
        previousHoleResults.appendChild(holeContainer);
        // Show the previousHoleResults div when the first hole is added
        previousHoleResults.style.display = 'block';
    }

    // Logic for handling completion of holes
    const yardsToTheHoleSpan = document.getElementById('yardsToTheHole');
    const yardsToTheHole = parseInt(yardsToTheHoleSpan.textContent.split(' ')[2]); // Extract the remaining distance

    if (yardsToTheHole === 0 && holeNumber === holes.length) {
        // Logic to handle completion of the 18th hole
        // Hide the "Next Hole" button
        const nextHoleBtn = document.getElementById('nextHoleBtn');
        if (nextHoleBtn) {
            nextHoleBtn.style.display = 'none';
        }

        // Hide the "Hole Completed" message
        const holeCompletionMessage = document.getElementById('holeCompletionMessage');
        if (holeCompletionMessage) {
            holeCompletionMessage.textContent = '';
        } else {
            console.error('Hole Completed message element not found.');
        }

        // Display the "New Round" button
        const newRoundBtn = document.getElementById('new-round');
        if (newRoundBtn) {
            newRoundBtn.style.display = 'inline-block';
        } else {
            console.error('New Round button element not found.');
        }

        // Display the "All Holes Completed!" message
        const roundCompletionMessageSpan = document.getElementById('roundCompletionMessage');
        if (roundCompletionMessageSpan) {
            roundCompletionMessageSpan.textContent = 'All Holes Completed!';
            const holesContainer = document.querySelector('.holes-container');
            if (holesContainer) {
                holesContainer.style.display = 'none'; // Hide the holes container
            }
        }

        //Hide <hr> element
        const hrElement = document.querySelector('hr');
        if (hrElement) {
            hrElement.style.display = 'none';
        }

        // Hide the "Yardage Information" element
        const yardageInformationElement = document.getElementById('yardageInformation');
        if (yardageInformationElement) {
            yardageInformationElement.style.display = 'none';
        }
    } else {
        // Logic for holes other than the 18th hole
        // Display the "Next Hole" button
        const nextHoleBtn = document.getElementById('nextHoleBtn');
        if (nextHoleBtn) {
            nextHoleBtn.style.display = 'inline-block';
        }

        // Display the "Hole Completed" message
        const holeCompletionMessage = document.getElementById('holeCompletionMessage');
        if (holeCompletionMessage) {
            holeCompletionMessage.textContent = 'Hole Completed!';
        } else {
            console.error('Hole Completed message element not found.');
        }

        // Event listener for the "Next Hole" button
        nextHoleBtn.addEventListener('click', function () {
            // Hide the "Next Hole" button
            nextHoleBtn.style.display = 'none';

            // Hide the "Hole Completed" message
            const holeCompletionMessage = document.getElementById('holeCompletionMessage');
            if (holeCompletionMessage) {
                holeCompletionMessage.textContent = '';
            } else {
                console.error('Hole Completed message element not found.');
            }

            // Move to the next hole
            if (holeNumber < holes.length) {
                // Move to the next hole
                startRound(holeNumber + 1);
            } else {
                // All holes are completed, display a message in the roundCompletionMessage span
                const roundCompletionMessageSpan = document.getElementById('roundCompletionMessage');
                roundCompletionMessageSpan.textContent = 'All Holes Completed!';
                const holesContainer = document.querySelector('.holes-container');
                if (holesContainer) {
                    holesContainer.style.display = 'none'; // Hide the holes container
                }
            }
        });
    }
}

// Event listener for the "New Round" button
document.getElementById('new-round').addEventListener('click', function () {
    // Redirect to the homepage
    window.location.href = 'index.html';
});