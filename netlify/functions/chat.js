
```javascript
// netlify/functions/chat.js - نسخة مبسطة للاختبار
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // اختبار وجود مفتاح API
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key is missing' })
      };
    }
    
    // اختبار بسيط بدلاً من استدعاء OpenAI
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Function is working",
        apiKeyExists: true,
        apiKeyFirstChars: apiKey.substring(0, 5) + "..." // عرض أول 5 أحرف فقط للأمان
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```
