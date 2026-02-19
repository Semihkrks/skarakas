# skarakas.com — Admin Panel Kurulum ve Kullanım Rehberi

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Gereksinimler](#gereksinimler)
3. [Supabase Kurulumu](#supabase-kurulumu)
4. [NextAuth Kurulumu](#nextauth-kurulumu)
5. [Environment Variables](#environment-variables)
6. [Çalıştırma](#çalıştırma)
7. [Admin Panel Sayfaları](#admin-panel-sayfaları)
8. [İletişim Formu (Resend)](#i̇letişim-formu-resend)
9. [Deployment](#deployment)

---

## Genel Bakış

Admin Panel, sitenin içeriklerini (blog yazıları, projeler, gelen mesajlar, site ayarları) yönetmek için kullanılır. Teknolojiler:

- **NextAuth v5** — OAuth ile giriş (GitHub / Google)
- **Supabase** — PostgreSQL veritabanı + Row Level Security
- **Next.js App Router** — Server-side oturum kontrolü

Panel URL: `https://skarakas.com/admin`

---

## Gereksinimler

- Node.js 18+
- Supabase hesabı (ücretsiz): https://supabase.com
- GitHub OAuth App VEYA Google OAuth Client
- (Opsiyonel) Resend hesabı — e-posta bildirimleri için

---

## Supabase Kurulumu

### 1. Yeni Proje Oluşturma

1. [supabase.com](https://supabase.com) → Dashboard → "New Project"
2. Proje adı: `skarakas` (istediğin ad olabilir)
3. Veritabanı şifresi belirle (güvenli bir şifre seç)
4. Region: EU Central (Frankfurt) — Türkiye'ye yakın

### 2. Veritabanı Şemasını Oluşturma

1. Supabase Dashboard → **SQL Editor** sekmesine git
2. `supabase/schema.sql` dosyasının içeriğini kopyala-yapıştır
3. **Run** tuşuna bas

Bu SQL şu tabloları oluşturur:

| Tablo | Açıklama |
|-------|----------|
| `projects` | Proje portföyü |
| `blog_posts` | Blog yazıları |
| `messages` | İletişim formu mesajları |
| `settings` | Site ayarları (key-value) |

Row Level Security (RLS) otomatik ayarlanır:
- **Herkes**: Projeleri ve yayınlanmış blog yazılarını okuyabilir, mesaj gönderebilir
- **Sadece Admin**: Tüm tablolarda CRUD işlemleri yapabilir

### 3. API Anahtarlarını Alma

1. Supabase Dashboard → **Settings** → **API**
2. Şu değerleri not et:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJI...`

### 4. Storage Bucket (Opsiyonel — Resimler İçin)

1. Dashboard → **Storage** → **New Bucket**
2. Bucket adı: `images`
3. **Public bucket**: Açık
4. Allowed MIME types: `image/png, image/jpeg, image/webp, image/gif`

---

## NextAuth Kurulumu

Admin panelinize giriş yapmak için OAuth sağlayıcılarından en az birini kurmanız gerekir.

### GitHub OAuth App

1. GitHub → Settings → Developer Settings → OAuth Apps → **New OAuth App**
2. Alanları doldur:
   - Application name: `skarakas.com Admin`
   - Homepage URL: `http://localhost:3000` (production'da gerçek domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. **Register application** → Client ID ve Client Secret'ı not et

### Google OAuth Client

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. **Create Credentials** → OAuth client ID
3. Application type: **Web application**
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Client ID ve Client Secret'ı not et

### Admin E-posta Belirleme

`src/lib/auth.ts` dosyasında `ADMIN_EMAILS` değişkeni ile hangi e-postaların giriş yapabileceği belirlenir. Varsayılan: `semih@skarakas.com`

Birden fazla admin eklemek için `.env.local`'da:

```
ADMIN_EMAILS=semih@skarakas.com,diger@admin.com
```

---

## Environment Variables

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# ========================
# Supabase
# ========================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ========================
# NextAuth
# ========================
AUTH_SECRET=herhangi-guclu-random-string-buraya-yaz
# Oluşturmak için: openssl rand -base64 32

# GitHub OAuth (birini veya ikisini seçin)
GITHUB_CLIENT_ID=Iv1.xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx

# Google OAuth (opsiyonel)
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx

# Admin yetkilendirme
ADMIN_EMAILS=semih@skarakas.com

# ========================
# Resend (iletişim formu e-posta — opsiyonel)
# ========================
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_EMAIL=semih@skarakas.com
```

> **ÖNEMLİ:** `.env.local` dosyası `.gitignore`'da olmalıdır — asla git'e commit etmeyin!

---

## Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu
npm run dev

# Admin panele git
# http://localhost:3000/admin
```

İlk girişte GitHub veya Google ile oturum açmanız istenecek. Sadece `ADMIN_EMAILS` listesindeki e-postalar giriş yapabilir.

---

## Admin Panel Sayfaları

### `/admin` — Dashboard

Ana gösterge paneli:
- Toplam proje, blog yazısı, mesaj sayıları
- Okunmamış mesaj sayacı
- Son aktiviteler listesi

### `/admin/blog` — Blog Yönetimi

- **Yazı Listesi**: Tüm blog yazıları (taslak + yayınlanmış)
- **Yeni Yazı**: Başlık, slug, içerik (Markdown), kategori, etiketler
- **Düzenleme**: Mevcut yazıyı düzenle
- **Yayınlama / Geri Çekme**: Durum değiştirme
- **Silme**: Yazıyı kalıcı olarak sil

### `/admin/projects` — Proje Yönetimi

- **Proje Listesi**: Portföydeki tüm projeler
- **Yeni Proje**: Başlık, açıklama, teknoloji etiketleri, canlı/github linkleri
- **Öne Çıkarma**: Featured projeleri seç
- **Sıralama**: Drag & drop ile sıralama

### `/admin/messages` — Mesaj Yönetimi

- **Gelen Kutusu**: İletişim formundan gelen tüm mesajlar
- **Okundu İşareti**: Mesajları okundu/okunmadı olarak işaretle
- **Detay Görünümü**: Mesaj içeriğini oku
- **Silme**: Mesajı sil

### `/admin/settings` — Site Ayarları

- Genel site ayarları (key-value formatında)
- SEO meta bilgileri
- Sosyal medya linkleri

---

## İletişim Formu (Resend)

İletişim formu gönderildiğinde:

1. Mesaj Supabase `messages` tablosuna kaydedilir
2. (Opsiyonel) Resend API ile e-posta bildirimi gönderilir

### Resend Kurulumu

1. [resend.com](https://resend.com) → Hesap oluştur
2. API Keys → **Create API Key**
3. `.env.local`'a ekle: `RESEND_API_KEY=re_xxx`
4. Domain doğrulaması yap (DNS kayıtları ekleme)

> Resend olmadan da form çalışır — mesajlar veritabanına kaydedilir, sadece e-posta gelmez.

---

## Deployment

### Vercel (Önerilen)

1. GitHub'a push et
2. [vercel.com](https://vercel.com) → Import Git Repository
3. Environment Variables'ları Vercel Dashboard'dan ekle
4. Deploy!

**Önemli Vercel ayarları:**
- OAuth callback URL'lerini production domain'inize güncelle:
  - GitHub: `https://skarakas.com/api/auth/callback/github`
  - Google: `https://skarakas.com/api/auth/callback/google`

### Custom VPS

```bash
# Build
npm run build

# Start
npm start
# veya pm2 ile:
pm2 start npm --name "skarakas" -- start
```

---

## Sık Karşılaşılan Sorunlar

### "Giriş yapamıyorum"
- `ADMIN_EMAILS` env değişkeninde e-postanızın doğru yazıldığından emin olun
- OAuth sağlayıcının callback URL'sinin doğru olduğunu kontrol edin
- `AUTH_SECRET` env değişkeninin tanımlı olduğundan emin olun

### "Supabase bağlantı hatası"
- `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` doğru mu?
- Supabase projesinin aktif olduğunu kontrol edin
- Schema SQL'inin çalıştırıldığından emin olun

### "Mesaj e-postası gelmiyor"
- `RESEND_API_KEY` tanımlı mı?
- Resend'de domain doğrulaması yapıldı mı?
- E-posta, Resend'in spam klasöründe olabilir

### "Blog yazıları sitede görünmüyor"
- Blog yazısının durumu "published" mı? (draft yazılar sitede gözükmez)
- RLS policy'leri doğru mu? (schema.sql çalıştırıldıysa otomatik)

---

## Dosya Yapısı

```
src/
├── app/
│   ├── admin/
│   │   ├── (dashboard)/         # Auth-protected layout
│   │   │   ├── layout.tsx       # Session check + sidebar
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── dashboard-content.tsx
│   │   │   ├── blog/            # Blog CRUD
│   │   │   ├── projects/        # Proje CRUD
│   │   │   ├── messages/        # Mesaj yönetimi
│   │   │   └── settings/        # Site ayarları
│   │   └── login/               # Giriş sayfası
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth API
│       └── contact/             # İletişim form API
├── lib/
│   ├── auth.ts                  # NextAuth yapılandırma
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       └── server.ts            # Server Supabase client
└── types/
    └── index.ts                 # TypeScript tipleri

supabase/
└── schema.sql                   # Veritabanı şeması
```
