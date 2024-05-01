
document.addEventListener('DOMContentLoaded', function () {
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
    
    const clubNames = {};

    // Initialize Club Name
    initializeClubNames();
    
    // Load settings when the page loads
    loadSettings();

    // Event listeners
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

    // Function to initialize club names
    function initializeClubNames() {
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
    }

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

        window.onload = function() {
        loadSettings();

        // Check if settings are already saved and hide fields if necessary
        if (localStorage.getItem('clubs')) {
            hideFieldsAndButton();
        }
    };

    // Function to load customized club distances from localStorage
    function loadSettings() {
        const clubs = JSON.parse(localStorage.getItem('clubs'));
        if (clubs) {
            for (let club in clubs) {
                document.getElementById(club).value = clubs[club];
            }
        }
    }

    // Call loadSettings when the page loads to populate the input fields
    window.onload = loadSettings;

    // Function to start the round and display information for hole number one
    function startRound(holeNumber) {
        // Display information for hole number one
        const hole = holes[holeNumber - 1]; // Hole number one
        displayHole(hole); // Display hole information
        
        // Determine the suggested club based on distance
        const suggestedClub = suggestClub(hole.distance);
        
        // Update HTML to display suggested club
        const clubSuggestionElement = document.getElementById('clubSuggestion');
        clubSuggestionElement.textContent = `Suggested Club: ${suggestedClub}`;

        // Enable the swing button for the current hole
        const swingBtn = document.getElementById(`swingBtn${holeNumber}`);
        swingBtn.disabled = false;

        document.querySelector('.hole').scrollIntoView({ behavior: 'smooth' })
    }

    // Event listener for swing button click
    document.getElementById('swingBtn1').addEventListener('click', function() {
        // Generate a random yardage less than 400 yards
        const yardsTraveled = Math.floor(Math.random() * 400);

        // Display the yards traveled
        const yardsTraveledSpan = document.getElementById('yardsTraveled');
        yardsTraveledSpan.textContent = `Yards Traveled: ${yardsTraveled}`;

        // Calculate remaining distance to the hole
        const remainingDistance = 400 - yardsTraveled;

        // Display the remaining distance
        const remainingDistanceSpan = document.getElementById('remainingDistance');
        remainingDistanceSpan.textContent = `Remaining Distance: ${remainingDistance} yards`;

        // Disable the swing button after clicking
        this.disabled = true;

        // Display a completion message if the remaining distance is 0
        if (remainingDistance === 0) {
            const holeCompletionMessage = document.getElementById('holeCompletionMessage');
            holeCompletionMessage.textContent = 'Hole Completed!';
        }
    });

    // Function to suggest the appropriate club based on distance
    function suggestClub(distance) {
        return distance >= 230 ? 'Driver' : 'Other Club';
    }

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
    
});