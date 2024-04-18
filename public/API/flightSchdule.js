// Arrival schedule process
// Function to handle finding flights when the user clicks the button
async function handleFindFlights() {
  // Get input values
  const departureAirport = document.getElementById('departure-airport').value;
  const arrivalAirport = document.getElementById('arrival-airport').value;
  const arrivalDateInput = document.getElementById('arrival-date').value;
  
  // Validate input values (optional)
  if (!departureAirport || !arrivalAirport || !arrivalDateInput) {
      console.error("Please fill in all required fields.");
      return;
  }
  
  // Construct the date object from the input valuen
  const arrivalDateValue = new Date(arrivalDateInput);
  const year = arrivalDateValue.getFullYear();
  const month = (arrivalDateValue.getMonth() + 1).toString().padStart(2, '0');
  const day = arrivalDateValue.getDate().toString().padStart(2, '0');
  const formattedArrivalDate = `${year}${month}${day}`;
  
  // Construct the URL
  const url = `https://timetable-lookup.p.rapidapi.com/TimeTable/${departureAirport}/${arrivalAirport}/${formattedArrivalDate}/`;
  
  // Fetch data from API
  await fetchArrivalFlightData(url);
}

// Function to fetch flight data from the API
async function fetchArrivalFlightData(url) {
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '967590798amshee898db2d6f428ap17d6d0jsn1cffc6857ba4',
          'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
      // Call parseAndDisplayFlightDetails function after receiving the API response
      parseAndDisplayFlightDetails(result);
  } catch (error) {
      console.error(error);
  }
}


// Getting API data for create the table of arrivals:

function parseAndDisplayFlightDetails(xmlData) {
  console.log('Parsing XML data...');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
  const flights = [];

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
  console.log('Extracted', flights.length, 'flights from XML data.');

  // Populate table
  console.log('Populating table...');
  populateTable(flights);
}

function populateTable(flights) {
  console.log('Populating table with', flights.length, 'flights.');
  const tableBody = document.getElementById('flight-details-body');
  tableBody.innerHTML = ''; // Clear previous contents
  


    // Display the headers table
    document.getElementById('flight-details').style.display="block";

  // Loop through each flight and create a table row for the content
  flights.forEach(flight => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${flight.flightNumber}</td>
          <td>${flight.departureAirportName}, ${flight.departureDateTime}</td>
          <td>${flight.arrivalAirportName}, ${flight.arrivalDateTime}</td>
      `;
      tableBody.appendChild(row);
  });


}
