const key = "648c88df4157478bb7b3d8c5d7ea845d";

function getCurrentTimezone() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showCurrentTimezone, handleGeolocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showCurrentTimezone(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Use the latitude and longitude to fetch current timezone
    fetchTimezone(latitude, longitude, "current-timezone-result");
}

function searchAddress() {
    const addressInput = document.getElementById("address");
    const address = addressInput.value;

    // Validate address
    if (!address) {
        alert("Please enter an address.");
        return;
    }

    // Use the address to fetch latitude and longitude
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${key}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const result = data.features[0];
                const latitude = result.geometry.coordinates[1];
                const longitude = result.geometry.coordinates[0];

                // Display address details
                displayAddressDetails(result);

                // Use the latitude and longitude to fetch timezone
                fetchTimezone(latitude, longitude, "address-timezone-result");
            } else {
                alert("Invalid address. Please enter a valid address.");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

function fetchTimezone(latitude, longitude, resultContainerId) {
    fetch(`https://api.geoapify.com/v1/timezone?lat=${latitude}&lon=${longitude}&apiKey=${key}`)
        .then(resp => resp.json())
        .then(result => {
            const resultContainer = document.getElementById(resultContainerId);

            // Update the HTML with timezone information
            resultContainer.innerHTML = `
                <h2>Timezone Information</h2>
                <p>Name Of Time Zone: ${result.timezone}</p>
                <span style="display: flex; gap: 300px;">
                    <p>Lat: ${latitude}</p>
                    <p>Long: ${longitude}</p>
                </span>
                <p>Offset STD: ${result.offset_STD}</p>
                <p>Offset DST: ${result.offset_DST}</p>
            `;
        })
        .catch(error => console.error("Error fetching timezone:", error));
}

function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function displayAddressDetails(result) {
    const detailsContainer = document.getElementById("show-details");
    console.log(result)
    // Clear previous content
    detailsContainer.innerHTML = "";

    // Create HTML elements for address details
    const addressElement = document.createElement("div");
    addressElement.className = "AddressDetails";
    addressElement.innerHTML = `
        <h2>Address Details</h2>
        <span class="clip">
        <p>Lat: ${result.properties.lat}</p>
        <p>Long: ${result.properties.lon}</p>
        </span>
        <p>Offset_STD : ${result.properties.timezone.abbreviation_STD}</p>
        <p>Offset_DST : ${result.properties.timezone.abbreviation_DST}</p>
        <p>Address: ${result.properties.formatted}</p>
        <p>Country: ${result.properties.country}</p>
        <p>State: ${result.properties.state}</p>
        <p>City: ${result.properties.city}</p>
    `;

    // Append the address details element to the container
    detailsContainer.appendChild(addressElement);
}