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
  - HSL: `hsl(210, 75%, 37%)` 
  - Hover / dark mode: hsl(210, 82%, 27%)
  - Kullanım Alanı: Butonlar, aktif menü elemanları, odaklanılan kartlar.
- **Secondary (İkinci Renk - Örn. Accent, Vurgu):**
  - HSL: `hsl(165, 76%, 25%)` 
  - Hover / dark mode: `hsl(167, 82%, 17%)`
  - Tint bg: `hsl(159, 50%, 92%)`
  - Kullanım Alanı: Bildirimler, badge'ler, dikkat çekici etiketler.
- **Neutral Background (Arka Plan Renkleri):**
  - Light Mode: `hsl(0, 0%, 100%)`
  - Dark Mode: `hsl(60, 3%, 11%)`
- **Neutral Text (Yazı Renkleri):**
  - Light Mode:
    - Primary: hsl(60, 2%, 17%)
    - Secondary: hsl(48, 3%, 36%)
    - Muted: hsl(52, 3%, 52%)
  - Dark Mode:
    - Primary: hsl(47, 24%, 93%)
    - Secondary: hsl(49, 7%, 68%)
    - Muted: hsl(52, 3%, 52%)
- **Semantic Colors (Durum Renkleri):**
  - Success (Başarı):
    - base: hsl(87, 64%, 37%)
    - bg: hsl(86, 47%, 91%)
    - text: hsl(95, 78%, 18%)
  - Warning (Uyarı):
    - base: hsl(35, 78%, 41%)
    - bg: hsl(38, 76%, 92%)
    - text: hsl(32, 89%, 21%) 
  - Error (Hata):
    - base: hsl(0, 72%, 59%)
    - bg: hsl(0, 74%, 95%)
    - text: hsl(0, 59%, 30%)

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

- **`/404`**
  - Amaç: Bulunamayan sayfa.
  - Bileşenler:
    - Illustration
    - Error Message
    - Go Home Button

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

JSON Server kullanarak ayağa kaldıracağımız yerel API'nin veri yapısını burada tanımlayın.

```json
{
  "user": {
    "id": "u1",
    "name": "Alex Morgan",
    "email": "alex@crmapp.com",
    "jobTitle": "Sales Manager",
    "avatar": "https://i.pravatar.cc/150?img=12",
    "role": "admin"
  },
  "clients": [
    {
      "id": "c1",
      "firstName": "Maya",
      "lastName": "Rodriguez",
      "email": "m.rodriguez@acme.com",
      "phone": "+1 (415) 555-0172",
      "company": "Acme Inc.",
      "status": "active",
      "dealValue": 12000,
      "avatar": "https://i.pravatar.cc/150?img=32",
      "createdAt": "2026-03-14T09:20:00.000Z",
      "notes": "Interested in enterprise plan, follow up next week."
    },
    {
      "id": "c2",
      "firstName": "Jonas",
      "lastName": "Weber",
      "email": "jonas.weber@brightline.io",
      "phone": "+49 30 555 0142",
      "company": "Brightline GmbH",
      "status": "lead",
      "dealValue": 4500,
      "avatar": "https://i.pravatar.cc/150?img=15",
      "createdAt": "2026-05-02T14:05:00.000Z",
      "notes": "Requested a demo, waiting on scheduling."
    },
    {
      "id": "c3",
      "firstName": "Sara",
      "lastName": "Aksoy",
      "email": "sara.aksoy@northgate.com",
      "phone": "+90 212 555 0198",
      "company": "Northgate Ltd.",
      "status": "inactive",
      "dealValue": 0,
      "avatar": "https://i.pravatar.cc/150?img=47",
      "createdAt": "2025-11-19T11:40:00.000Z",
      "notes": "Churned, revisit in Q3."
    }
  ],
  "dashboard": {
    "stats": {
      "totalClients": 128,
      "activeDeals": 24,
      "revenue": 84500,
      "growth": 12.5
    },
    "recentActivity": [
      {
        "id": "a1",
        "type": "note",
        "clientId": "c1",
        "description": "Added a note to Maya Rodriguez",
        "timestamp": "2026-06-29T10:12:00.000Z"
      },
      {
        "id": "a2",
        "type": "deal",
        "clientId": "c2",
        "description": "New deal created for Jonas Weber",
        "timestamp": "2026-06-28T16:45:00.000Z"
      },
      {
        "id": "a3",
        "type": "status_change",
        "clientId": "c3",
        "description": "Sara Aksoy marked as inactive",
        "timestamp": "2026-06-27T09:30:00.000Z"
      }
    ],
    "upcomingTasks": [
      {
        "id": "t1",
        "title": "Follow up with Maya Rodriguez",
        "dueDate": "2026-07-03T09:00:00.000Z",
        "clientId": "c1"
      },
      {
        "id": "t2",
        "title": "Schedule demo with Jonas Weber",
        "dueDate": "2026-07-05T13:00:00.000Z",
        "clientId": "c2"
      },
      {
        "id": "t3",
        "title": "Send re-engagement email to Sara",
        "dueDate": "2026-07-10T11:00:00.000Z",
        "clientId": "c3"
      }
    ],
    "revenueChart": [
      { "month": "Apr", "revenue": 62000 },
      { "month": "May", "revenue": 74500 },
      { "month": "Jun", "revenue": 84500 }
    ]
  },
  "settings": {
    "profile": {
      "name": "Alex Morgan",
      "email": "alex@crmapp.com",
      "phone": "+1 (415) 555-0100",
      "jobTitle": "Sales Manager",
      "avatar": "https://i.pravatar.cc/150?img=12"
    },
    "notifications": {
      "emailNotifications": true,
      "pushNotifications": false,
      "weeklyReport": true
    },
    "preferences": {
      "theme": "light",
      "language": "en",
      "currency": "USD"
    },
    "team": [
      { "id": "tm1", "name": "Alex Morgan", "email": "alex@crmapp.com", "role": "admin" },
      { "id": "tm2", "name": "Priya Nair", "email": "priya@crmapp.com", "role": "editor" },
      { "id": "tm3", "name": "Leo Park", "email": "leo@crmapp.com", "role": "viewer" }
    ]
  }
}
```

---

## 5. Global State Yönetimi (Redux Toolkit)

Uygulamada kullanılacak global slice (state) yapılarını ve içerdikleri anahtar değerleri listeleyin.

# Redux State Yapısı

### 1. `authSlice`

- **State Yapısı:**
  ```javascript
  {
    user: null,
    isAuthenticated: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }
  ```

- **Async Thunk Eylemleri:**
  - `login(credentials)` -> Custom Login
  - `logout()`
  - `fetchCurrentUser()` -> `GET /users/:id`

---

### 2. `formsSlice`

- **State Yapısı:**
  ```javascript
  {
    items: [],
    currentForm: null,
    status: 'idle',
    error: null
  }
  ```

- **Async Thunk Eylemleri:**
  - `fetchForms()` -> `GET /forms`
  - `fetchForm(id)` -> `GET /forms/:id`
  - `createForm(formData)` -> `POST /forms`
  - `updateForm({ id, data })` -> `PATCH /forms/:id`
  - `deleteForm(id)` -> `DELETE /forms/:id`

---

### 3. `questionsSlice`

- **State Yapısı:**
  ```javascript
  {
    items: [],
    selectedQuestion: null,
    status: 'idle',
    error: null
  }
  ```

- **Async Thunk Eylemleri:**
  - `fetchQuestions(formId)` -> `GET /questions?formId=:formId`
  - `addQuestion(questionData)` -> `POST /questions`
  - `updateQuestion({ id, data })` -> `PATCH /questions/:id`
  - `deleteQuestion(id)` -> `DELETE /questions/:id`

---

### 4. `responsesSlice`

- **State Yapısı:**
  ```javascript
  {
    items: [],
    selectedResponse: null,
    status: 'idle',
    error: null
  }
  ```

- **Async Thunk Eylemleri:**
  - `fetchResponses(formId)` -> `GET /responses?formId=:formId`
  - `submitResponse(responseData)` -> `POST /responses`
  - `deleteResponse(id)` -> `DELETE /responses/:id`

---

### 5. `editorSlice`

> Form Builder ekranındaki geçici (UI) state.

- **State Yapısı:**
  ```javascript
  {
    selectedQuestionId: null,
    isPreviewMode: false,
    isDirty: false,
    dragItem: null
  }
  ```

- **Actions:**
  - `selectQuestion(id)`
  - `togglePreview()`
  - `setDirty(boolean)`
  - `setDragItem(item)`
  - `clearEditor()`

---

### 6. `aiSlice`

- **State Yapısı:**
  ```javascript
  {
    prompt: '',
    generatedQuestions: [],
    loading: false,
    error: null
  }
  ```

- **Async Thunk Eylemleri:**
  - `generateForm(prompt)` -> AI API

---

### 7. `uiSlice`

- **State Yapısı:**
  ```javascript
  {
    sidebarOpen: true,
    theme: 'light',
    search: '',
    loading: false
  }
  ```

- **Actions:**
  - `toggleSidebar()`
  - `toggleTheme()`
  - `setSearch(value)`
  - `setLoading(boolean)`

---

### Root Redux Store

```javascript
{
  auth: {
    user,
    isAuthenticated,
    status,
    error
  },

  forms: {
    items,
    currentForm,
    status,
    error
  },

  questions: {
    items,
    selectedQuestion,
    status,
    error
  },

  responses: {
    items,
    selectedResponse,
    status,
    error
  },

  editor: {
    selectedQuestionId,
    isPreviewMode,
    isDirty,
    dragItem
  },

  ai: {
    prompt,
    generatedQuestions,
    loading,
    error
  },

  ui: {
    sidebarOpen,
    theme,
    search,
    loading
  }
}
```

---

## 6. Antigravity Geliştirme Sırası ve Talimatları

Antigravity'nin bu `project.md` dosyasını okuyarak sırasıyla hangi adımları yapmasını bekliyoruz?

1. **Adım 1: Klasör Yapısını İncele ve Ayarla**:
   - `src/` klasörünün altında `components/`, `pages/`, `store/`, `hooks/` dizinlerini oluştur.
2. **Adım 2: Bağımlılıkları ve Konfigürasyonu Yapılandır**:
   - `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `axios`, `lucide-react`, `@mui/material @emotion/react @emotion/styled`, `@huggingface/inference` paketlerini yükle.
   - `tailwind.config.js` dosyasını yukarıda belirtilen renk paletine (HSL değerleriyle) göre güncelle.
3. **Adım 3: Store ve Slice Dosyalarını Oluştur**:
   - `store/index.js` dosyasını oluştur ve store'u uygulamaya bağla.
   - `authSlice.js` `formsSlice.js` `questionsSlice.js` `responsesSlice.js` `editorSlice.js` `aiSlice.js` `uiSlice.js` dosyalarını async thunk'ları ile birlikte yaz.
4. **Adım 4: JSON Server Kurulumu**:
   - Proje kökünde `db.json` dosyasını oluştur ve doldur.
   - Projenin `package.json` dosyasına `"server": "json-server --watch db.json --port 5000"` scriptini ekle.
5. **Adım 5: Sayfaları ve Yönlendirmeleri (Routing) Tasarla**:
   - `react-router-dom` ile sayfaları oluştur ve birbirine bağla.
   - Modern, responsive ve koyu mod destekli UI bileşenlerini geliştir.
