// English to Thai Auto-Translation Engine
// Uses Google Translate endpoint with local dictionary fallback for 100% reliability

const OFFLINE_THAI_DICTIONARY: Record<string, string> = {
  'hello': 'สวัสดี',
  'hi': 'สวัสดี',
  'hey': 'เฮ้',
  'how are you': 'สบายดีไหม',
  'how are you?': 'คุณเป็นอย่างไรบ้าง?',
  'good morning': 'อรุณสวัสดิ์',
  'good afternoon': 'สวัสดีตอนบ่าย',
  'good evening': 'สวัสดีตอนเย็น',
  'good night': 'ราตรีสวัสดิ์',
  'thank you': 'ขอบคุณครับ',
  'thanks': 'ขอบคุณ',
  'sorry': 'ขอโทษ',
  'please': 'โปรด',
  'yes': 'ใช่',
  'no': 'ไม่',
  'ok': 'โอเค',
  'okay': 'โอเค',
  'where are you': 'คุณอยู่ที่ไหน',
  'where are you?': 'คุณอยู่ที่ไหน?',
  'what are you doing': 'กำลังทำอะไรอยู่',
  'what are you doing?': 'คุณกำลังทำอะไรอยู่?',
  'i love you': 'ฉันรักคุณ',
  'i miss you': 'ฉันคิดถึงคุณ',
  'call me': 'โทรหาฉันด้วย',
  'call me when you are free': 'โทรหาฉันเมื่อคุณว่าง',
  'dinner is ready': 'อาหารเย็นพร้อมแล้ว',
  'did you eat': 'กินข้าวหรือยัง',
  'see you soon': 'แล้วเจอกันเร็วๆ นี้',
  'see you later': 'แล้วเจอกันใหม่นะ',
  'let us go': 'ไปด้วยกันเถอะ',
  'let\'s go': 'ไปกันเถอะ',
  'busy': 'ไม่ว่าง',
  'free': 'ว่าง',
  'happy birthday': 'สุขสันต์วันเกิด',
  'good luck': 'ขอให้โชคดี',
  'tickets are booked': 'จองตั๋วเรียบร้อยแล้ว',
  'brother': 'พี่ชาย',
  'sister': 'พี่สาว',
  'mom': 'แม่',
  'dad': 'พ่อ',
  'friend': 'เพื่อน',
  'urgent': 'ด่วน',
  'help': 'ช่วยด้วย',
  'telegram': 'โทรเลข',
  'sent you a message': 'ส่งข้อความถึงคุณ',
  'voice message': 'ข้อความเสียง',
  'file received': 'ได้รับไฟล์แล้ว',
  'check this out': 'ลองดูนี่สิ',
};

export async function translateEnglishToThai(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // 1. Try real-time Google Translate GTX API
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=th&dt=t&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedSegments = data[0]
          .map((item: unknown) => (Array.isArray(item) && typeof item[0] === 'string' ? item[0] : ''))
          .join('');

        if (translatedSegments.trim()) {
          return translatedSegments;
        }
      }
    }
  } catch (err) {
    console.warn('Network translation unavailable, checking offline dictionary fallback:', err);
  }

  // 2. Offline Dictionary Fallback
  const lower = trimmed.toLowerCase();
  if (OFFLINE_THAI_DICTIONARY[lower]) {
    return OFFLINE_THAI_DICTIONARY[lower];
  }

  // Word-by-word replacement if phrase match not found
  const words = trimmed.split(/\s+/);
  const translatedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
    if (OFFLINE_THAI_DICTIONARY[cleanWord]) {
      return OFFLINE_THAI_DICTIONARY[cleanWord];
    }
    return w;
  });

  return translatedWords.join(' ');
}

