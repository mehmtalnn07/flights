import React, { useState } from 'react'; // React kütüphanesinden useState hook'unu içe aktar
import axios from 'axios'; // Axios kütüphanesini içe aktar (HTTP istekleri için)
import { useNavigate } from 'react-router-dom'; // React Router'dan gezinme için useNavigate hook'unu içe aktar
import './App.css'; // Uygulama için CSS dosyası
import './FlightsPage.css'; // Uçuş sayfası için CSS dosyası
import airportNames from './airportData'; // Havalimanı isimleri verisi
import airplaneNames from './airplaneNames'; // Uçak isimleri verisi

function HomePage() {
    const [flights, setFlights] = useState([]); // Uçuş verilerini tutmak için state
    const [loading, setLoading] = useState(false); // Yükleniyor durumunu tutmak için state
    const [error, setError] = useState(null); // Hata durumunu tutmak için state
    const [selectedDate, setSelectedDate] = useState(''); // Seçilen tarihi tutmak için state
  
    const [tripType, setTripType] = useState('Round Trip'); // Seyahat türünü tutmak için state
  
    // Uçuş verilerini API'den almak için fonksiyon
    const fetchFlights = async (date) => {
      setLoading(true); // Yükleniyor durumunu true yap
      setError(null); // Hata durumunu sıfırla
      try {
        // API'den uçuş verilerini al
        const response = await axios.get('/public-flights/flights', {
          headers: {
            'app_id': process.env.REACT_APP_API_ID,  // API kimlik bilgileri
            'app_key': process.env.REACT_APP_API_KEY, // API anahtarı
            'ResourceVersion': 'v4',
            'Accept': 'application/json' // JSON formatında yanıt bekliyoruz
          },
          params: {
            scheduleDate: date, // Tarih parametresi
            includedelays: false,
            page: 0,
            sort: '+scheduleTime' // Uçuşları zamanına göre sırala
          }
        });
    
        console.log('Uçuş verisi:', response.data); // Uçuş verisini konsola yazdır
        setFlights(response.data.flights); // Uçuş verilerini state'e ata
      } catch (error) {
        console.error('Uçuş bilgilerini alırken bir hata oluştu:', error); // Hata mesajını konsola yazdır
        setError('Verileri alırken bir hata oluştu.'); // Hata mesajını state'e ata
      }
      setLoading(false); // Yükleniyor durumunu false yap
    };
  
    const navigate = useNavigate(); // Gezinme fonksiyonunu al
  
    // Tarih değiştiğinde çağrılan fonksiyon
    const handleDateChange = (event) => {
      const selectedDate = event.target.value; // Seçilen tarihi al
      setSelectedDate(selectedDate); // State'e ata
      if (selectedDate) {
        fetchFlights(selectedDate); // Tarih seçildiyse uçuşları al
      }
    };
  
    // Uçuş süresini hesaplayan fonksiyon
    const calculateFlightDuration = (departureTime, landingTime) => {
      const departureDate = new Date(departureTime); // Kalkış zamanını Date nesnesine çevir
      const landingDate = new Date(landingTime); // Varış zamanını Date nesnesine çevir
  
      const durationMs = landingDate - departureDate; // Süreyi milisaniye cinsinden hesapla
      const durationMinutes = Math.floor(durationMs / (1000 * 60)); // Süreyi dakika cinsine çevir
      const hours = Math.floor(durationMinutes / 60); // Saat cinsinden hesapla
      const minutes = durationMinutes % 60; // Dakikaları hesapla
  
      return `${-hours} saat ${minutes} dakika`; // Süreyi döndür
    };
  
    // Uçuşu rezerve etmek için fonksiyon
    const handleBookFlight = async (flight) => {
      try {
        const response = await axios.post('http://localhost:3001/book-flight', { // Uçuş rezervasyonu için API çağrısı
          departureIATA: flight.route?.destinations[0], // Kalkış IATA kodu
          arrivalIATA: flight.route?.destinations[1], // Varış IATA kodu
          airlineCode: flight.prefixIATA, // Havayolu kodu
          scheduleDateTime: flight.scheduleDateTime, // Kalkış tarihi ve saati
          landingTime: flight.actualLandingTime || flight.estimatedLandingTime, // Varış zamanı
          flightDuration: calculateFlightDuration(flight.scheduleDateTime, flight.actualLandingTime || flight.estimatedLandingTime), // Uçuş süresi
          price: 125, // Uçuş fiyatı
          flightName: flight.flightName, // Uçuş adı
          flightNumber: flight.flightNumber, // Uçuş numarası
          prefixIATA: flight.prefixIATA // Havayolu prefixi
        });
        console.log('Uçuş verisi:', response.data || 'No data'); // Yanıtı konsola yazdır
        alert(response.data); // Kullanıcıya yanıtı göster
      } catch (error) {
        console.error('Uçuşu kaydederken hata:', error.response ? error.response.data : error); // Hata mesajını konsola yazdır
        alert('Uçuş kaydedilemedi.'); // Hata mesajını kullanıcıya göster
      }
    };
  
    return (
      <div className="container"> {/* Ana konteyner */}
        <div className="firstRow"> {/* İlk satır */}
          <div className="firstRowFirst"> {/* İlk satırın ilk bölümü */}
            <img src="plane-airport.svg" alt="plane icon" className="planeicon" /> {/* Uçak simgesi */}
            <p>Plane Scape</p> {/* Başlık */}
          </div>
          <div className="firstRowSecond"> {/* İlk satırın ikinci bölümü */}
            <img src="deal.svg" alt="deal icon" className="dealicon" /> {/* Teklif simgesi */}
            <p>Deals</p>
            <img src="globe.svg" alt="globe icon" className="dealicon" /> {/* Dünya simgesi */}
            <p className="clickable-text" onClick={() => navigate('/flights')}>Uçuşlarım</p> {/* Uçuşlar sayfasına git */}
  
            <img src="user.svg" alt="user icon" className="dealicon" /> {/* Kullanıcı simgesi */}
            <p>Mehmet ALAN</p> {/* Kullanıcı adı */}
          </div>
        </div>
        <div className="firstColumn"> {/* İlk sütun */}
          <div className="searchContentRow"> {/* Arama içeriği satırı */}
            <div className="titleRow"> {/* Başlık satırı */}
              <img src="plane.svg" alt="plane icon" className="planeicon" /> {/* Uçak simgesi */}
              <p>Book Your Flight</p> {/* Başlık */}
            </div>
            <div className="button-group"> {/* Buton grubu */}
              <button
                className={`buttonselected round-trip ${tripType === 'Round Trip' ? 'active' : ''}`} // Gidiş-dönüş butonu
                onClick={() => setTripType('Round Trip')}
              >
                Round Trip
              </button>
              <button
                className={`buttonselected one-way ${tripType === 'One Way' ? 'active' : ''}`} // Tek yön butonu
                onClick={() => setTripType('One Way')}
              >
                One Way
              </button>
            </div>
          </div>
          <div className="inputRow"> {/* Girdi satırı */}
            <div className="location-input"> {/* Kalkış yeri girişi */}
              <label htmlFor="departure"></label>
              <input type="text" id="departure" name="departure" placeholder="Kalkış Yeri" /> {/* Kalkış yeri input'u */}
            </div>
            <div className="location-input"> {/* Varış yeri girişi */}
              <label htmlFor="arrival"></label>
              <input type="text" id="arrival" name="arrival" placeholder="Varış Yeri" /> {/* Varış yeri input'u */}
            </div>
            <div className="location-input"> {/* Gidiş tarihi girişi */}
              <input
                  type='date'
                  id="flight-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  aria-placeholder="Gidiş Tarihi" // Erişim için açıklayıcı metin
              />
            </div>
            <div className="location-input"> {/* Gidiş tarihi girişi tekrar */}
              <input
                  type="date"
                  id="flight-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  aria-placeholder="Dönüş Tarihi" // Erişim için açıklayıcı metin
              />
            </div>
            <button type="submit" className="search-button">Search</button> {/* Ara butonu */}
          </div>
        </div>
        <div className="search-results"> {/* Arama sonuçları bölümü */}
          {loading && <p>Yükleniyor...</p>} {/* Yükleniyorsa mesaj */}
          {error && <p>{error}</p>} {/* Hata mesajı varsa göster */}
          {flights.map((flight) => ( // Uçuşları döngü ile listele
            <div key={flight.flightNumber} className="flight-card"> {/* Her uçuş için kart */}
              <h3>{flight.flightName}</h3> {/* Uçuş adı */}
              <p>{flight.scheduleDateTime}</p> {/* Kalkış zamanı */}
              <p>{flight.prefixIATA}</p> {/* Havayolu kodu */}
              <p>{flight.flightNumber}</p> {/* Uçuş numarası */}
              <p>{flight.route?.destinations.join(' - ')}</p> {/* Kalkış ve varış yerleri */}
              <p>{calculateFlightDuration(flight.scheduleDateTime, flight.actualLandingTime || flight.estimatedLandingTime)}</p> {/* Uçuş süresi */}
              <button onClick={() => handleBookFlight(flight)}>Rezerve Et</button> {/* Rezervasyon butonu */}
            </div>
          ))}
        </div>
      </div>
    );
}
  
export default HomePage; // HomePage bileşenini dışa aktar
