import React, { useState, useEffect } from 'react';
import airplaneNames from './airplaneNames';

const FlightsPage = () => {
    const [flights, setFlights] = useState([]);
  
    useEffect(() => {
      const fetchFlights = async () => {
        try {
          const response = await fetch('http://localhost:3001/flights');
          const data = await response.json();
          setFlights(data);
        } catch (error) {
          console.error('Veri alınırken hata oluştu:', error);
        }
      };
  
      fetchFlights();
    }, []);
  
    return (
      <div className="page-container">
        <h1>Uçuşlar</h1>
        <div class="filterrow">
          <button class="filterButton">Times</button>
          <button class="filterButton">Stops</button>
          <button class="filterButton">Airlines</button>
          <button class="filterButton">Airports</button>
          <button class="filterButton">Amenities</button>
        </div>
        {flights.length > 0 ? (
          <div className="card-container">
            {flights.map((flight, index) => {
              const departureDateTime = new Date(flight.scheduleDateTime);
              const departureTime = departureDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const landingDateTime = new Date(flight.landingTime);
              const landingTime = landingDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
              // Havayolu ismini bul
              const airlineName = airplaneNames[flight.airlineCode] || flight.airlineCode;
  
              return (
                <div key={index} className="card">
                  <div className="column flight-card">
                    <div className="flight-times">
                      <p className="flight-info">{departureTime} - {landingTime}</p>
                    </div>
  
                    <div className="details-row">
                      <div className="column airline-info">
                        <p className="airline-name">{airlineName} Airlines</p>
                        <p className="flight-details">Flight Details</p>
                      </div>
  
                      <div className="column flight-duration">
                        <p className="non-stop">Nonstop</p>
                        <p>{flight.flightDuration || 'Bilinmiyor'}</p> {/* Uçuş süresi için varsayılan değer */}
                      </div>
  
                      <div className="column flight-airports">
                        <p>{flight.departureIATA} to {flight.arrivalIATA}</p>
                        <p>{flight.prefixIATA} {flight.flightNumber}</p>
                      </div>
  
                      {/* Fiyat Çerçevesi */}
                      <div className="column flight-price">
                        <div className="price-box">
                          <p className="price">${flight.price || 'Bilinmiyor'}</p>
                          <p className="economy">Economy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Yükleniyor...</p>
        )}
      </div>
    );
  };

export default FlightsPage;