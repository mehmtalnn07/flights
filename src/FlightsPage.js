import React, { useState, useEffect } from 'react'; // React ve gerekli hook'ları içe aktarma
import airplaneNames from './airplaneNames'; // Uçak isimlerini içeren dosyayı içe aktarma

const FlightsPage = () => {
    const [flights, setFlights] = useState([]); // Uçuş verilerini tutmak için state oluşturma
  
    useEffect(() => {
      const fetchFlights = async () => { // Uçuş verilerini almak için asenkron fonksiyon
        try {
          const response = await fetch('http://localhost:3001/flights'); // API'den uçuş verilerini alma
          const data = await response.json(); // Yanıtı JSON formatında çözümleme
          setFlights(data); // State'i alınan verilerle güncelleme
        } catch (error) {
          console.error('Veri alınırken hata oluştu:', error); // Hata durumunda konsola hata mesajı yazdırma
        }
      };
  
      fetchFlights(); // Uçuş verilerini almak için fonksiyonu çağırma
    }, []); // Bu effect yalnızca bileşen ilk yüklendiğinde çalışır
  
    return (
      <div className="page-container"> {/* Ana sayfa konteyneri */}
        <h1>Uçuşlar</h1> {/* Sayfa başlığı */}
        <div className="filterrow"> {/* Filtre butonları için satır */}
          <button className="filterButton">Times</button> {/* Zaman filtre butonu */}
          <button className="filterButton">Stops</button> {/* Aktarma filtre butonu */}
          <button className="filterButton">Airlines</button> {/* Havayolu filtre butonu */}
          <button className="filterButton">Airports</button> {/* Havaalanı filtre butonu */}
          <button className="filterButton">Amenities</button> {/* İmkanlar filtre butonu */}
        </div>
        {flights.length > 0 ? ( // Eğer uçuş verisi varsa
          <div className="card-container"> {/* Uçuş kartları için konteyner */}
            {flights.map((flight, index) => { // Her uçuş verisi için bir kart oluşturma
              const departureDateTime = new Date(flight.scheduleDateTime); // Kalkış tarih ve saatini oluşturma
              const departureTime = departureDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Kalkış saatini formatlama
              const landingDateTime = new Date(flight.landingTime); // İniş tarih ve saatini oluşturma
              const landingTime = landingDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // İniş saatini formatlama
  
              // Havayolu ismini bul
              const airlineName = airplaneNames[flight.airlineCode] || flight.airlineCode; // Havayolu koduna göre ismi alma, yoksa kodu göster
  
              return (
                <div key={index} className="card"> {/* Her uçuş için kart oluşturma */}
                  <div className="column flight-card"> {/* Uçuş kartı içeriği */}
                    <div className="flight-times"> {/* Uçuş saatleri için bölüm */}
                      <p className="flight-info">{departureTime} - {landingTime}</p> {/* Kalkış ve iniş saatlerini gösterme */}
                    </div>
  
                    <div className="details-row"> {/* Uçuş detayları için satır */}
                      <div className="column airline-info"> {/* Havayolu bilgileri için sütun */}
                        <p className="airline-name">{airlineName} Airlines</p> {/* Havayolu ismini gösterme */}
                        <p className="flight-details">Flight Details</p> {/* Uçuş detayları metni */}
                      </div>
  
                      <div className="column flight-duration"> {/* Uçuş süresi için sütun */}
                        <p className="non-stop">Nonstop</p> {/* Aktarmasız uçuş bilgisi */}
                        <p>{flight.flightDuration || 'Bilinmiyor'}</p> {/* Uçuş süresi veya varsayılan 'Bilinmiyor' metni */}
                      </div>
  
                      <div className="column flight-airports"> {/* Havaalanları için sütun */}
                        <p>{flight.departureIATA} to {flight.arrivalIATA}</p> {/* Kalkış ve varış havaalanlarını gösterme */}
                        <p>{flight.prefixIATA} {flight.flightNumber}</p> {/* Uçuş numarasını gösterme */}
                      </div>
  
                      {/* Fiyat Çerçevesi */}
                      <div className="column flight-price"> {/* Uçuş fiyatı için sütun */}
                        <div className="price-box"> {/* Fiyat kutusu */}
                          <p className="price">${flight.price || 'Bilinmiyor'}</p> {/* Uçuş fiyatı veya varsayılan 'Bilinmiyor' metni */}
                          <p className="economy">Economy</p> {/* Ekonomi sınıfı metni */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Yükleniyor...</p> // Uçuş verileri henüz yüklenmediyse gösterilecek mesaj
        )}
      </div>
    );
};

export default FlightsPage; // Bileşeni dışa aktarma
