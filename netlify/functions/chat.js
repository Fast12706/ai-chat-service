// netlify/functions/chat.js
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
    
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API Key exists:", !!apiKey);
    console.log("API Key first chars:", apiKey ? apiKey.substring(0, 5) + "..." : "undefined");
    
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
    
    // إرجاع استجابة اختبار
    console.log("Returning test response");
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
