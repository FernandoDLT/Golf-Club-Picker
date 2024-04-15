// Mapping of club IDs to their corresponding names
const clubNames = {
    putter: 'Putter, you got this',
    wedge60: '60 Degree Wedge',
    wedgeSand: 'Sand Wedge',
    wedgePitch: 'Pitching Wedge',
    nineIron: 'your go to club, 9 Iron',
    eightIron: '8 Iron',
    sevenIron: '7 Iron',
    sixIron: '6 Iron',
    fiveIron: '5 Iron',
    fourIron: '4 Iron',
    threeIron: '3 Iron',
    fiveWood: '5 Wood',
    threeWood: '3 Wood',
    driver: 'Driver, swing for the fences'
};

// Function to save customized club distances to localStorage
function saveSettings() {
    let clubs = {
        putter: document.getElementById('putter').value,
        wedge60: document.getElementById('wedge60').value,
        wedgeSand: document.getElementById('wedgeSand').value,
        wedgePitch: document.getElementById('wedgePitch').value,
        nineIron: document.getElementById('nineIron').value,
        eightIron: document.getElementById('eightIron').value,
        sevenIron: document.getElementById('sevenIron').value,
        sixIron: document.getElementById('sixIron').value,
        fiveIron: document.getElementById('fiveIron').value,
        fourIron: document.getElementById('fourIron').value,
        threeIron: document.getElementById('threeIron').value,
        fiveWood: document.getElementById('fiveWood').value,
        threeWood: document.getElementById('threeWood').value,
        driver: document.getElementById('driver').value,
    };

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

    // Hide the save button
    document.getElementById('saveBtn').style.display = 'none';
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
    localStorage.removeItem('clubs');
    loadSettings();
    document.getElementById('yardage').value = '';
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


// // Function to save customized club distances to localStorage
// function saveSettings() {
//     let clubs = {
//         putter: document.getElementById('putter').value,
//         wedge60: document.getElementById('wedge60').value,
//         wedgeSand: document.getElementById('wedgeSand').value,
//         wedgePitch: document.getElementById('wedgePitch').value,
//         nineIron: document.getElementById('9Iron').value,
//         eightIron: document.getElementById('8Iron').value,
//         sevenIron: document.getElementById('7Iron').value,
//         sixIron: document.getElementById('6Iron').value,
//         fiveIron: document.getElementById('5Iron').value,
//         fourIron: document.getElementById('4Iron').value,
//         threeIron: document.getElementById('3Iron').value,
//         fiveWood: document.getElementById('5Wood').value,
//         threeWood: document.getElementById('3Wood').value,
//         driver: document.getElementById('driver').value,
//     };

//     localStorage.setItem('clubs', JSON.stringify(clubs));
// }

// // Function to load customized club distances from localStorage
// function loadSettings() {
//     let clubs = JSON.parse(localStorage.getItem('clubs'));
//     if (clubs) {
//         for (let club in clubs) {
//             document.getElementById(club).value = clubs[club];
//         }
//     }
// }

// // Call loadSettings when the page loads to populate the input fields
// window.onload = loadSettings;

// document.getElementById('saveBtn').addEventListener('click', saveSettings);

// document.querySelector('.reset').addEventListener('click', function() {
//     localStorage.removeItem('clubs');
//     loadSettings();
// });

// document.getElementById('yardage').addEventListener('input', function() {
//     let yards = Number(this.value);
//     let resultElement = document.getElementById('result');

//     if (isNaN(yards) || yards <= 0) {
//         resultElement.textContent = 'Please enter a valid yardage.';
//         return;
//     }

//     let clubs = JSON.parse(localStorage.getItem('clubs'));
//     if (!clubs) {
//         resultElement.textContent = 'Please customize your club distances first.';
//         return;
//     }

//     let club = '';
//     for (let clubName in clubs) {
//         if (yards < clubs[clubName]) {
//             club = clubName;
//             break;
//         }
//     }

//     if (!club) {
//         club = 'Driver, swing for the fences';
//     }

//     resultElement.textContent = `Use your ${club}!`;
// });


// // Function to save customized club distances to localStorage
// function saveSettings() {
//     let clubs = {
//         putter: Number(document.getElementById('putter').value),
//         wedge60: Number(document.getElementById('wedge60').value),
//         wedgeSand: Number(document.getElementById('wedgeSand').value),
//         wedgePitch: Number(document.getElementById('wedgePitch').value),
//         nineIron: Number(document.getElementById('9Iron').value),
//         eightIron: Number(document.getElementById('8Iron').value),
//         sevenIron: Number(document.getElementById('7Iron').value),
//         sixIron: Number(document.getElementById('6Iron').value),
//         fiveIron: Number(document.getElementById('5Iron').value),
//         fourIron: Number(document.getElementById('4Iron').value),
//         threeIron: Number(document.getElementById('3Iron').value),
//         fiveWood: Number(document.getElementById('5Wood').value),
//         threeWood: Number(document.getElementById('3Wood').value),
//         driver: Number(document.getElementById('driver').value),
        
//     };

//     localStorage.setItem('clubs', JSON.stringify(clubs));
// }

// // Function to load customized club distances from localStorage
// function loadSettings() {
//     let clubs = JSON.parse(localStorage.getItem('clubs'));
//     if (clubs) {
//         document.getElementById('putter').value = clubs.putter;
//         document.getElementById('wedge60').value = clubs.wedge60;
//         document.getElementById('wedgeSand').value = clubs.wedgeSand;
//         document.getElementById('wedgePitch').value = clubs.wedgePitch;
//         document.getElementById('9Iron').value = clubs.nineIron;
//         document.getElementById('8Iron').value = clubs.eightIron;
//         document.getElementById('7Iron').value = clubs.sevenIron;
//         document.getElementById('6Iron').value = clubs.sixIron;
//         document.getElementById('5Iron').value = clubs.fiveIron;
//         document.getElementById('4Iron').value = clubs.fourIron;
//         document.getElementById('3Iron').value = clubs.threeIron;
//         document.getElementById('5Wood').value = clubs.fiveWood;
//         document.getElementById('3Wood').value = clubs.threeWood;
//         document.getElementById('driver').value = clubs.driver;
//     }
// }

// // Call loadSettings when the page loads to populate the input fields
// window.onload = loadSettings;

// document.querySelector('button').addEventListener('click', checkYards);
// document.querySelector('.reset').addEventListener('click', reset);

// function checkYards() {
//     let yards = Number(document.querySelector('#yardage').value);
//     let resultElement = document.querySelector('#result');

//     if (isNaN(yards) || yards <= 0) {
//         resultElement.textContent = 'Please enter yardage.';
//         return;
//     }

//     let club = '';
//     switch (true) {
//         case (yards < 9):
//             club = 'Putter, you got this';
//             break;
//         case (yards < 80):
//             club = '60 Degree Wedge';
//             break;
//         case (yards < 110):
//             club = 'Sand Wedge';
//         case (yards < 120):
//             club = 'Pitching Wedge'
//             break;
//         case (yards < 130):
//             club = 'go to club...9 Iron'
//             break;
//         case (yards < 150):
//             club = '8 Iron'
//             break;
//         case (yards < 160):
//             club = '7 Iron'
//             break;
//         case (yards < 170):
//             club = '6 Iron'
//             break;
//         case (yards < 180):
//             club = '5 Iron'
//             break;
//         case (yards < 190):
//             club = '4 Iron'
//             break;
//         case (yards < 200):
//             club = '3 Iron'
//             break;
//         case (yards < 220):
//             club = '5 Wood'
//             break;
//         case (yards < 250):
//             club = '3 Wood';
//             break;
//         default:
//             club = 'Driver, swing for the fences'
//             break;
//     }

//     resultElement.textContent = `Use your ${club}!`;
// }


// function reset() {
//     window.location.reload()
// }

// document.querySelector('button').addEventListener('click', checkYards);
// document.querySelector('.reset').addEventListener('click', reset);

// function checkYards() {
//     let yards = Number(document.querySelector('#yardage').value);// takes yardage value
//     let resultElement = document.querySelector('#result'); // Get the result element

//     if (yards === - 0) {
//         resultElement.textContent = 'Please enter yardage.'
//     }
//     else if (yards < 9) {
//         resultElement.textContent = 'Use your Putter, you got this...'
//     } else if (yards >= 10 && yards < 80) {
//         resultElement.textContent = 'Use your 60 Degree Wedge'
//     } else if (yards >= 80 && yards < 110) {
//         resultElement.textContent = 'Use your Sand Wedge'
//     } else if (yards >= 110 && yards < 120) {
//         resultElement.textContent = 'Use your Pitching Wedge'
//     } else if (yards >= 120 && yards < 130) {
//         resultElement.textContent = 'Use your go to club...9 Iron'
//     } else if (yards >= 130 && yards < 140) {
//         resultElement.textContent = 'Use your 8 Iron'
//     } else if (yards >= 150 && yards < 160) {
//         resultElement.textContent = 'Use your 7 Iron'
//     } else if (yards >= 160 && yards < 170) {
//         resultElement.textContent = 'Use your 6 Iron'
//     } else if (yards >= 170 && yards < 180) {
//         resultElement.textContent = 'Use your 5 Iron'
//     } else if (yards >= 180 && yards < 190) {
//         resultElement.textContent = 'Use your 4 Iron'
//     } else if (yards >= 190 && yards < 200) {
//         resultElement.textContent = 'Use your 3 Iron'
//     } else if (yards >= 200 && yards < 220) {
//         resultElement.textContent = 'Use your 5 Wood'
//     } else if (yards >= 220 && yards < 250) {
//         resultElement.textContent = 'Use your 3 Wood'
//     } else {
//         resultElement.textContent = 'Use your Drver, swing for the fences...'
//     } 
// }
// // Reload page Functionallity
// function reset() {
//     window.location.reload()
// }