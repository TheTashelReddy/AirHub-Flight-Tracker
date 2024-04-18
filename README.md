# AirHub-Travel-Tracker API Research paper

AirHub: A Comprehensive Flight Tracking Application system related to air travel, which includes flight tracking, weather updates, and airport information.

GitHub Repository: [AirHub Repository](https://github.com/tashelreddy/airhub)


https://www.flightradar24.com/

Introduction:
The proposed project aims to develop a live flight-tracking application that allows users to monitor individual flights worldwide. The application will not only display the current position of flights but also provide detailed information about their speed, altitude, and route progression. To enhance the user experience, we will integrate the Aviationstack API for flight data, an Airport Timetable API for real-time arrivals and departures, and Weather APIs to provide weather conditions along the flight routes.

APIs Integration:
https://aviationstack.com/
https://aviationstack.com/documentation

aviation stack API: A REST API service owned by apilayer. 
Purpose: The aviation-stack API will serve as the primary data source for flight information. It provides comprehensive data on flights, timetables, schedules, and airports. We will use this API to track the real-time location of planes, their routes, and associated details.
Integration: Utilizing the aviation-stack API, we can make HTTP GET URL structure for requests to retrieve data such as the current position of a specific flight, its speed, altitude, and other relevant information, responses will be retrieved in JSON format.

Code snippet:
{
    "pagination": {
        "limit": 100,
        "offset": 0,
        "count": 100,
        "total": 1669022
    },
    "data": [
        {
            "flight_date": "2019-12-12",
            "flight_status": "active",
            "departure": {
                "airport": "San Francisco International",
                "timezone": "America/Los_Angeles",
                "iata": "SFO",
                "icao": "KSFO",
                "terminal": "2",
                "gate": "D11",
                "delay": 13,
                "scheduled": "2019-12-12T04:20:00+00:00",
                "estimated": "2019-12-12T04:20:00+00:00",
                "actual": "2019-12-12T04:20:13+00:00",
                "estimated_runway": "2019-12-12T04:20:13+00:00",
                "actual_runway": "2019-12-12T04:20:13+00:00"
            },
            "arrival": {
                "airport": "Dallas/Fort Worth International",
                "timezone": "America/Chicago",
                "iata": "DFW",
                "icao": "KDFW",
                "terminal": "A",
                "gate": "A22",
                "baggage": "A17",
                "delay": 0,
                "scheduled": "2019-12-12T04:20:00+00:00",
                "estimated": "2019-12-12T04:20:00+00:00",
                "actual": null,}


airlab API: A REST API service owned by Airlabs, developed in 2017.
https://airlabs.co/docs/#docs_Key

Purpose: Airport Data API is fundamental to any travel-related business.
The airport API will allow us to display destination maps and display the necessary data on our website.
Integration: Utilizing the airlab API, we can make Requests to the REST API using HTTP requests, and the responses are provided in a lightweight JSON format.

Code snippet:
  [{"name": "Paris Charles de Gaulle Airport",
  "iata_code": "CDG",
  "icao_code": "LFPG",
  "lat": 49.009592,
  "lng": 2.555675,
  "alt": 392,
  "city": "Paris",
  "city_code": "PAR",
}]


openweather API: A REST API service owned by openweather, developed in 2014.
https://openweathermap.org/api/one-call-3
Purpose: To monitor real-time conditions at the location or request forecasts for them, both short-term and long-term forecasts are provided.
Integration: Utilizing the One Call API, we can make HTTP requests using JSON  to fetch weather data from our weather API, delivering real-time updates on current conditions, temperature, and forecasts.By presenting this information in a visually engaging manner, we aim to keep users informed and prepared for their travel plans.
Code snippet:
{
   "lat":33.44,
   "lon":-94.04,
   "timezone":"America/Chicago",
   "timezone_offset":-18000,
   "current":{
      "dt":1684929490,
      "sunrise":1684926645,
      "sunset":1684977332,
      "temp":292.55,
      "feels_like":292.87,
      "pressure":1014,
      "humidity":89,
      "dew_point":290.69,
      "uvi":0.16,
      "clouds":53,
      "visibility":10000,
      "wind_speed":3.13,
      "wind_deg":93,
      "wind_gust":6.71,
      "weather":[
         {
            "id":803,
            "main":"Clouds",
            "description":"broken clouds",
            "icon":"04d"
         }


Web Design:
Color Scheme: We will use a clean and professional color scheme with a combination of blue tones for a sense of reliability and trust, with touches of green or yellow to represent travel and aviation.
Header: A fixed header with a clear logo, navigation menu, and a search bar for users to input flight details.
Map Section: A prominent map displaying real-time flight positions, with interactive features for users to click on flights for more details.
Flight Details Panel: Include a side or bottom panel showing detailed information about the selected flight, including departure/arrival times, status, and a link to track the flight.
Weather Widget: We will incorporate a weather widget displaying current weather conditions along the flight route.

Bootstrap UI Integration:
 We will use Bootstrap's grid system and pre-designed components to craft a responsive and visually appealing layout. This ensures that our website not only looks great but also functions flawlessly across various devices and screen sizes providing consistency across all platforms.

jQuery Implementation:
With jQuery, we will enhance the interactivity and functionality of our website, enabling dynamic updates and seamless user interactions.
Through jQuery's event handling capabilities, we will fetch data from our APIs in real time, ensuring that users always have access to the latest information without the need for page reloads.

Summary:
Integration with Weather API: By integrating the Weather API, users can get real-time updates on weather conditions along their flight route. This helps travelers stay informed about potential weather-related delays or disruptions, allowing them to plan accordingly and stay safe.

Integration with Airport Timetable API: The Airport Timetable API provides users with access to comprehensive information about arrivals and departures at various airports. This allows travelers to check the status of their flights, as well as explore alternative options if needed. By combining this data with the Weather API, users can make informed decisions about their travel plans based on both flight schedules and weather conditions.

Integration with aviation stack API: With the Flight Schedule and Route API, users can access detailed information about flight schedules, routes, and statuses. This includes real-time tracking of flights, allowing travelers to monitor their journey from departure to arrival. By integrating this data with the Airport Timetable API and Weather API, users can have a complete picture of their travel itinerary, including any potential disruptions due to weather or changes in flight schedules.

