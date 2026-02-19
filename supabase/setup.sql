-- =============================================
-- SKARAKAS.COM — Supabase Setup
-- Supabase SQL Editor'da çalıştırın
-- Bu script: Tabloları oluşturur, RLS ayarlar, seed data ekler
-- =============================================

-- ============ TABLOLARI OLUŞTUR ============

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Web',
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  gradient TEXT DEFAULT 'from-teal-500 to-cyan-500',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  gradient TEXT DEFAULT 'from-teal-500 to-cyan-500',
  category TEXT NOT NULL DEFAULT 'Web Geliştirme',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_time TEXT DEFAULT '5 dk',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============ ROW LEVEL SECURITY ============

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Eski policy'leri kaldır (varsa)
DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can insert messages" ON messages;
DROP POLICY IF EXISTS "Admin full access projects" ON projects;
DROP POLICY IF EXISTS "Admin full access blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin full access messages" ON messages;
DROP POLICY IF EXISTS "Admin full access settings" ON settings;
DROP POLICY IF EXISTS "Allow all projects" ON projects;
DROP POLICY IF EXISTS "Allow all blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow all messages" ON messages;
DROP POLICY IF EXISTS "Allow all settings" ON settings;

-- NextAuth kullanıldığı için Supabase Auth yok.
-- Tüm yetkilendirme NextAuth API route'larında yapılıyor.
-- Bu sebeple anon key ile tüm CRUD izinleri açık.
CREATE POLICY "Allow all projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- ============ INDEXLER ============

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- ============ SEED DATA: BLOG YAZILARI ============

INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, status, reading_time, gradient, created_at) VALUES
(
  'Next.js 15 ile Gelen Yenilikler ve Performans İyileştirmeleri',
  'nextjs-15-yenilikleri',
  'Next.js 15, React Server Components, Turbopack ve yeni caching stratejileri ile web geliştirmeyi bir üst seviyeye taşıyor.',
  E'Next.js 15, web geliştirme dünyasında önemli bir dönüm noktası. Bu sürümde gelen yenilikler, geliştirici deneyimini ve uygulama performansını önemli ölçüde iyileştiriyor.\n\n## React Server Components\n\nServer Components, Next.js 15''in temel taşlarından biri. Artık bileşenleriniz varsayılan olarak sunucu tarafında render ediliyor, bu da:\n\n- **Daha küçük bundle boyutu**: Client''a gönderilen JavaScript miktarı azalıyor\n- **Daha hızlı ilk yükleme**: Sunucu tarafında render edilen HTML anında gösteriliyor\n- **Doğrudan veritabanı erişimi**: API katmanı olmadan veritabanınıza erişebilirsiniz\n\n## Turbopack\n\nWebpack''in yerini alan Turbopack, geliştirme sunucusunu inanılmaz hızlandırıyor:\n\n- **700ms** → **50ms** HMR (Hot Module Replacement) süresi\n- Incremental compilation ile sadece değişen modüller yeniden derleniyor\n- Native Rust performansı\n\n## Yeni Caching Stratejileri\n\nNext.js 15, veri önbellekleme konusunda çok daha akıllı:\n\n- **Request Memoization**: Aynı veri birden fazla bileşende kullanılıyorsa tek sorgu\n- **Data Cache**: fetch() sonuçları otomatik önbelleğe alınıyor\n- **Full Route Cache**: Statik sayfalar build zamanında önbelleğe alınıyor\n\nBu özellikler, Next.js 15''i modern web uygulamaları için en güçlü framework haline getiriyor.',
  'Web Geliştirme',
  ARRAY['Next.js', 'React', 'Turbopack', 'Performance'],
  'published',
  '8 dk',
  'from-teal-500 to-cyan-500',
  '2026-02-10T10:00:00Z'
),
(
  'TypeScript Best Practices: Temiz ve Güvenli Kod Yazma Rehberi',
  'typescript-best-practices',
  'Type-safe kod yazmanın incelikleri, generic yapılar, utility types ve real-world pattern''ler hakkında kapsamlı bir rehber.',
  E'TypeScript, JavaScript''e tip güvenliği getirerek kodunuzu daha güvenilir ve bakımı kolay hale getirir. Bu rehberde en iyi pratikleri inceliyoruz.\n\n## Strict Mode Kullanın\n\ntsconfig.json dosyanızda strict mode''u açın. Bu, birçok potansiyel hatayı derleme zamanında yakalamanızı sağlar.\n\n## Utility Types\n\nTypeScript''in yerleşik utility type''ları çok güçlüdür: Partial, Required, Pick, Omit, Record gibi type''ları etkin kullanmak kodunuzu daha temiz hale getirir.\n\n## Generic Yapılar\n\nGeneric''ler, type-safe ve yeniden kullanılabilir kod yazmanın anahtarıdır. API çağrılarından form işlemeye kadar her yerde kullanılabilirler.\n\nHer projede bu pratikleri uygulamak, uzun vadede büyük fayda sağlar.',
  'TypeScript',
  ARRAY['TypeScript', 'Best Practices', 'Clean Code'],
  'published',
  '12 dk',
  'from-blue-500 to-indigo-500',
  '2026-01-28T10:00:00Z'
),
(
  'Supabase vs Firebase: Hangisi Projeniz İçin Daha Uygun?',
  'supabase-vs-firebase',
  'İki popüler BaaS platformunu performans, fiyatlandırma, özellikler ve geliştirici deneyimi açısından karşılaştırıyoruz.',
  E'Backend-as-a-Service (BaaS) platformları, geliştiricilerin sunucu tarafı altyapısını hızla kurmasını sağlar. Supabase ve Firebase, bu alandaki iki büyük oyuncu.\n\n## Supabase\n\n- **PostgreSQL** tabanlı (SQL gücü)\n- Açık kaynak\n- Row Level Security ile güvenlik\n- Gerçek zamanlı abonelikler\n- Edge Functions\n\n## Firebase\n\n- **NoSQL** (Firestore) veritabanı\n- Google ekosistemi entegrasyonu\n- Cloud Functions\n- Hosting ve CDN\n- Analytics\n\n## Hangisini Seçmeli?\n\n**Supabase**: SQL deneyiminiz varsa, karmaşık sorgular gerekiyorsa, açık kaynak tercih ediyorsanız.\n**Firebase**: Hızlı prototipleme, Google servisleri entegrasyonu, NoSQL esnekliği istiyorsanız.',
  'Backend',
  ARRAY['Supabase', 'Firebase', 'BaaS', 'Karşılaştırma'],
  'published',
  '10 dk',
  'from-emerald-500 to-teal-500',
  '2026-01-15T10:00:00Z'
),
(
  'Framer Motion ile Profesyonel Web Animasyonları',
  'framer-motion-animasyonlari',
  'React projelerinize hayat veren etkileyici animasyonlar, scroll-triggered efektler ve micro-interaction''lar nasıl yapılır?',
  E'Framer Motion, React için en güçlü animasyon kütüphanelerinden biri. Kullanıcı deneyimini zenginleştiren profesyonel animasyonlar oluşturmak için bilmeniz gereken her şeyi bu rehberde bulabilirsiniz.\n\n## Temel Animasyonlar\n\nFramer Motion''da animasyonlar motion bileşenleri ile oluşturulur. Basit bir fade-in efekti bile uygulamanıza profesyonel bir hava katar:\n\n- **initial**: Bileşenin başlangıç durumu\n- **animate**: Hedef animasyon durumu\n- **transition**: Animasyonun süresi, easing ve spring fizik ayarları\n\n## Scroll-Triggered Animasyonlar\n\nKullanıcı sayfayı kaydırdıkça tetiklenen animasyonlar, modern web sitelerinin vazgeçilmezi:\n\n- **useScroll**: Scroll pozisyonunu takip eder\n- **useTransform**: Scroll değerini başka bir değere dönüştürür\n- **whileInView**: Bileşen viewport''a girdiğinde tetiklenir\n\n## Spring Physics\n\nDoğal hissettiren animasyonlar için spring fizik modeli kullanın:\n\n- **stiffness**: Yayın sertliği\n- **damping**: Sönümleme\n- **mass**: Kütle\n\nFramer Motion''ı projelerinizde etkin kullanarak, kullanıcılarınıza unutulmaz bir deneyim sunabilirsiniz.',
  'Web Geliştirme',
  ARRAY['Framer Motion', 'React', 'Animasyon', 'UX'],
  'published',
  '15 dk',
  'from-violet-500 to-purple-500',
  '2026-01-05T10:00:00Z'
),
(
  'Tailwind CSS İpuçları: Daha Hızlı ve Temiz Stil Yazımı',
  'tailwind-css-tips',
  'Component pattern''leri, custom plugin''ler, responsive tasarım stratejileri ve performans optimizasyonu hakkında pratik ipuçları.',
  E'Tailwind CSS, utility-first yaklaşımıyla CSS yazma şeklimizi kökten değiştirdi. İşte projelerinizde hemen uygulayabileceğiniz ipuçları.\n\n## Component Pattern''leri\n\nTekrar eden utility kombinasyonlarını bileşen olarak soyutlayarak kodunuzu temiz tutun:\n\n- **@apply direktifi**: Sık kullanılan utility gruplarını tek bir sınıfta birleştirin\n- **React bileşenleri**: Her butonun className''ini tekrarlamak yerine Button bileşeni oluşturun\n- **CVA**: Varyantlı bileşenler için mükemmel çözüm\n\n## Dark Mode\n\nTailwind v4 ile dark mode desteği daha da güçlendi:\n\n- **dark:** prefix''i ile kolay dark mode stilleri\n- **CSS variables**: Tema değişkenleri ile tutarlı renk sistemi\n- **Otomatik geçiş**: next-themes ile sorunsuz tema değişimi\n\nBu ipuçları ile Tailwind CSS projeleriniz hem daha hızlı geliştirilir hem de daha kolay bakım yapılır hale gelir.',
  'CSS',
  ARRAY['Tailwind CSS', 'CSS', 'Responsive', 'Dark Mode'],
  'published',
  '7 dk',
  'from-pink-500 to-rose-500',
  '2025-12-20T10:00:00Z'
),
(
  'Docker ile Modern Web Uygulamalarını Deploy Etme Rehberi',
  'docker-deployment-rehberi',
  'Containerization, multi-stage build, docker-compose ve CI/CD pipeline entegrasyonu ile production-ready deployment.',
  E'Docker, uygulamalarınızı tutarlı bir şekilde paketlemenizi ve deploy etmenizi sağlar. Bu rehberde modern web uygulamalarını Docker ile nasıl production''a alacağınızı öğreneceksiniz.\n\n## Dockerfile Temelleri\n\nHer Docker imajı bir Dockerfile ile başlar:\n\n- **Base image seçimi**: Alpine tabanlı imajlar daha küçük ve güvenli\n- **Layer caching**: Sık değişen katmanları sona koyun\n- **Non-root user**: Güvenlik için root olmayan kullanıcı kullanın\n\n## Multi-Stage Build\n\nProduction imajlarınızı küçültmek için multi-stage build kullanın:\n\n- **Build stage**: Bağımlılıkları yükleyin ve uygulamayı derleyin\n- **Production stage**: Sadece gerekli dosyaları kopyalayın\n- **Sonuç**: İmaj boyutu 1GB''dan 100MB''a düşebilir\n\n## Docker Compose\n\nBirden fazla servisi yönetmek için docker-compose kullanın.\n\n## CI/CD Entegrasyonu\n\nGitHub Actions veya GitLab CI ile otomatik deployment pipeline''ı kurun.\n\nDocker ile deployment süreçlerinizi standardize ederek, "bende çalışıyor" problemini ortadan kaldırabilirsiniz.',
  'DevOps',
  ARRAY['Docker', 'DevOps', 'CI/CD', 'Deployment'],
  'published',
  '18 dk',
  'from-amber-500 to-orange-500',
  '2025-12-10T10:00:00Z'
)
ON CONFLICT (slug) DO NOTHING;

-- ============ SEED DATA: PROJELER ============

INSERT INTO projects (title, description, category, tags, gradient, live_url, github_url, featured, sort_order, created_at) VALUES
(
  'E-Ticaret Platformu',
  'Modern, yüksek performanslı full-stack e-ticaret uygulaması. Ödeme entegrasyonu, admin paneli ve gerçek zamanlı stok takibi.',
  'Web',
  ARRAY['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
  'from-teal-500 to-cyan-500',
  '#',
  '#',
  true,
  1,
  '2026-01-20T10:00:00Z'
),
(
  'Sağlık Takip Uygulaması',
  'Kullanıcıların sağlık verilerini takip edebildiği, doktor randevusu alabildiği cross-platform mobil uygulama.',
  'Mobil',
  ARRAY['React Native', 'Expo', 'Supabase', 'Charts'],
  'from-violet-500 to-purple-500',
  '#',
  '#',
  true,
  2,
  '2026-01-10T10:00:00Z'
),
(
  'Finans Dashboard',
  'Gerçek zamanlı finansal verileri görselleştiren, interaktif grafikler ve raporlama araçları sunan dashboard.',
  'Web',
  ARRAY['React', 'D3.js', 'WebSocket', 'Node.js'],
  'from-amber-500 to-orange-500',
  '#',
  '#',
  false,
  3,
  '2025-12-15T10:00:00Z'
),
(
  'RESTful API Gateway',
  'Mikroservis mimarisi için rate limiting, caching ve authentication özellikli API gateway çözümü.',
  'API',
  ARRAY['Node.js', 'Redis', 'Docker', 'JWT'],
  'from-emerald-500 to-teal-500',
  '#',
  '#',
  false,
  4,
  '2025-11-20T10:00:00Z'
),
(
  'SaaS Landing Page',
  'Yüksek dönüşüm oranına sahip, A/B testlenmiş interaktif SaaS ürün tanıtım sayfası.',
  'UI/UX',
  ARRAY['Figma', 'Next.js', 'Framer Motion', 'Analytics'],
  'from-pink-500 to-rose-500',
  '#',
  '#',
  true,
  5,
  '2025-11-01T10:00:00Z'
),
(
  'Task Management App',
  'Gerçek zamanlı işbirliği, drag & drop, bildirimler ve takım yönetimi özellikleriyle proje yönetim aracı.',
  'Web',
  ARRAY['Next.js', 'Prisma', 'Socket.io', 'Tailwind'],
  'from-blue-500 to-indigo-500',
  '#',
  '#',
  false,
  6,
  '2025-10-15T10:00:00Z'
);

-- ============ BİTTİ ============
-- Şimdi Next.js uygulamanızı başlatabilirsiniz!
