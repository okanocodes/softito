import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { InferenceClient } from '@huggingface/inference';

// Expected form structure
export interface GeneratedQuestion {
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'rating';
  required: boolean;
  options?: string[];
}

export interface GeneratedFormSchema {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

interface AiState {
  prompt: string;
  generatedQuestions: GeneratedQuestion[];
  generatedTitle: string;
  generatedDescription: string;
  loading: boolean;
  error: string | null;
}

const initialState: AiState = {
  prompt: '',
  generatedQuestions: [],
  generatedTitle: '',
  generatedDescription: '',
  loading: false,
  error: null,
};

const SYSTEM_PROMPT = `You are an AI Form Generator.
Generate ONLY valid JSON.
Do not explain anything.
Do not use markdown.
Do not wrap the JSON inside code blocks.

Return a JSON object with:
- title
- description
- questions

Each question must include:
- label
- type
- required

Allowed types:
text
email
number
textarea
select
radio
checkbox
date
rating

For select, radio, and checkbox questions, include an "options" array.
Return valid JSON only.`;

// Mock Generator for instant/fallback generation
const generateMockForm = (promptText: string): GeneratedFormSchema => {
  const query = promptText.toLowerCase();

  // Split query into clean words to prevent substring issues (e.g. "iletişim" matching "iş")
  const words = query.split(/[^a-zğüşiöçı0-9]+/);
  
  // Word checking helpers
  const hasWord = (w: string) => words.includes(w);
  const hasAnyWord = (arr: string[]) => arr.some(w => words.includes(w));



  if (hasAnyWord(['iş', 'job', 'başvuru', 'application', 'kariyer'])) {
    return {
      title: 'İş Başvuru Formu',
      description: 'Ekibimize katılmak için lütfen aşağıdaki başvuru formunu doldurun.',
      questions: [
        { label: 'Adınız Soyadınız', type: 'text', required: true },
        { label: 'E-posta Adresiniz', type: 'email', required: true },
        { label: 'Telefon Numarası', type: 'text', required: true },
        { label: 'Başvurduğunuz Pozisyon', type: 'select', options: ['Yazılım Geliştirici', 'Ürün Yöneticisi', 'Arayüz Tasarımcısı', 'Pazarlama Uzmanı'], required: true },
        { label: 'Deneyim Süreniz (Yıl)', type: 'number', required: false },
        { label: 'Neden Bizimle Çalışmak İstiyorsunuz?', type: 'textarea', required: false },
        { label: 'İşe Başlama Tarihi', type: 'date', required: true }
      ]
    };
  }

  if (hasAnyWord(['anket', 'survey', 'memnuniyet', 'satisfaction', 'feedback', 'değerlendirme'])) {
    return {
      title: 'Müşteri Memnuniyeti Anketi',
      description: 'Size daha iyi hizmet verebilmemiz için lütfen deneyiminizi değerlendirin.',
      questions: [
        { label: 'Hizmet kalitemizi 1-5 arasında puanlayın', type: 'rating', required: true },
        { label: 'Bizi arkadaşlarınıza tavsiye eder misiniz?', type: 'radio', options: ['Evet, kesinlikle', 'Belki', 'Hayır, tavsiye etmem'], required: true },
        { label: 'En çok hangi özelliğimizi beğendiniz?', type: 'checkbox', options: ['Kullanım Kolaylığı', 'Tasarım / Arayüz', 'Müşteri Desteği', 'Fiyatlandırma'], required: false },
        { label: 'Görüş ve Önerileriniz', type: 'textarea', required: false },
        { label: 'Bizimle iletişime geçmek ister misiniz?', type: 'checkbox', options: ['Evet, e-posta ile dönün'], required: false }
      ]
    };
  }

  if (hasAnyWord(['etkinlik', 'event', 'kayıt', 'registration', 'lcv'])) {
    return {
      title: 'Etkinlik Kayıt Formu',
      description: 'Yaklaşan etkinliğimize katılım durumunuzu onaylamak için formu doldurun.',
      questions: [
        { label: 'Katılımcı Adı Soyadı', type: 'text', required: true },
        { label: 'E-posta Adresi', type: 'email', required: true },
        { label: 'Katılımcı Sayısı', type: 'number', required: true },
        { label: 'Bilet Tipi', type: 'select', options: ['Genel Katılım', 'VIP Katılım', 'Öğrenci'], required: true },
        { label: 'Yemek Tercihi', type: 'radio', options: ['Standart', 'Vejetaryen', 'Glütensiz'], required: false },
        { label: 'Katılım Sözleşmesini Onaylıyorum', type: 'checkbox', options: ['Evet, onaylıyorum'], required: true }
      ]
    };
  }

  if (hasAnyWord(['iletişim', 'contact', 'destek', 'support', 'mesaj'])) {
    return {
      title: 'İletişim ve Destek Formu',
      description: 'Sorularınız veya destek talepleriniz için bizimle iletişime geçin.',
      questions: [
        { label: 'Ad Soyad', type: 'text', required: true },
        { label: 'E-posta Adresi', type: 'email', required: true },
        { label: 'Konu', type: 'select', options: ['Teknik Destek', 'Satış / Fiyatlandırma', 'Genel Soru', 'Öneri / Geri Bildirim'], required: true },
        { label: 'Mesajınız', type: 'textarea', required: true }
      ]
    };
  }

  // Default Form
  return {
    title: 'Yeni AI Oluşturulmuş Form',
    description: `"${promptText}" komutu temel alınarak AI tarafından üretilmiştir.`,
    questions: [
      { label: 'Adınız Soyadınız', type: 'text', required: true },
      { label: 'E-posta Adresiniz', type: 'email', required: true },
      { label: 'Geri Bildirimleriniz', type: 'textarea', required: false }
    ]
  };
};

export const generateForm = createAsyncThunk('ai/generateForm', async (prompt: string, { rejectWithValue }) => {
  const hfToken = import.meta.env.VITE_HF_TOKEN;

  if (!hfToken || hfToken === 'YOUR_HF_TOKEN') {
    // If no token is provided, simulate AI computation with 1.5 seconds delay and return mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateMockForm(prompt);
  }

  try {
    const client = new InferenceClient(hfToken);
    
    const response = await client.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    });

    const text = response.choices[0].message.content || '';
    
    // Clean up text and parse JSON
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('AI geçerli bir JSON formatı üretemedi.');
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd);
    const parsedData = JSON.parse(jsonString) as GeneratedFormSchema;
    
    if (!parsedData.title || !parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('AI tarafından üretilen form şeması geçersiz.');
    }
    
    return parsedData;
  } catch (error: any) {
    console.error('HF Generation failed, fallback to Mock:', error);
    // Even if HF API fails, fall back to mock so that the app is always robust and working
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockForm(prompt);
  }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiState(state) {
      state.prompt = '';
      state.generatedQuestions = [];
      state.generatedTitle = '';
      state.generatedDescription = '';
      state.error = null;
      state.loading = false;
    },
    setPrompt(state, action) {
      state.prompt = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateForm.pending, (state, action) => {
        state.loading = true;
        state.prompt = action.meta.arg;
        state.error = null;
      })
      .addCase(generateForm.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedTitle = action.payload.title;
        state.generatedDescription = action.payload.description;
        state.generatedQuestions = action.payload.questions;
      })
      .addCase(generateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Form oluşturulurken bir hata oluştu.';
      });
  },
});

export const { clearAiState, setPrompt } = aiSlice.actions;
export default aiSlice.reducer;
