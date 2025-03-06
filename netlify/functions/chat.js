// netlify/functions/chat.js
exports.handler = async function(event, context) {
  // التعامل مع طلبات CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      },
      body: ""
    };
  }

  // التعامل مع الطلبات العادية
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
    
    // إرجاع استجابة اختبار
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
              content: "هذه رسالة اختبار. تم الاتصال بنجاح! مفتاح API موجود ويبدأ بـ: " + apiKey.substring(0, 5) + "..."
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
