import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './FlightsPage.css'; 
import airportNames from './airportData';
import airplaneNames from './airplaneNames';

function HomePage() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
  
    const [tripType, setTripType] = useState('Round Trip');
  
    const fetchFlights = async (date) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/public-flights/flights', {
          headers: {
            'app_id': process.env.REACT_APP_API_ID,  
            'app_key': process.env.REACT_APP_API_KEY, 
            'ResourceVersion': 'v4',
            'Accept': 'application/json'
          },
          params: {
            scheduleDate: date,
            includedelays: false,
            page: 0,
            sort: '+scheduleTime'
          }
        });
    
        console.log('Uçuş verisi:', response.data);
        setFlights(response.data.flights);
      } catch (error) {
        console.error('Uçuş bilgilerini alırken bir hata oluştu:', error);
        setError('Verileri alırken bir hata oluştu.');
      }
      setLoading(false);
    };
  
    const navigate = useNavigate();
  
    const handleDateChange = (event) => {
      const selectedDate = event.target.value;
      setSelectedDate(selectedDate);
      if (selectedDate) {
        fetchFlights(selectedDate);
      }
    };
  
    const calculateFlightDuration = (departureTime, landingTime) => {
      const departureDate = new Date(departureTime);
      const landingDate = new Date(landingTime);
  
      const durationMs = landingDate - departureDate;
      const durationMinutes = Math.floor(durationMs / (1000 * 60));
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
  
      return `${-hours} saat ${minutes} dakika`;
    };
  
    const handleBookFlight = async (flight) => {
      try {
        const response = await axios.post('http://localhost:3001/book-flight', {
          departureIATA: flight.route?.destinations[0],
          arrivalIATA: flight.route?.destinations[1],
          airlineCode: flight.prefixIATA,
          scheduleDateTime: flight.scheduleDateTime,
          landingTime: flight.actualLandingTime || flight.estimatedLandingTime,
          flightDuration: calculateFlightDuration(flight.scheduleDateTime, flight.actualLandingTime || flight.estimatedLandingTime),
          price: 125,
          flightName: flight.flightName,
          flightNumber: flight.flightNumber,
          prefixIATA: flight.prefixIATA
        });
        console.log('Uçuş verisi:', response.data || 'No data');
        alert(response.data);
      } catch (error) {
        console.error('Uçuşu kaydederken hata:', error.response ? error.response.data : error);
        alert('Uçuş kaydedilemedi.');
      }
    };
  
    return (
      <div className="container">
        <div class="firstRow">
          <div class="firstRowFirst">
            <img src="plane-airport.svg" alt="plane icon" class="planeicon"></img>
            <p>Plane Scape</p>
          </div>
          <div class="firstRowSecond">
            <img src="deal.svg" alt="deal icon" class="dealicon"></img>
            <p>Deals</p>
            <img src="globe.svg" alt="globe icon" class="dealicon"></img>
            <p class="clickable-text" onClick={() => navigate('/flights')}>Uçuşlarım</p>
  
            <img src="user.svg" alt="user icon" class="dealicon"></img>
            <p>Mehmet ALAN</p>
          </div>
        </div>
        <div class="firstColumn">
          <div class="searchContentRow">
            <div class="titleRow">
              <img src="plane.svg" alt="plane icon" class="planeicon"></img>
              <p>Book Your Flight</p>
            </div>
            <div className="button-group">
              <button
                className={`buttonselected round-trip ${tripType === 'Round Trip' ? 'active' : ''}`}
                onClick={() => setTripType('Round Trip')}
              >
                Round Trip
              </button>
              <button
                className={`buttonselected one-way ${tripType === 'One Way' ? 'active' : ''}`}
                onClick={() => setTripType('One Way')}
              >
                One Way
              </button>
            </div>
          </div>
          <div class="inputRow">
            <div class="location-input">
              <label for="departure"></label>
              <input type="text" id="departure" name="departure" placeholder="Kalkış Yeri"></input>
            </div>
            <div class="location-input">
              <label for="arrival"></label>
              <input type="text" id="arrival" name="arrival" placeholder="Varış Yeri"></input>
            </div>
            <div class="location-input">
              <input
                  type='date'
                  id="flight-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  aria-placeholder="Gidiş Tarihi"
              />
            </div>
            <div class="location-input">
              <input
                  type="date"
                  id="flight-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  aria-placeholder="Gidiş Tarihi"
              />
            </div>
          </div>
          <div class="showFlights">
          <button class="showflights">Show Flights</button>
          </div>
        </div>
  
        {loading && <div>Uçuş bilgileri yükleniyor...</div>}
        {error && <div>{error}</div>}
  
        {!loading && !error && flights.length > 0 && (
          <div className="flight-cards">
            {flights.map((flight) => (
              <div className="flight-cards">
              {flights.map((flight) => {
                const departureIATA = flight.route?.destinations[0];
                const arrivalIATA = flight.route?.destinations[1];
                const airlineCode = flight.prefixIATA;
                const departureTime = flight.scheduleDateTime;
                const landingTime = flight.actualLandingTime || flight.estimatedLandingTime;
                const flightDuration = calculateFlightDuration(departureTime, landingTime);
  
    
    
                return (
                  <div className="flight-card" key={flight.id}>
                    <div class = "cardColumn">
                      <p class = "citiesName">
                      {departureIATA 
                        ? `${airportNames[departureIATA]?.city || 'Kalkış Bilinmiyor'}` 
                        : 'Kalkış Bilinmiyor'}
                      {arrivalIATA 
                        ? ` - ${airportNames[arrivalIATA]?.city || 'Varış Bilinmiyor'}` 
                        : ' - Varış Bilgisi Yok'}
                      </p>
                      <div class = "cardRow">
                        <div class = "departureColumn">
                          <div class = "departureRow">
                            <img src='departure.svg' alt="departure icon" class = "departureicon"></img>
                            <p>Kalkış</p>
                          </div>
                          <div class="flyTime">
                            <strong>{new Date(flight.scheduleDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                          </div>
                          <div class="airlineName">
                            <p><strong>Havayolu: </strong> {airplaneNames[airlineCode] || 'Bilinmiyor'}</p>
                          </div>
                        </div>
                        <div class="divider"></div>
                        <div class="planeColumn">
                          <p><strong>{airplaneNames[airlineCode]}</strong></p>
                          <img src="airplane.svg" alt="airplaneicon" class="airplaneicon"></img>
                          <p>{flightDuration}</p>
                          <p>(Nonstop)</p>
                        </div>
                        <div class="divider"></div>
                        <div class="arrivalColumn">
                          <div class="arrivalRow">
                            <img src="arrival.svg" alt="arrivalicon" class="arrivalicon"></img>
                            <p>Varış</p>
                          </div>
                          <div class="flyTime">
                            <strong>{new Date(flight.actualLandingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                          </div>
                          <div class="airlineName">
                            <p><strong>Havayolu: </strong> {airplaneNames[airlineCode] || 'Bilinmiyor'}</p>
                          </div>
                        </div>
                      </div>
                      <div class="priceRow">
                        <div class="price">
                          <p class="pricetext">Price: $125</p>
                          <p class="traveltype">{tripType}</p>
                        </div>
                        <button class="button" onClick={() => handleBookFlight(flight)}>Book Flight</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            ))}
          </div>
        )}
  
        {!loading && !error && flights.length === 0 && selectedDate && (
          <div>Seçilen tarihte uçuş bulunamadı.</div>
        )}
      </div>
  
    );
}

export default HomePage;
