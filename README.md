# DUBES - Diagnostik untuk Bugar, Energik, dan Sehat

DUBES (Diagnostik untuk Bugar, Energik, dan Sehat) adalah platform yang dirancang untuk menilai dan memantau kondisi fisik dan mental melalui serangkaian tes. Platform ini membantu individu memahami status kesehatan mereka dan memberikan informasi relevan mengenai faktor-faktor yang memengaruhi kesejahteraan secara keseluruhan.

## Fitur

- **Tes Body Score Interaktif**: Pengguna dapat mengikuti tes untuk mengevaluasi kondisi fisik dan mental mereka.
- **Timeline Sejarah Proyek**: Website ini mencakup timeline yang menggambarkan tonggak penting dalam pengembangan website.
- **Desain Responsif**: Website ini sepenuhnya responsif dan dioptimalkan untuk berbagai ukuran layar.
- **Animasi Halus**: GSAP (GreenSock Animation Platform) digunakan untuk animasi halus dan efek yang dipicu oleh scroll.
- **Navigasi**: Website ini dilengkapi dengan Navbar untuk memudahkan navigasi antar bagian.

## Bagian-Bagian

- **Hero Section**: Area penyambutan yang menjelaskan tujuan DUBES dengan tombol ajakan bertindak.
- **Timeline Section**: Menjelaskan tonggak-tonggak pengembangan proyek.
- **Call to Action Section**: Mengajak pengguna untuk mengikuti tes guna mengevaluasi kesehatan mereka.
- **Footer**: Menyediakan informasi kontak, tautan cepat, dan tautan media sosial.

## Teknologi yang Digunakan

- **React**: Untuk membangun antarmuka pengguna.
- **Next.js**: Untuk rendering sisi server dan routing.
- **Tailwind CSS**: Untuk styling CSS dengan pendekatan utility-first.
- **GSAP**: Untuk animasi halus dan efek yang dipicu oleh scroll.
- **TypeScript**: Untuk memastikan keamanan tipe data.
- **MongoDB**: Sebagai media penyimpan data.
- **Open Weather**: Sebagai media informasi mengenai kualitas udara dan cuaca.
- **Google Gemini API**: Sebagai AI yang berfungsi sebagai generative ai untuk evaluasi hasil dari data body-score-test

## Cara Memulai

Untuk menjalankan proyek ini secara lokal:

1. Clone repository ini:

   ```bash
   git clone https://github.com/WillisRH/DUBES.git
   ```
2. Navigasi ke tempat dimana kamu mendownloadnya:
   ```bash
   cd DUBES
   ```
3. Install dependensi yang dibutuhkan:
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   npm run dev
   ```
5. Buka website di:
   ```bash
   http://localhost:3000
   ```

## Konfigurasi .env

Edit sesuai API key yang kalian punya, penuhi format berikut yang telah di sediakan di .env.example:
  
  ```bash
  NEXT_PUBLIC_OPENWEATHER_API_KEY= # Masukkan openweather api key disini (String)
NEXT_PUBLIC_GEMINI_API_KEY= # Masukkan gemini api key disini (String)
MONGODB_URI= # Masukkan connection string mongodb kamu (String)
TOKEN_SECRET= # Masukkan random string disini (String)
NEXT_PUBLIC_DEFAULT_USERNAME=admindubes
NEXT_PUBLIC_DEFAULT_EMAIL=admindubes@lapor.sman12
NEXT_PUBLIC_DEFAULT_PASSWORD=admin1234&
```

