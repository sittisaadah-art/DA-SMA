import { QuestionPG, QuestionEssay } from '../types/assessment';

export const EXAM_DURATION_MINUTES = 60;
export const MAX_TAB_VIOLATIONS = 3; // > 3x (or reaching 4th) triggers lock

export const QUESTIONS_PG: QuestionPG[] = [
  {
    id: 1,
    number: 1,
    topic: 'Web Scraping (BeautifulSoup)',
    sourceText:
      'Sekelompok murid melakukan proyek untuk mengumpulkan data harga laptop dari beberapa toko daring. Mereka menggunakan program Python berikut untuk mengambil data dari halaman web.',
    codeSnippet: `import requests
from bs4 import BeautifulSoup

url = "https://example.com/laptop"
page = requests.get(url)
soup = BeautifulSoup(page.text, "html.parser")

harga = soup.find_all("span", class_="price")

for h in harga:
    print(h.text)`,
    question:
      'Berdasarkan kegiatan dan kode program di atas, tujuan utama penggunaan pustaka BeautifulSoup adalah ....',
    options: [
      { key: 'A', text: 'Mengubah tampilan dan tata letak halaman web toko daring' },
      { key: 'B', text: 'Mengunduh seluruh file video dan gambar dari server web' },
      { key: 'C', text: 'Menyimpan data hasil penarikan langsung ke dalam database terenkripsi' },
      { key: 'D', text: 'Mempercepat kecepatan transfer bandwidth koneksi internet' },
      { key: 'E', text: 'Membaca dan memproses (parsing) struktur dokumen HTML halaman web' },
    ],
    correctAnswer: 'E',
    explanation:
      'BeautifulSoup adalah pustaka Python yang khusus dibuat untuk melakukan parsing terhadap dokumen HTML dan XML, sehingga memudahkan pemrogram mencari dan mengekstrak tag atau class tertentu seperti <span class="price">.',
    points: 6,
  },
  {
    id: 2,
    number: 2,
    topic: 'Web Scraping (Pustaka Requests)',
    sourceText:
      'Perhatikan kembali potongan kode: page = requests.get(url)',
    question:
      'Fungsi dari baris instruksi "requests.get(url)" pada skrip Python pengambilan data web tersebut adalah ....',
    options: [
      { key: 'A', text: 'Mengirimkan permintaan HTTP GET ke server untuk mengambil konten halaman web' },
      { key: 'B', text: 'Menghapus tag HTML yang tidak diinginkan dari memori komputer' },
      { key: 'C', text: 'Mencetak teks harga ke layar konsol secara berulang' },
      { key: 'D', text: 'Menguji apakah laptop yang dicari masih memiliki stok di gudang' },
      { key: 'E', text: 'Membuat file spreadsheet baru di komputer pengguna' },
    ],
    correctAnswer: 'A',
    explanation:
      'Pustaka requests dengan fungsi get(url) mengirimkan HTTP GET request ke alamat URL tujuan untuk mengunduh kode HTML mentah yang kemudian diolah oleh parser BeautifulSoup.',
    points: 6,
  },
  {
    id: 3,
    number: 3,
    topic: 'Karakteristik Web Scraping',
    question:
      'Manakah pernyataan yang paling tepat menunjukkan esensi dan karakteristik proses web scraping pada program di atas?',
    options: [
      { key: 'A', text: 'Pengambilan data dilakukan secara manual oleh manusia melalui tombol salin-tempel' },
      { key: 'B', text: 'Program membaca struktur HTML dan mengambil data spesifik secara otomatis' },
      { key: 'C', text: 'Program menghapus data harga dari server penyedia toko daring' },
      { key: 'D', text: 'Program melakukan peretasan terhadap sistem keamanan situs e-commerce' },
      { key: 'E', text: 'Program hanya dapat dijalankan jika pemilik web memberikan akses root server' },
    ],
    correctAnswer: 'B',
    explanation:
      'Web scraping adalah proses otomatisasi pengambilan informasi terstruktur dari dokumen HTML situs web secara terprogram tanpa intervensi manual klik salin-tempel.',
    points: 6,
  },
  {
    id: 4,
    number: 4,
    topic: 'Verifikasi Informasi & Evaluasi Kredibilitas',
    sourceText:
      'Dani menemukan sebuah artikel viral di media sosial yang menyatakan bahwa suatu minuman herbal dapat meningkatkan daya ingat secara drastis. Artikel tersebut tidak mencantumkan sumber penelitian yang jelas. Kemudian, Dani membuka beberapa situs kesehatan lain dan menemukan bahwa klaim tersebut belum didukung oleh penelitian ilmiah.',
    question:
      'Tindakan Dani membuka beberapa situs kesehatan lain sebelum memercayai informasi menunjukkan bahwa ia ....',
    options: [
      { key: 'A', text: 'Menggunakan mesin pencari tanpa membaca dan memahami informasi' },
      { key: 'B', text: 'Menyimpan seluruh artikel dari internet tanpa melakukan evaluasi' },
      { key: 'C', text: 'Membandingkan informasi dari berbagai sumber terpercaya (uji silang data)' },
      { key: 'D', text: 'Mengunduh seluruh artikel ilmiah yang ditemukan ke harddisk' },
      { key: 'E', text: 'Membagikan artikel viral ke grup obrolan sebelum membaca konfirmasi ilmiah' },
    ],
    correctAnswer: 'C',
    explanation:
      'Dani menerapkan sikap kritis literasi digital dengan melakukan uji silang informasi (cross-checking) ke beberapa sumber independen untuk mengonfirmasi kebenaran klaim kesehatan tersebut.',
    points: 6,
  },
  {
    id: 5,
    number: 5,
    topic: 'Teknik Membaca Lateral (Lateral Reading)',
    question:
      'Metode evaluasi fakta di mana pengguna membuka tab-tab baru di browser untuk memeriksa reputasi lembaga, penulis, dan konsensus pakar luar dikenal sebagai ....',
    options: [
      { key: 'A', text: 'Vertical Reading (Membaca Vertikal)' },
      { key: 'B', text: 'Lateral Reading (Membaca Lateral)' },
      { key: 'C', text: 'Skimming and Scanning Text' },
      { key: 'D', text: 'Deep Web Crawling' },
      { key: 'E', text: 'Speed Reading Technique' },
    ],
    correctAnswer: 'B',
    explanation:
      'Lateral Reading (Membaca Lateral) adalah teknik verifikasi di mana kita keluar dari situs yang sedang dibaca dan membuka tab lain untuk melihat apa yang dikatakan sumber-sumber kredibel lain mengenai situs/klaim tersebut.',
    points: 6,
  },
  {
    id: 6,
    number: 6,
    topic: 'CRAAP Test: Aspek Accuracy',
    sourceText:
      'Pada teks kasus Dani, artikel minuman herbal yang viral "tidak mencantumkan sumber penelitian yang jelas dan klaimnya belum didukung penelitian ilmiah".',
    question:
      'Berdasarkan kerangka CRAAP Test, aspek evaluasi yang paling nyata dilanggar oleh artikel minuman herbal tersebut adalah ....',
    options: [
      { key: 'A', text: 'Relevance (Kesesuaian isi dengan kebutuhan pembaca)' },
      { key: 'B', text: 'Currency (Kebaruan tanggal artikel)' },
      { key: 'C', text: 'Accuracy (Ketepatan fakta dan bukti pendukung ilmiah)' },
      { key: 'D', text: 'Purpose (Tujuan komersial artikel)' },
      { key: 'E', text: 'Typo / Kesalahan tata bahasa' },
    ],
    correctAnswer: 'C',
    explanation:
      'Aspek Accuracy (Akurasi) menuntut adanya bukti ilmiah, data yang dapat dipertanggungjawabkan, serta rujukan referensi yang valid dan dapat diverifikasi secara bebas oleh pihak luar.',
    points: 6,
  },
  {
    id: 7,
    number: 7,
    topic: 'CRAAP Test: Aspek Currency',
    sourceText:
      'Sebuah artikel teknologi tentang kecerdasan buatan dipublikasikan pada 2010, tetapi kembali dibagikan di media sosial pada 2024 tanpa pembaruan informasi.',
    question:
      'Aspek CRAAP Test yang paling berkaitan langsung dengan situasi kelemahan informasi pada teks di atas adalah ....',
    options: [
      { key: 'A', text: 'Purpose' },
      { key: 'B', text: 'Currency' },
      { key: 'C', text: 'Accuracy' },
      { key: 'D', text: 'Authority' },
      { key: 'E', text: 'Relevance' },
    ],
    correctAnswer: 'B',
    explanation:
      'Currency (Kebaruan Waktu) memeriksa kapan informasi dipublikasikan atau diperbarui. Artikel teknologi tahun 2010 sudah sangat usang (out-of-date) bila dibagikan pada 2024 tanpa pembaruan.',
    points: 6,
  },
  {
    id: 8,
    number: 8,
    topic: 'Pencarian Visual Berbasis Gambar',
    sourceText:
      'Seorang murid menggunakan aplikasi Google Lens untuk memindai foto sebuah bangunan bersejarah. Aplikasi tersebut kemudian mengenali bentuk fisik dan menampilkan nama bangunan beserta sejarah pendiriannya.',
    question:
      'Kasus penggunaan Google Lens tersebut menunjukkan bahwa di era digital, penelusuran informasi dapat dilakukan dengan ....',
    options: [
      { key: 'A', text: 'Hanya mengandalkan ketikan kata kunci teks pada kotak pencari' },
      { key: 'B', text: 'Membaca seluruh dokumen PDF secara manual tanpa bantuan aplikasi' },
      { key: 'C', text: 'Mengunduh seluruh isi basis data situs web' },
      { key: 'D', text: 'Menyalin teks komentar warganet di media sosial' },
      { key: 'E', text: 'Memanfaatkan teknologi pencarian visual berbasis pengenalan gambar (visual search)' },
    ],
    correctAnswer: 'E',
    explanation:
      'Google Lens menerapkan teknologi Computer Vision dan AI untuk mengenali fitur visual pada gambar foto dan mencocokkannya dengan basis data informasi di internet secara instan.',
    points: 6,
  },
  {
    id: 9,
    number: 9,
    topic: 'Ekosistem Periksa Fakta',
    question:
      'Dalam ekosistem periksa fakta dan informasi digital, peran yang paling tepat bagi seorang "Pemeriksa Fakta (Fact-Checker)" adalah ....',
    options: [
      { key: 'A', text: 'Membuat narasi clickbait untuk meningkatkan tayangan artikel' },
      { key: 'B', text: 'Melakukan verifikasi, pengujian klaim, dan penelusuran bukti terhadap klaim yang beredar' },
      { key: 'C', text: 'Meneruskan pesan berantai ke kontak tanpa membaca sumbernya' },
      { key: 'D', text: 'Mengambil alih akun pengguna yang menyebarkan pendapat' },
      { key: 'E', text: 'Menghindari pemeriksaan jika berita tersebut sedang viral' },
    ],
    correctAnswer: 'B',
    explanation:
      'Pemeriksa fakta (Fact-Checker) bertugas melakukan investigasi independen, menelusuri sumber primer, membandingkan bukti, dan memberikan klarifikasi publik mengenai kebenaran suatu klaim.',
    points: 6,
  },
  {
    id: 10,
    number: 10,
    topic: 'Validitas Data dan Sumber Informasi',
    question:
      'Pernyataan yang paling tepat dan bernalar kritis terkait validitas data dan sumber informasi di internet adalah ....',
    options: [
      { key: 'A', text: 'Informasi yang paling viral di media sosial dapat dipastikan 100% valid' },
      { key: 'B', text: 'Sumber informasi ilmiah tidak perlu mencantumkan identitas penulis dan tahun terbit' },
      { key: 'C', text: 'Semua informasi yang muncul pada hasil pencarian pertama Google pasti akurat' },
      { key: 'D', text: 'Data yang valid biasanya didukung oleh metode rujukan primer yang dapat diverifikasi' },
      { key: 'E', text: 'Cukup membaca judul artikel saja untuk menyimpulkan kebenaran suatu peristiwa' },
    ],
    correctAnswer: 'D',
    explanation:
      'Validitas data digital ditandai oleh ketersediaan sumber primer, metode yang transparan, integritas penulis, serta kemungkinan untuk diverifikasi ulang oleh pihak lain.',
    points: 6,
  },
];

export const QUESTIONS_ESSAY: QuestionEssay[] = [
  {
    id: 1,
    number: 1,
    topic: 'Web Scraping: Requests & BeautifulSoup',
    context:
      'Dalam dunia digital, data dapat dikumpulkan secara otomatis melalui teknik web scraping menggunakan bahasa pemrograman Python.',
    question:
      'Jelaskan perbedaan fungsi pustaka "requests" dan "BeautifulSoup" dalam kode web scraping pada materi, serta jelaskan langkah-langkah alur eksekusi kodenya hingga menghasilkan data teks harga!',
    points: 8,
    rubricGuide:
      'Jawaban harus menjelaskan: (1) Fungsi requests untuk mengambil halaman web / HTTP GET, (2) Fungsi BeautifulSoup untuk mem-parsing struktur dokumen HTML, (3) Alur: mengambil URL -> parsing HTML -> find_all mencari elemen span.price -> loop menampilkan teks.',
    keywords: ['requests', 'get', 'http', 'beautifulsoup', 'parsing', 'html', 'find_all', 'span', 'price'],
    sampleAnswer:
      'Pustaka requests bertugas melakukan HTTP request ke server untuk mengunduh kode HTML mentah dari URL tujuan. Pustaka BeautifulSoup bertugas mem-parsing (mengurai struktur pohon) kode HTML tersebut agar mudah ditelusuri. Alurnya: requests.get() mengambil halaman web, BeautifulSoup memproses teks HTML dengan parser "html.parser", fungsi soup.find_all mencari elemen tag <span> dengan class "price", lalu dilakukan perulangan (loop) untuk mengambil properti .text dari setiap elemen dan menampilkannya di konsol.',
  },
  {
    id: 2,
    number: 2,
    topic: 'Evaluasi Informasi: Lateral Reading',
    context:
      'Kemampuan membaca lateral (Lateral Reading) merupakan keterampilan penting yang wajib dimiliki peserta didik SMA di era banjir informasi.',
    question:
      'Jelaskan apa yang dimaksud dengan teknik "Membaca Lateral" (Lateral Reading), dan mengapa teknik ini jauh lebih ampuh mencegah hoaks dibandingkan hanya membaca secara vertikal (Vertical Reading) di dalam satu situs web!',
    points: 8,
    rubricGuide:
      'Jawaban harus menjelaskan: Definisi lateral reading (membuka tab baru untuk memeriksa kredibilitas dari sumber luar) vs vertical reading (hanya menelusuri halaman web dari atas ke bawah). Keunggulannya: situs palsu bisa dipoles terlihat profesional, sedangkan lateral reading mengungkap rekam jejak sebenarnya.',
    keywords: ['lateral reading', 'tab baru', 'sumber luar', 'kredibilitas', 'vertikal', 'verifikasi', 'hoaks', 'independen'],
    sampleAnswer:
      'Membaca lateral adalah teknik memverifikasi informasi dengan membuka tab-tab baru di peramban web untuk mencari tahu reputasi situs, latar belakang penulis, dan pandangan ahli luar mengenai klaim tersebut. Teknik ini jauh lebih ampuh daripada membaca vertikal karena situs penyebar hoaks atau informasi palsu saat ini sangat mudah didesain menyerupai media kredibel dengan logo dan tata letak profesional. Dengan membaca lateral, kita memeriksa konsensus eksternal dan fakta independen, bukan hanya mempercayai apa yang dikatakan situs itu tentang dirinya sendiri.',
  },
  {
    id: 3,
    number: 3,
    topic: 'CRAAP Test Framework',
    question:
      'Uraikan kelima aspek dalam kerangka evaluasi informasi "CRAAP Test" (Currency, Relevance, Authority, Accuracy, Purpose) beserta penjelasan singkat apa yang dinilai pada masing-masing aspek!',
    points: 8,
    rubricGuide:
      'Harus menyebutkan dan menjelaskan: C (Currency: waktu/kebaruan), R (Relevance: kecocokan/kepentingan informasi), A (Authority: siapa pembuat/ahlinya), A (Accuracy: kebenaran/bukti/data), P (Purpose: tujuan penulisan/bias/komersil).',
    keywords: ['currency', 'kebaruan', 'relevance', 'kesesuaian', 'authority', 'kredibilitas', 'accuracy', 'akurasi', 'purpose', 'tujuan'],
    sampleAnswer:
      '1. Currency (Kebaruan): Menilai ketepatan waktu penerbitan informasi dan apakah terdapat pembaruan terkini. 2. Relevance (Relevansi): Menilai kesesuaian dan kedalaman informasi terhadap kebutuhan penelitian pembaca. 3. Authority (Otoritas): Menilai siapa penulis, penerbit, atau organisasi yang mengeluarkan informasi beserta kualifikasi dan reputasinya. 4. Accuracy (Akurasi): Menilai kebenaran fakta, ketersediaan bukti ilmiah pendukung, serta ketiadaan kesalahan data. 5. Purpose (Tujuan): Menilai motif di balik pembuatan informasi tersebut, apakah untuk mengedukasi, menjual produk, menghibur, atau menyebarkan propaganda/opini sepihak.',
  },
  {
    id: 4,
    number: 4,
    topic: 'Bahaya Outdated Information & Etika Berbagi',
    context:
      'Berdasarkan soal materi nomor 10, artikel tahun 2010 dibagikan kembali di tahun 2024 tanpa pembaruan.',
    question:
      'Jelaskan bahaya atau dampak negatif dari penyebaran artikel/informasi lawas (outdated) di media sosial masa kini tanpa menyertakan konteks waktu, serta apa langkah etis yang harus dilakukan siswa sebelum membagikan informasi!',
    points: 8,
    rubricGuide:
      'Dampak negatif: menimbulkan kepanikan/salah paham, situasi telah berubah drastis, disinformasi. Langkah etis: memeriksa tanggal publikasi, mencari update terbaru, membaca isi utuh, tidak sembarang menyebarkan info.',
    keywords: ['outdated', 'usang', 'kesalahpahaman', 'disinformasi', 'tanggal', 'verifikasi', 'konteks', 'etika'],
    sampleAnswer:
      'Dampak negatifnya adalah timbulnya misinformasi dan kesalahpahaman publik, karena kondisi fakta, regulasi, maupun teknologi di masa lalu sudah banyak yang tidak berlaku lagi di masa kini. Hal ini dapat memicu kekeliruan pengambilan keputusan atau kepanikan yang tidak perlu. Langkah etis yang harus dilakukan: selalu mengecek tanggal publikasi (currency), menelusuri artikel terbaru terkait topik tersebut, membaca tuntas isi artikel bukan sekadar judul, dan menahan diri untuk tidak membagikan informasi jika belum terbukti relevan dan terbarukan.',
  },
  {
    id: 5,
    number: 5,
    topic: 'Pencarian Visual & Ekosistem Periksa Fakta',
    question:
      'Bagaimana cara kerja teknologi pencarian visual (seperti Google Lens atau Reverse Image Search) dapat dimanfaatkan oleh seorang siswa untuk memverifikasi keaslian dan konteks sebuah foto/gambar viral yang dicurigai sebagai hoaks?',
    points: 8,
    rubricGuide:
      'Menjelaskan: Cara kerja mencocokkan fitur visual/gambar ke database internet (reverse image search/computer vision). Manfaat: melacak kapan dan di mana foto pertama kali diunggah, mengungkap apakah foto tersebut merupakan daur ulang peristiwa masa lalu atau hasil rekayasa/manipulasi.',
    keywords: ['google lens', 'pencarian visual', 'reverse image', 'kecerdasan buatan', 'foto asli', 'konteks', 'daur ulang', 'manipulasi'],
    sampleAnswer:
      'Siswa dapat mengunggah atau memindai foto yang dicurigai menggunakan Google Lens atau Reverse Image Search. Teknologi Computer Vision akan menganalisis pola visual gambar dan mencocokkannya dengan miliaran citra di basis data internet. Melalui cara ini, siswa dapat: (1) Menemukan sumber pertama kali foto tersebut diunggah di internet, (2) Memeriksa konteks asli peristiwa (misalnya foto bencana luar negeri 5 tahun lalu yang diklaim sebagai kejadian baru di Indonesia), dan (3) Mendeteksi apakah foto tersebut merupakan hasil rekayasa atau potongan gambar yang dimanipulasi.',
  },
];

/**
 * Intelligent preliminary scoring function for essays based on semantic keyword match
 * and content depth. Returns a score between 0 and 8.
 */
export function autoGradeEssay(questionId: number, answerText: string): { score: number; feedback: string } {
  const essay = QUESTIONS_ESSAY.find(q => q.id === questionId);
  if (!essay) return { score: 0, feedback: 'Soal tidak ditemukan' };

  const cleanedText = (answerText || '').toLowerCase().trim();
  if (cleanedText.length < 15) {
    return {
      score: 1,
      feedback: 'Jawaban terlalu singkat atau belum memberikan penjelasan substansial.',
    };
  }

  let matchCount = 0;
  const matchedKeywords: string[] = [];

  for (const kw of essay.keywords) {
    if (cleanedText.includes(kw.toLowerCase())) {
      matchCount++;
      matchedKeywords.push(kw);
    }
  }

  // Length weight
  const lengthBonus = cleanedText.length > 180 ? 2 : cleanedText.length > 80 ? 1 : 0;
  // Keyword density
  const ratio = matchCount / essay.keywords.length;

  let calculatedScore = 2; // base score for effort
  if (ratio >= 0.6) {
    calculatedScore = 7 + lengthBonus >= 8 ? 8 : 7;
  } else if (ratio >= 0.4) {
    calculatedScore = 5 + lengthBonus;
  } else if (ratio >= 0.2) {
    calculatedScore = 3 + lengthBonus;
  }

  // Cap at max points (8)
  calculatedScore = Math.min(8, Math.max(1, calculatedScore));

  const feedback =
    calculatedScore >= 7
      ? `Penjelasan sangat baik dan komprehensif. Mencakup konsep inti (${matchedKeywords.slice(0, 3).join(', ')}).`
      : calculatedScore >= 5
      ? `Penjelasan cukup tepat. Kata kunci terdeteksi: ${matchedKeywords.join(', ') || 'konsep dasar'}.`
      : `Jawaban memuat beberapa poin dasar, namun perlu penjelasan konsep yang lebih mendalam.`;

  return {
    score: calculatedScore,
    feedback,
  };
}
