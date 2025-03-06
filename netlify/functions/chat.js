```javascript
{
  message: "Function is working",
  apiKeyExists: true,
  apiKeyFirstChars: apiKey.substring(0, 5) + "..."
}
```

لحل هذه المشكلة، يمكننا تعديل ملف `chat.js` المبسط ليتوافق بشكل أفضل مع ما يتوقعه ملف index.html:

```javascript
// netlify/functions/chat.js - نسخة معدلة للاختبار
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // اختبار وجود مفتاح API
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ error: 'API key is missing' })
      };
    }
    
    // محاكاة استجابة OpenAI
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        choices: [
          {
            message: {
              content: "هذه رسالة اختبار. مفتاح API موجود ويبدأ بـ: " + apiKey.substring(0, 5) + "..."
            }
          }
        ]
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
```
