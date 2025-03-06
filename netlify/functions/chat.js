```javascript
// netlify/functions/chat.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // التحقق من طريقة الطلب
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'طريقة غير مسموح بها' })
    };
  }

  try {
    // استخراج بيانات الطلب
    const requestData = JSON.parse(event.body);
    
    // التحقق من وجود البيانات المطلوبة
    if (!requestData.messages) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'البيانات غير كاملة' })
      };
    }

    // الحصول على مفتاح API من متغيرات البيئة
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'مفتاح API غير متوفر' })
      };
    }

    // إرسال الطلب إلى OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: requestData.messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // إرجاع البيانات للعميل
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('خطأ:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي',
        details: error.response?.data || error.message
      })
    };
  }
};
```
