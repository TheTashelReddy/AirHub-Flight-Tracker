// Define cardData object with default values
const cardData = [
    {
        leftContent: {
            flightNumber: 'FlightNumber',
            departureTime: 'FLSDepartureDateTime',
        },
        rightContent: {
            arrivalAirport: 'FLSLocationName',
            arrivalTime: 'ArrivalDateTime',
        }
    },
    // Define other cardData objects as needed
];

// Function to fetch flight details from the API
const fetchFlightDetails = async () => {
    // Get user input
    const fromInput = document.getElementById('fromInput').value;
    const toInput = document.getElementById('toInput').value;
    const dateInput = document.getElementById('dateInput').value;

    // Construct date object from input value
    const arrivalDateValue = new Date(dateInput);
    const year = arrivalDateValue.getFullYear();
    const month = (arrivalDateValue.getMonth() + 1).toString().padStart(2, '0');
    const day = arrivalDateValue.getDate().toString().padStart(2, '0');
    const formattedArrivalDate = `${year}${month}${day}`;

    // Construct API request URL
    const url = `https://timetable-lookup.p.rapidapi.com/TimeTable/${fromInput}/${toInput}/${formattedArrivalDate}/`;

    // API request options
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '967590798amshee898db2d6f428ap17d6d0jsn1cffc6857ba4',
            'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
        }
    };

    try {
        console.log("Fetching data from API...");
        // Fetch data from API
        const response = await fetch(url, options);
        const xmlData = await response.text();
        console.log("API data fetched:", xmlData);

        // Process API response and extract flight details
        const flights = extractFlightDetails(xmlData);

        // Update HTML content with flight details
        updateFlightDetails(flights);
    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
};

// Function to extract flight details from XML response
const extractFlightDetails = (xmlData) => {
    const flights = [];

    // Parse XML data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    // Extract flight details
    const flightNodes = xmlDoc.querySelectorAll('FlightLegDetails');
    console.log('Found', flightNodes.length, 'flight details in the XML.');
    flightNodes.forEach((flightNode, index) => {
        if (index < 5) { // Limit to the first 5 flights
            const flightNumber = flightNode.getAttribute('FlightNumber');
            const departureAirportName = flightNode.querySelector('DepartureAirport').getAttribute('FLSLocationName');
            const departureDateTime = flightNode.getAttribute('DepartureDateTime');
            const arrivalAirportName = flightNode.querySelector('ArrivalAirport').getAttribute('FLSLocationName');
            const arrivalDateTime = flightNode.getAttribute('ArrivalDateTime');

            flights.push({
                flightNumber,
                departureAirportName,
                departureDateTime,
                arrivalAirportName,
                arrivalDateTime
            });
        }
    });

    return flights;
};

// Function to update HTML content with flight details
const updateFlightDetails = (flights) => {
    console.log("Updating HTML content with flight details...");
    const cardContainer = document.querySelector('.card-container');

    // Clear previous content
    cardContainer.innerHTML = '';

    // Update HTML with flight details
    flights.forEach((flight) => {
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'mb-3');

        // Format departure and arrival times
        const departureTime = new Date(flight.departureDateTime).toLocaleTimeString();
        const arrivalTime = new Date(flight.arrivalDateTime).toLocaleTimeString();

        postElement.innerHTML = `
            <div class="row">
                <div class="col-md-6" style="background-color: #f2f2f2; border-color: #000;">
                    <h4 class="card-headline">Flight Number: ${flight.flightNumber}</h4>
                    <p class="card-body">Departure Time: ${departureTime}</p>
                </div>
                <div class="col-md-6" style="background-color: #f2f2f2; border-color: #000;">
                    <h4 class="card-headline">Arrival Airport: ${flight.arrivalAirportName}</h4>
                    <p class="card-body">Arrival Time: ${arrivalTime}</p>
                </div>
            </div>
        `;
        cardContainer.appendChild(postElement);
    });
};

// Function to initialize the page
const initializePage = () => {
    console.log("Initializing the page...");
    // Event listener for form submission
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        // Fetch flight details when the form is submitted
        fetchFlightDetails();
    });
};

// Call initializePage function when the document is ready
document.addEventListener('DOMContentLoaded', initializePage);
