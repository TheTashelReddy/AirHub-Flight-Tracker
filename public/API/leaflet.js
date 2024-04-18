import fetchData from './fetchFlightData.js';

// Leaflet map Initializer
var map = L.map('map').setView([43.6777, -79.6248], 13); // Toronto Pearson Airport coordinates

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Function to add markers to the map based on flight data
async function addMarkers() {
    // Fetch flight data
    const extractedData = await fetchData();
    
    // Iterate through extractedData array
    extractedData.forEach(flight => {
        // Extract latitude, longitude, and label
        const { latitude, longitude, label } = flight;

        // Create marker with custom icon
        const customIcon = L.icon({
            iconUrl: '/assets/plane-i.png',
            iconSize: [32, 32], 
            iconAnchor: [16, 16], // center the icon
        });
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

        // Create popup with label
        const popupContent = `<b>${label}</b><br>Latitude: ${latitude}<br>Longitude: ${longitude}`;

        // Bind popup to marker and open it
        marker.bindPopup(popupContent).openPopup();
    });
}

// Call the function to add markers
addMarkers();
