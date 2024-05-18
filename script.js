function addDay() {
    const daysDiv = document.getElementById('days');
    const dayDiv = document.createElement('div');
    dayDiv.innerHTML = `
        <label for="day">Day:</label>
        <input type="text" name="day" required>
        <br>
        <div class="keyValuePairs">
            <button type="button" onclick="addKeyValuePair(this)">Add Key-Value Pair</button>
            <br>
        </div>
        <hr>
        <br>`;
    daysDiv.appendChild(dayDiv);
}

function addKeyValuePair(button) {
    const keyValuePairsDiv = button.parentNode;
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="text" name="key" placeholder="Enter Key" required>
        <input type="text" name="value" placeholder="Enter Value" required>
        <button type="button" onclick="removeKeyValuePair(this)">Remove</button>
        <br><br>`;
    keyValuePairsDiv.insertBefore(div, button);
}

function removeKeyValuePair(button) {
    button.parentNode.remove();
}


function fetchcurrent() {
    fetch('https://schoolscheduleserver.onrender.com/colleges/current') // Replace 'https://api.example.com/data' with your API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the data on the HTML page
            const dataContainer = document.getElementById('current');
            console.log(data);
            dataContainer.innerHTML = ''; // Clear previous data
            data.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.textContent = item.name; // Assuming 'name' is a property of each item
                dataContainer.appendChild(itemElement);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}



document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    const formData = new FormData(this); // Get form data
    const entries = formData.entries(); // Get form entries iterator
    
    const collegeName = document.getElementById('collegeName').value;
    const schedule = {};
    let currentDay = null;
    for (const entry of entries) {
        const [name, value] = entry;
        if (name === 'day') {
            schedule[value] = {};
            currentDay = value;
        } else if (name === 'key') {
            schedule[currentDay][value] = '';
        } else if (name === 'value') {
            const keys = Object.keys(schedule[currentDay]);
            const lastKey = keys[keys.length - 1];
            schedule[currentDay][lastKey] = value;
        }
    }
    
    const finalObject = {
        name: collegeName,
        schedule: schedule
    };

    console.log(finalObject); // Log the final result
    const token = localStorage.getItem("authToken");
    console.log(token)
    fetch('https://schoolscheduleserver.onrender.com/colleges/updateTimeTable', {
        method: 'POST',
        mode: "cors",
        credentials :"include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            // Add any additional headers here if required
        },
        body: JSON.stringify(finalObject) // Convert object to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse response body as JSON
    })
    .then(data => {
        console.log('Server response:', data); // Log server response
        // Optionally, perform any actions with the response data here
    })
    .catch(error => {
        console.error('Error sending data to server:', error); // Log any errors
        // Optionally, handle errors or display an error message to the user
    });
});

