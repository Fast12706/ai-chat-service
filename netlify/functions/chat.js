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
    
    // استخراج رسالة المستخدم الأخيرة
    let userMessage = "مرحباً";
    if (requestData.messages && Array.isArray(requestData.messages)) {
      for (let i = requestData.messages.length - 1; i >= 0; i--) {
        if (requestData.messages[i].role === 'user') {
          userMessage = requestData.messages[i].content;
          break;
        }
      }
    }
    
    // إنشاء رد مخصص بناءً على الرسالة
    let botReply = "مرحباً! كيف يمكنني مساعدتك؟";
    
    if (userMessage.includes("مرحبا") || userMessage.includes("أهلا") || userMessage.includes("Hi") || userMessage.includes("hi")) {
      botReply = "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟";
    } else if (userMessage.includes("شكر") || userMessage.includes("thanks")) {
      botReply = "العفو! سعيد بمساعدتك.";
    } else if (userMessage.includes("اسم")) {
      botReply = "أنا مساعد ذكي صممت لمساعدتك في الإجابة على أسئلتك.";
    } else if (userMessage.includes("صحة") || userMessage.includes("مرض") || userMessage.includes("دكتور")) {
      botReply = "أنا مساعد للمعلومات العامة فقط ولست مؤهلاً لتقديم استشارات طبية. يرجى استشارة الطبيب المختص دائماً للحصول على مشورة طبية.";
    } else if (userMessage.length < 10) {
      botReply = "هل يمكنك توضيح طلبك بمزيد من التفاصيل لأتمكن من مساعدتك بشكل أفضل؟";
    } else {
      botReply = "شكراً على رسالتك. هذه نسخة تجريبية من المساعد الذكي. سيتم تطوير الإجابات قريباً للتفاعل بشكل أفضل مع استفساراتك. نشكرك على تفهمك أثناء فترة الصيانة.";
    }
    
    console.log("Sending test reply");
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
              content: botReply
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
