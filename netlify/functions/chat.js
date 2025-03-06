// netlify/functions/chat.js
const axios = require('axios');

exports.handler = async function(event, context) {
  console.log("Function started - Method:", event.httpMethod);
  
  // التعامل مع طلبات CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log("Handling OPTIONS request");
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
    console.log("Request body:", event.body);
    const requestData = JSON.parse(event.body);
    console.log("Parsed request data:", requestData);
    
    // استخدام مفتاح DeepSeek API بدلاً من OpenAI
    const apiKey = process.env.DEEPSEEK_API_KEY;
    console.log("API Key exists:", !!apiKey);
    
    // اختبار وجود مفتاح API
    if (!apiKey) {
      console.log("API key missing, returning error");
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ error: 'API key is missing' })
      };
    }
    
    // اختبار وجود الرسائل
    if (!requestData.messages || !Array.isArray(requestData.messages)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }
    
    // إعداد الاتصال بـ DeepSeek API
    try {
      const deepseekResponse = await axios({
        method: 'post',
        url: 'https://api.deepseek.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: "deepseek-chat", // يمكنك تغيير النموذج حسب احتياجاتك
          messages: requestData.messages,
          max_tokens: 1000 // عدد الرموز الأقصى للرد
        }
      });
      
      console.log("DeepSeek API response received");
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify(deepseekResponse.data)
      };
    } catch (apiError) {
      console.log("API Error:", apiError.response ? apiError.response.data : apiError);
      
      // إرجاع رسالة اختبارية في حالة الخطأ
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
                content: "هذه رسالة اختبارية. حدث خطأ أثناء الاتصال بـ DeepSeek API. الرجاء التحقق من مفتاح API والاتصال بالإنترنت."
              }
            }
          ]
        })
      };
    }
  } catch (error) {
    console.log("Error occurred:", error.message);
    console.log("Error stack:", error.stack);
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
