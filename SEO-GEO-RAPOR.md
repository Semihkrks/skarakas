# skarakas.com — SEO + GEO Analiz Raporu

**Tarih:** 2026-07-03
**Kaynak:** Canlı site taraması (https://skarakas.com) + kod analizi

---

## Özet

Canlı site tarandı. Kritik eksiklerin çoğu **bu oturumda düzeltildi** (aşağıda ✅ işaretli). Kalan maddeler deploy sonrası yapılacaklar ve içerik/otorite tarafı.

**Önceki durum:** robots.txt 404, sitemap.xml 404, llms.txt 404, JSON-LD yok, og:image yok, canonical yok, favicon default Next.js ikonu.

---

## ✅ Bu Oturumda Düzeltilenler

### 1. Logo & Favicon (logo.png → her yere)
| Dosya | Ne yapıldı |
|---|---|
| `public/logo.png` | Orijinal logo kopyalandı (site içi kullanım) |
| `src/app/favicon.ico` | SK logodan üretildi — 16/32/48px multi-size, 15KB |
| `src/app/icon.png` | 512×512 (Google arama sonucu ikonu + PWA) |
| `src/app/apple-icon.png` | 180×180 (iOS ana ekran) |
| `src/app/opengraph-image.png` | 1200×630 — logo + isim + ünvan (WhatsApp/LinkedIn/X paylaşım kartı) |
| `src/app/twitter-image.png` | Aynı görsel, Twitter kartı |
| `navbar.tsx` | Gradient "SK" kutusu → gerçek logo (beyaz kutu, dark/light iki modda da net) |
| `footer.tsx` | Aynı şekilde gerçek logo |

Next.js file convention sayesinde icon/og-image link etiketleri otomatik enjekte ediliyor — build çıktısında doğrulandı.

### 2. SEO Kritikleri
| Eksik | Düzeltme |
|---|---|
| ❌ robots.txt 404 | ✅ `src/app/robots.ts` — `/admin` ve `/api` disallow, sitemap referansı |
| ❌ sitemap.xml 404 | ✅ `src/app/sitemap.ts` — statik sayfalar + Supabase'den yayınlanmış blog yazıları, 1 saat revalidate |
| ❌ Canonical yok | ✅ `layout.tsx` → `alternates.canonical: "./"` (her sayfa kendi URL'ine canonical veriyor — doğrulandı: `/` ve `/blog` doğru) |
| ❌ og:image yok (`twitter:card summary_large_image` tanımlı ama görselsiz!) | ✅ opengraph-image.png + twitter-image.png |
| ❌ Web manifest yok | ✅ `src/app/manifest.ts` |
| ❌ Blog yazılarında OG/article meta yok | ✅ `blog/[slug]/page.tsx` → `og:type article`, publishedTime, canonical, twitter card |

### 3. GEO Kritikleri (AI arama görünürlüğü)
| Eksik | Düzeltme |
|---|---|
| ❌ JSON-LD hiç yok | ✅ `layout.tsx` → `Person` + `WebSite` schema (`sameAs` ile GitHub/LinkedIn/Instagram/Twitter bağlandı — entity recognition için kritik) |
| ❌ Blog yazılarında schema yok | ✅ `blog/[slug]/page.tsx` → `BlogPosting` schema, Person'a `@id` referansı |
| ❌ llms.txt yok | ✅ `public/llms.txt` — site özeti, hizmetler, iletişim |

**Build doğrulandı:** `npm run build` başarılı, tüm route'lar üretildi, local prod server'da robots/sitemap/llms/favicon/og-image 200 dönüyor.

---

## ⚠️ Kalan Kritik İşler (deploy sonrası)

1. **Deploy et** — düzeltmelerin hiçbiri henüz canlıda değil. Deploy sonrası kontrol: `skarakas.com/robots.txt`, `/sitemap.xml`, `/llms.txt`.
2. **Google Search Console** — site kaydı yok gibi. Kayıt ol, sitemap.xml gönder. Bing Webmaster Tools'a da ekle (ChatGPT web araması Bing index kullanıyor).
3. **Blog listesi hardcoded** — `src/app/blog/blog-content.tsx` içinde yazılar sabit dizi; detay sayfası ise Supabase'den çekiyor. Listede olup DB'de olmayan slug → 404. Listeyi de Supabase'den çek (server component yap — şu an client-side, SEO için de daha iyi olur).
4. **Ana sayfa H1 sorunu** — H1 "Semih" + "Karakaş" iki ayrı span, arada boşluk yok → arama motoru "SemihKarakaş" okuyor. Span'ler arasına `{" "}` veya `sr-only` boşluk ekle.
5. **Ortam değişkeni yönetimi** — `messages/[id]/reply/route.ts` modül seviyesinde `new Resend()` çağırıyor; `RESEND_API_KEY` olmadan build patlıyor. Lazy init'e çevir (handler içine taşı).

## 📋 Orta Vadeli Öneriler

### SEO
- **hreflang / dil**: Site tamamen Türkçe (`lang="tr"` doğru). İngilizce versiyon düşünülürse hreflang eklenir.
- **Heading hiyerarşisi**: Genel olarak iyi (tek H1, bölümler H2). Blog içeriklerinde de H2/H3 düzenine dikkat.
- **Görsel alt metinleri**: Ana sayfada `<img>` yok (hepsi CSS/SVG) — sorun değil ama proje kartlarına gerçek görsel eklenirse alt zorunlu.
- **Core Web Vitals**: Framer Motion + particle field ana sayfada ağır. Mobilde INP/LCP ölçümü yap (PageSpeed Insights), particle sayısını mobilde düşürmeyi değerlendir.

### GEO (AI görünürlüğü)
- **İçerik derinliği**: Blog yazıları AI atıfları için en güçlü varlık. Her yazıda: net tanım cümleleri, listeler, istatistik/somut veri — alıntılanabilirlik artar.
- **Yazar sinyali (E-E-A-T)**: Blog yazılarına görünür yazar kutusu ekle (isim + ünvan + kısa bio). Schema zaten bağlandı, görünür hali de olmalı.
- **Marka varlığı**: GitHub profili README, LinkedIn güncelliği, dev.to/Medium cross-post — AI modelleri entity tanıma için bu platformlara bakıyor.
- **llms.txt bakımı**: Yeni blog yazıları ekledikçe llms.txt'e önemli yazıların linklerini ekle.
- **AI crawler erişimi**: robots.ts şu an tüm bot'lara açık (GPTBot, ClaudeBot, PerplexityBot dahil) — GEO için doğru tercih, böyle kalsın.

---

## Dosya Değişiklikleri Özeti

**Yeni:** `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`, `public/logo.png`, `public/llms.txt`

**Güncellenen:** `src/app/favicon.ico` (SK logo), `src/app/layout.tsx` (canonical + JSON-LD), `src/app/blog/[slug]/page.tsx` (OG + BlogPosting schema), `src/components/layout/navbar.tsx` (logo), `src/components/layout/footer.tsx` (logo)
