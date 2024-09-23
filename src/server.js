const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// MongoDB bağlantısı
const mongoURI = 'mongodb+srv://airplaneuser:airplaneuser@airplaneuser.9cjep.mongodb.net/airplanedatabase?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch(err => console.error('MongoDB bağlantısı hatası:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Uçuş Modeli
const flightSchema = new mongoose.Schema({
  departureIATA: String,
  arrivalIATA: String,
  airlineCode: String,
  scheduleDateTime: Date,
  landingTime: Date,
  flightDuration: String,
  price: Number,
  flightName: String,
  flightNumber: Number,
  prefixIATA: String
});

const Flight = mongoose.model('Flight', flightSchema);

// Uçuş Kaydetme API
app.post('/book-flight', async (req, res) => {
  try {
    const flightData = new Flight(req.body);
    await flightData.save();
    res.status(201).send('Uçuş başarıyla kaydedildi!');
  } catch (error) {
    res.status(500).send('Uçuş kaydedilirken hata oluştu: ' + error.message);
  }
});

// **Tüm Uçuşları Getirme API'si**
app.get('/flights', async (req, res) => {
  try {
    const flights = await Flight.find(); // Veritabanındaki tüm uçuşları çek
    res.status(200).json(flights); // Uçuşları JSON formatında gönder
  } catch (error) {
    res.status(500).send('Uçuşlar alınırken hata oluştu: ' + error.message);
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
