const express = require('express'); // Express modülünü projeye dahil et
const mongoose = require('mongoose'); // Mongoose modülünü projeye dahil et
const bodyParser = require('body-parser'); // HTTP istek gövdesini işlemek için body-parser modülünü dahil et
const cors = require('cors'); // CORS sorunlarını çözmek için cors modülünü dahil et

const app = express(); // Yeni bir Express uygulaması oluştur
const PORT = 3001; // Sunucunun dinleyeceği port numarasını tanımla

// MongoDB bağlantısı
const mongoURI = 'mongodb+srv://airplaneuser:airplaneuser@airplaneuser.9cjep.mongodb.net/airplanedatabase?retryWrites=true&w=majority'; // MongoDB için bağlantı URI'si
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }) // MongoDB'ye bağlan
  .then(() => console.log('MongoDB bağlantısı başarılı!')) // Bağlantı başarılıysa mesaj yazdır
  .catch(err => console.error('MongoDB bağlantısı hatası:', err)); // Bağlantı hatası durumunda hata mesajı yazdır

// Middleware
app.use(cors()); // CORS middleware'ini kullan
app.use(bodyParser.json()); // JSON formatındaki istek gövdesini parse et

// Uçuş Modeli
const flightSchema = new mongoose.Schema({ // Mongoose için uçuş şemasını tanımla
  departureIATA: String, // Kalkış havalimanı IATA kodu
  arrivalIATA: String, // Varış havalimanı IATA kodu
  airlineCode: String, // Havayolu kodu
  scheduleDateTime: Date, // Planlanan kalkış tarihi ve saati
  landingTime: Date, // İniş tarihi ve saati
  flightDuration: String, // Uçuş süresi
  price: Number, // Uçuş fiyatı
  flightName: String, // Uçuş adı
  flightNumber: Number, // Uçuş numarası
  prefixIATA: String // Havayolu için ön ek IATA kodu
});

const Flight = mongoose.model('Flight', flightSchema); // Uçuş modelini tanımla

// Uçuş Kaydetme API
app.post('/book-flight', async (req, res) => { // "/book-flight" endpoint'ine gelen POST isteklerini işle
  try {
    const flightData = new Flight(req.body); // İstek gövdesinden yeni bir uçuş nesnesi oluştur
    await flightData.save(); // Uçuş nesnesini veritabanına kaydet
    res.status(201).send('Uçuş başarıyla kaydedildi!'); // Başarılı kaydetme mesajı gönder
  } catch (error) {
    res.status(500).send('Uçuş kaydedilirken hata oluştu: ' + error.message); // Hata durumunda hata mesajı gönder
  }
});

// **Tüm Uçuşları Getirme API'si**
app.get('/flights', async (req, res) => { // "/flights" endpoint'ine gelen GET isteklerini işle
  try {
    const flights = await Flight.find(); // Veritabanındaki tüm uçuşları çek
    res.status(200).json(flights); // Uçuşları JSON formatında gönder
  } catch (error) {
    res.status(500).send('Uçuşlar alınırken hata oluştu: ' + error.message); // Hata durumunda hata mesajı gönder
  }
});

// Sunucuyu başlat
app.listen(PORT, () => { // Sunucuyu belirtilen portta dinlemeye başla
  console.log(`Sunucu ${PORT} portunda çalışıyor...`); // Sunucu çalıştığında mesaj yazdır
});
