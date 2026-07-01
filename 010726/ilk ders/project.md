# Proje Başlatma Rehberi (React + Vite + Material UI + JSON Server + Redux Toolkit)

Bu şablon, yeni bir yazılım projesine başlarken projenin tüm detaylarını (tasarım, renkler, sayfalar, veri modeli ve state yönetimi) belirlemek ve Antigravity'nin projeyi sıfırdan kurmasını sağlamak amacıyla hazırlanmıştır.

Projenizi başlatmadan önce aşağıdaki alanları kendi projenizin gereksinimlerine göre doldurun.

---

## 1. Genel Proje Bilgileri
- **Proje Adı:** `AI Form Builder`
- **Kısa Açıklama:** 

  - Like Google Forms.

  - Features:

    - Drag & Drop builder
    - AI generates forms
    - Conditional questions
    - Analytics
    - QR code
    - Share links
    - Responses dashboard

- **Hedef Kitle:** `Kullanıcılar`

---

## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)

Antigravity'nin modern ve göz alıcı bir tasarım oluşturabilmesi için aşağıdaki renk paletini ve stil yönergelerini belirleyin.

### Renk Paleti (Harmonious Palette)
Tasarımda doğrudan standart kırmızı/mavi kullanmak yerine modern HSL renklerini tercih edin.

- **Primary (Ana Renk - Örn. Marka Kimliği, Butonlar):**
  - HSL: `hsl(243, 75%, 59%)`
  - Hover / dark mode: `hsl(243, 80%, 67%)`
  - Kullanım Alanı: Ana CTA butonları ("Form Oluştur"), aktif menü elemanları, seçili adım göstergeleri, odaklanılan input çerçeveleri.
- **Secondary (İkinci Renk - Örn. Accent, Vurgu):**
  - HSL: `hsl(270, 60%, 60%)`
  - Hover / dark mode: `hsl(270, 65%, 70%)`
  - Tint bg: `hsl(268, 55%, 95%)`
  - Kullanım Alanı: AI önerileri, "yeni özellik" rozetleri, ikincil butonlar, vurgulanan öneri kartları.
- **Neutral Background (Arka Plan Renkleri):**
  - Light Mode:
    - Base: `hsl(240, 20%, 99%)`
    - Surface / Card: `hsl(0, 0%, 100%)`
    - Muted Surface: `hsl(240, 15%, 96%)`
    - Border: `hsl(240, 12%, 90%)`
  - Dark Mode:
    - Base: `hsl(240, 10%, 9%)`
    - Surface / Card: `hsl(240, 8%, 13%)`
    - Muted Surface: `hsl(240, 7%, 17%)`
    - Border: `hsl(240, 7%, 22%)`
- **Neutral Text (Yazı Renkleri):**
  - Light Mode:
    - Primary: `hsl(240, 15%, 12%)`
    - Secondary: `hsl(240, 8%, 40%)`
    - Muted: `hsl(240, 6%, 58%)`
  - Dark Mode:
    - Primary: `hsl(240, 15%, 95%)`
    - Secondary: `hsl(240, 8%, 65%)`
    - Muted: `hsl(240, 6%, 48%)`
- **Semantic Colors (Durum Renkleri):**
  - Success (Başarı - Örn. form gönderildi, doğrulama geçti):
    - base: `hsl(142, 71%, 40%)`
    - bg: `hsl(142, 60%, 95%)`
    - text: `hsl(142, 65%, 20%)`
  - Warning (Uyarı - Örn. eksik alan, taslak kaydedilmedi):
    - base: `hsl(38, 92%, 50%)`
    - bg: `hsl(38, 90%, 95%)`
    - text: `hsl(32, 89%, 24%)`
  - Error (Hata - Örn. doğrulama hatası, gönderim başarısız):
    - base: `hsl(0, 72%, 51%)`
    - bg: `hsl(0, 85%, 96%)`
    - text: `hsl(0, 59%, 32%)`

### Tipografi ve Fontlar
- **Birincil Yazı Tipi:** `Outfit` veya `Inter` (Google Fonts'tan otomatik çekilecek)
- **Başlıklar (Headings):** `font-semibold` veya `font-bold`
- **Gövde Metni (Body):** `font-normal` ve `antialiased`

<!-- ### UI Özellikleri ve Efektler
- **Glassmorphic Kartlar:** Arka planda `backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20` kullanımı.
- **Gölgeler (Shadows):** Butonlar ve kartlar için yumuşak gölgeler (`shadow-lg shadow-purple-500/10`).
- **Mikro Etkileşimler:** `transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]` hover ve tıklama efektleri. -->

---

## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)

Uygulamanızda yer alacak sayfaları ve bunların alt bileşenlerini listeleyin.

- **`/` (Landing Page)**
  - Amaç: Ürünün tanıtımı.
  - Bileşenler: 
    - Navbar
    - Hero Section
    - Features
    - AI Demo
    - Pricing
    - FAQ
    - Footer
    
- **`/login` **
  - Amaç: Kullanıcı girişi.
  - Bileşenler:
    - Login Form
    - Google Login
    - GitHub Login
    - Forgot Password


- **`/register`**
  - Amaç: Yeni kullanıcı oluşturma.
  - Bileşenler:
    - Register Form
    - OAuth Buttons   
    - Email Verification Notice
    
- **`/dashboard`**
  - Amaç: Kullanıcının oluşturduğu formları görüntüleme.
  - Bileşenler:
    - Sidebar
    - Header
    - Form Cards
    - Search
    - Filters
    - Create Form Button
    - Recent Activity


- **`/dashboard/forms`**
  - Amaç: Tüm formların listesi.
  - Bileşenler:
    - Sidebar
    - Header
    - Form Table
    - Pagination
    - Search
    - Sort
    - Filter
    
- **`/dashboard/forms/new`**
  - Amaç: Yeni form oluşturma.
  - Bileşenler:
    - Sidebar
    - Header
    - AI Prompt Input
    - Blank Form Button
    - Template Gallery

- **`/dashboard/forms/:id/editor`**
  - Amaç: Form oluşturma/editör ekranı.
  - Bileşenler:
    - Sidebar
    - Top Toolbar
    - Drag & Drop Canvas
    - Component Palette
    - Properties Panel
    - AI Assistant Panel
    - Live Preview Toggle
    - Save Button

- **`/dashboard/forms/:id/settings`**
  - Amaç: Form ayarları.
  - Bileşenler:
    - Sidebar
    - Header
    - Form Title
    - Description
    - Theme
    - Submit Message
    - Custom Domain
    - Password Protection
    - Schedule Publish

- **`/dashboard/forms/:id/share`**
  - Amaç: Form paylaşımı.
  - Bileşenler:
    - Sidebar
    - Header
    - Public URL
    - Copy Button
    - QR Code
    - Embed Code
    - Permissions

- **`/dashboard/forms/:id/responses`**
  - Amaç: Gelen cevaplar.
  - Bileşenler:
    - Sidebar
    - Header
    - Response Table
    - Search
    - Filters
    - Export CSV
    - Charts
    - Response Detail Drawer


- **`/dashboard/forms/:id/analytics`**
  - Amaç: Form analizleri.
  - Bileşenler:
    - Sidebar
    - Header
    - Total Views
    - Total Responses
    - Completion Rate
    - Device Chart
    - Browser Chart
    - Country Map
    - Timeline Graph

- **`/dashboard/templates`**
  - Amaç: Hazır form şablonları.
  - Bileşenler:
    - Sidebar
    - Header
    - Categories
    - Template Cards
    - Search
    - Preview Modal

- **`/dashboard/ai`**
  - Amaç: AI ile form üretme.
  - Bileşenler:
    - Sidebar
    - Header
    - Prompt Textarea
    - AI Suggestions
    - Generated Form Preview
    - Edit Prompt
    - Generate Button

- **`/dashboard/account`**
  - Amaç: Profil ayarları.
  - Bileşenler:
    - Sidebar
    - Header
    - Avatar
    - Name
    - Email
    - Password
    - Connected Accounts


- **`/dashboard/billing`**
  - Amaç: Abonelik yönetimi.
  - Bileşenler:
    - Sidebar
    - Header
    - Current Plan
    - Upgrade Button
    - Payment History
    - Invoices


- **`/dashboard/team`**
  - Amaç: Takım yönetimi.
  - Bileşenler:
    - Sidebar
    - Header
    - Team Members
    - Invite Member
    - Roles
    - Permissions


- **`/dashboard/notifications`**
  - Amaç: Bildirimler.
  - Bileşenler:
    - Sidebar
    - Header
    - Notification List
    - Read/Unread Filter

- **`/dashboard/trash`**
  - Amaç: Silinen formlar.
  - Bileşenler:
    - Sidebar
    - Header
    - Deleted Forms
    - Restore Button
    - Permanent Delete


- **`/form/:shareId`**
  - Amaç: Ziyaretçinin dolduracağı public form.
  - Bileşenler:
    - Form Renderer
    - Progress Bar
    - Validation
    - Submit Button
    - Thank You Screen

- **`/form/:shareId/success`**
  - Amaç: Form gönderildikten sonraki ekran.
  - Bileşenler:
    - Success Animation
    - Thank You Message
    - Share Button

- **`/dashboard/trash`**
  - Amaç: Silinen formlar.
  - Bileşenler:
    - Sidebar
    - Header
    - Deleted Forms
    - Restore Button
    - Permanent Delete


  - **`/form/:shareId`**
  - Amaç: Ziyaretçinin dolduracağı public form.
  - Bileşenler:
    - Form Renderer
    - Progress Bar
    - Validation
    - Submit Button
    - Thank You Screen


- **`/form/:shareId/success`**
  - Amaç: Form gönderildikten sonraki ekran.
  - Bileşenler:
    - Success Animation
    - Thank You Message
    - Share Button

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

JSON Server kullanarak ayağa kaldıracağımız yerel API'nin veri yapısını burada tanımlayın.

```json






```

---

## 5. Global State Yönetimi (Redux Toolkit)

Uygulamada kullanılacak global slice (state) yapılarını ve içerdikleri anahtar değerleri listeleyin.

### 1. `clientSlice`
- **State Yapısı:**
  ```javascript
  {
    clients: [],
    selectedClient: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  - `fetchClients()` -> `GET /projects`
  - `addClient(clientData)` -> `POST /projects`
  - `updateClient({ id, data })` -> `PATCH /projects/:id`
  - `deleteClient(id)` -> `DELETE /projects/:id`

### 2. `dashboardSlice`
- **State Yapısı:**
  ```javascript
  {
    stats: null,
  recentActivity: [],
  upcomingTasks: [],
  revenueChart: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  }
  ```

  **Async Thunk Eylemleri (Actions):**
  - `dashboard/fetchDashboard` -> `GET /dashboard`
  

### 3. `authSlice`
- **State Yapısı:**
  ```javascript
  {
    user: null,
    token: null,
    isAuthenticated: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  - `login(credentials)` -> `POST /login`
  - `register(userData)` -> `POST /register`
  - `logout()` -> `POST /logout`

### 4. `settingsSlice`
- **State Yapısı:**
  ```javascript
  {
    profile: null,
    notifications: null,
    preferences: null,
    team:[],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  - `settings/fetchSettings` -> `GET /settings`
  - `settings/updateSettings` -> `PUT /settings`
  - `settings/updateProfile` -> `PUT /settings/profile`

### 5. `UiSlice`
- **State Yapısı:**
  ```javascript
  {
    theme: 'light', // 'light' | 'dark'
  sidebarCollapsed: false,
  clientModal: {
    isOpen: false,
    mode: null, // 'add' | 'edit' | 'delete'
    clientId: null,
  }
  }
  ```
- ** Reducers:**
  - toggleSidebar() 
  - toggleMode() 
  - setClientModal(mode, clientId)
  - closeClientModal()
  

---

## 6. Antigravity Geliştirme Sırası ve Talimatları

Antigravity'nin bu `project.md` dosyasını okuyarak sırasıyla hangi adımları yapmasını bekliyoruz?

1. **Adım 1: Klasör Yapısını İncele ve Ayarla**:
   - `src/` klasörünün altında `components/`, `pages/`, `store/`, `hooks/` dizinlerini oluştur.
2. **Adım 2: Bağımlılıkları ve Konfigürasyonu Yapılandır**:
   - `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `axios`, `lucide-react`, `@mui/material @emotion/react @emotion/styled`  paketlerini yükle.
   - `tailwind.config.js` dosyasını yukarıda belirtilen renk paletine (HSL değerleriyle) göre güncelle.
3. **Adım 3: Store ve Slice Dosyalarını Oluştur**:
   - `store/index.js` dosyasını oluştur ve store'u uygulamaya bağla.
   - `clientsSlice.js` `dashboardSlice.js` `authSlice.js` `settingsSlice.js` `uiSlice.js` dosyalarını async thunk'ları ile birlikte yaz.
4. **Adım 4: JSON Server Kurulumu**:
   - Proje kökünde `db.json` dosyasını oluştur ve doldur.
   - Projenin `package.json` dosyasına `"server": "json-server --watch db.json --port 5000"` scriptini ekle.
5. **Adım 5: Sayfaları ve Yönlendirmeleri (Routing) Tasarla**:
   - `react-router-dom` ile sayfaları oluştur ve birbirine bağla.
   - Modern, responsive ve koyu mod destekli UI bileşenlerini geliştir.
