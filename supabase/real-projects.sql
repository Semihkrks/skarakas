-- =============================================
-- GERÇEK PROJELER — Supabase SQL Editor'de çalıştır
-- Demo projeleri siler, gerçek portfolyo işlerini ekler.
-- =============================================

-- 1) Mevcut demo/jenerik projeleri temizle
DELETE FROM projects;

-- 2) Gerçek projeleri ekle
INSERT INTO projects (title, description, category, tags, gradient, live_url, featured, sort_order) VALUES
(
  'Sonvera 2.0',
  'Nilvera entegrasyonlu e-fatura yönetim platformu. Çoklu hesap yönetimi, Excel export ve güvenli bulut altyapısı ile fatura süreçlerini tek panelden yönetir.',
  'Web Uygulaması',
  ARRAY['SaaS', 'E-Fatura', 'Entegrasyon', 'Bulut'],
  'from-blue-500 to-indigo-500',
  'https://sonvera.com.tr',
  true,
  1
),
(
  'Ustakur',
  'İstanbul''da mobilya montaj hizmeti için SEO odaklı yerel hizmet sitesi. Hizmet sayfaları, yorum sistemi ve yerel arama görünürlüğü ile müşteri kazanımı sağlar.',
  'Kurumsal Site',
  ARRAY['SEO', 'Yerel Hizmet', 'Kurumsal'],
  'from-amber-500 to-orange-500',
  'https://ustakur.com',
  true,
  2
),
(
  'NASS Event',
  'Event, müzik & film prodüksiyonu ve grafik tasarım ajansı için portfolyo sitesi. Hizmet vitrini, medya galerisi ve marka odaklı modern tasarım.',
  'Kurumsal Site',
  ARRAY['Ajans', 'Portfolyo', 'Tasarım'],
  'from-violet-500 to-purple-500',
  'https://nassevent.com',
  false,
  3
),
(
  'Netvora',
  'Ağ altyapısı, akıllı bina otomasyonu ve saha mühendisliği firması için B2B kurumsal site. Hizmet mimarisi ve teknik içerik yapısıyla kurumsal güven oluşturur.',
  'Kurumsal Site',
  ARRAY['B2B', 'Mühendislik', 'Kurumsal'],
  'from-teal-500 to-cyan-500',
  'https://netvora.tr',
  false,
  4
),
(
  'Kavza Kimya',
  'Endüstriyel ve evsel temizlik kimyasalları üreticisi için ürün kataloglu kurumsal site. Ürün yelpazesi, bayilik başvurusu ve Türkiye geneli dağıtım ağı tanıtımı.',
  'Kurumsal Site',
  ARRAY['Üretici', 'Katalog', 'B2B'],
  'from-emerald-500 to-teal-500',
  'https://kavzakimya.com',
  false,
  5
),
(
  'Çataloğlu Gezi Turizm',
  'Şahinkaya Kanyonu tekne turları için rezervasyon odaklı turizm sitesi. Tur paketleri, galeri ve yerel SEO ile sezonluk müşteri trafiği sağlar.',
  'Kurumsal Site',
  ARRAY['Turizm', 'Rezervasyon', 'SEO'],
  'from-rose-500 to-pink-500',
  'https://cataloglugeziturizm.com.tr',
  false,
  6
);
