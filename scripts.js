document.addEventListener('DOMContentLoaded', () => {
    const newEntryBtn = document.getElementById('newEntryBtn');
    const viewEntriesBtn = document.getElementById('viewEntriesBtn');
    const managePinsBtn = document.getElementById('managePinsBtn');
    const pinEntrySection = document.getElementById('pinEntrySection');
    const newEntrySection = document.getElementById('newEntrySection');
    const viewEntriesSection = document.getElementById('viewEntriesSection');
    const managePinsSection = document.getElementById('managePinsSection');
    const pinSubmitBtn = document.getElementById('pinSubmitBtn');
    const pinInput = document.getElementById('pinInput');
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const entriesList = document.getElementById('entriesList');
    const journalEntry = document.getElementById('journalEntry');
    const mood = document.getElementById('mood');
    const imageInput = document.getElementById('imageInput');
    const newPinInput = document.getElementById('newPinInput');
    const addPinBtn = document.getElementById('addPinBtn');
    const pinsList = document.getElementById('pinsList');
    const entryDetails = document.getElementById('entryDetails');
    const entryDate = document.getElementById('entryDate');
    const entryText = document.getElementById('entryText');
    const entryMood = document.getElementById('entryMood');
    const entryImage = document.getElementById('entryImage');
    const backToEntriesBtn = document.getElementById('backToEntriesBtn');
    const settingsRow = document.getElementById('settingsRow');
    const wordGoalInput = document.getElementById('wordGoalInput');
    const setWordGoalBtn = document.getElementById('setWordGoalBtn');
    const wordGoalProgress = document.getElementById('wordGoalProgress');
    const searchInput = document.getElementById('searchInput'); // Added for search functionality

    const secretPin = '6789';
    let pins = JSON.parse(localStorage.getItem('pins')) || [secretPin];
    let entries = JSON.parse(localStorage.getItem('entries')) || {};
    let currentProfile = null;
    let wordGoal = JSON.parse(localStorage.getItem('wordGoal')) || 0;
    let goalAchieved = JSON.parse(localStorage.getItem('goalAchieved')) || false;

    pinSubmitBtn.addEventListener('click', () => {
        const enteredPin = pinInput.value;
        if (pins.includes(enteredPin)) {
            currentProfile = enteredPin;
            pinEntrySection.classList.add('hidden');
            newEntryBtn.classList.remove('hidden');
            viewEntriesBtn.classList.remove('hidden');
            settingsRow.classList.remove('hidden');
            if (enteredPin === secretPin) {
                managePinsBtn.classList.remove('hidden');
            }
            updateWordGoalProgress();
        } else {
            alert('Invalid PIN. Try again.');
        }
    });

    newEntryBtn.addEventListener('click', () => {
        newEntrySection.classList.remove('hidden');
        viewEntriesSection.classList.add('hidden');
        managePinsSection.classList.add('hidden');
    });

    viewEntriesBtn.addEventListener('click', () => {
        newEntrySection.classList.add('hidden');
        viewEntriesSection.classList.remove('hidden');
        managePinsSection.classList.add('hidden');
        displayEntries();
    });

    managePinsBtn.addEventListener('click', () => {
        newEntrySection.classList.add('hidden');
        viewEntriesSection.classList.add('hidden');
        managePinsSection.classList.remove('hidden');
        displayPins();
    });

    saveEntryBtn.addEventListener('click', () => {
        const entryTextValue = journalEntry.value;
        const entryMoodValue = mood.value;
        const entryImageFile = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null;

        if (entryTextValue.trim() !== '') {
            const entry = {
                text: entryTextValue,
                mood: entryMoodValue,
                image: entryImageFile,
                date: new Date().toLocaleString()
            };

            if (!entries[currentProfile]) {
                entries[currentProfile] = [];
            }
            entries[currentProfile].push(entry);
            localStorage.setItem('entries', JSON.stringify(entries));

            // Format filename
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const formattedDay = date.toLocaleString('en-US', { weekday: 'long' });
            const filename = `journal blog entry, ${formattedDate}, ${formattedDay}.txt`;

            // File content
            const fileContent = `Date: ${entry.date}\nMood: ${entry.mood}\n\n${entry.text}`;
            const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });

            // Save file using FileSaver.js
            saveAs(blob, filename);
        } else {
            alert('Please write something before saving.');
        }
    });

    addPinBtn.addEventListener('click', () => {
        const newPin = newPinInput.value;
        if (newPin.trim() !== '' && !pins.includes(newPin)) {
            pins.push(newPin);
            localStorage.setItem('pins', JSON.stringify(pins));
            newPinInput.value = '';
            displayPins();
        } else {
            alert('Invalid or duplicate PIN.');
        }
    });

    entriesList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const entryIndex = e.target.dataset.index;
            const entry = entries[currentProfile][entryIndex];
            displayEntryDetails(entry);
        }
    });

    backToEntriesBtn.addEventListener('click', () => {
        entryDetails.classList.add('hidden');
        entriesList.classList.remove('hidden');
    });

    setWordGoalBtn.addEventListener('click', () => {
        wordGoal = parseInt(wordGoalInput.value, 10);
        localStorage.setItem('wordGoal', JSON.stringify(wordGoal));
        alert('Word goal set successfully!');
        updateWordGoalProgress();
    });

    journalEntry.addEventListener('input', () => {
        updateWordGoalProgress();
    });

    function displayEntries(entriesToDisplay) {
        entriesList.innerHTML = '';
        const entriesToShow = entriesToDisplay || entries[currentProfile];
        if (entriesToShow) {
            entriesToShow.forEach((entry, index) => {
                const entryItem = document.createElement('li');
                entryItem.dataset.index = index;
                entryItem.innerHTML = `
                    <p>${entry.date}</p>
                    <p>${entry.text.substring(0, 100)}...</p>
                `;
                entriesList.appendChild(entryItem);
            });
        }
    }

    function displayEntryDetails(entry) {
        entryDate.textContent = `Date: ${entry.date}`;
        entryText.textContent = `Text: ${entry.text}`;
        entryMood.textContent = `Mood: ${entry.mood}`;
        if (entry.image) {
            entryImage.src = entry.image;
            entryImage.style.display = 'block';
        } else {
            entryImage.style.display = 'none';
        }
        entryDetails.classList.remove('hidden');
        entriesList.classList.add('hidden');
    }

    function displayPins() {
        pinsList.innerHTML = '';
        pins.forEach(pin => {
            if (pin !== secretPin) {
                const pinItem = document.createElement('li');
                pinItem.innerHTML = `PIN: ${pin} <button data-pin="${pin}" class="deletePinBtn">Delete</button>`;
                pinsList.appendChild(pinItem);
            }
        });

        const deletePinBtns = document.querySelectorAll('.deletePinBtn');
        deletePinBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                const pinToDelete = e.target.dataset.pin;
                pins = pins.filter(pin => pin !== pinToDelete);
                localStorage.setItem('pins', JSON.stringify(pins));
                displayPins();
            });
        });
    }

    function updateWordGoalProgress() {
        if (wordGoal > 0) {
            const wordCount = journalEntry.value.split(/\s+/).filter(word => word.length > 0).length;
            const progress = Math.min((wordCount / wordGoal) * 100, 100);
            wordGoalProgress.value = progress;

            if (progress >= 100 && !goalAchieved) {
                document.body.style.backgroundColor = 'green';
                alert('Congratulations! You have reached your daily word goal!');
                setTimeout(() => {
                    document.body.style.backgroundColor = '';
                }, 1000);
                goalAchieved = true;
                localStorage.setItem('goalAchieved', JSON.stringify(goalAchieved));
            }

            wordGoalProgress.classList.remove('hidden');
        } else {
            wordGoalProgress.classList.add('hidden');
        }
    }

    // Event listener for the search input
    searchInput.addEventListener('input', function() {
        filterEntries(this.value);
    });

    // Initial display
    updateWordGoalProgress();
});
