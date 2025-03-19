const axios = require('axios');

exports.handler = async function(event, context) {
  // Check HTTP method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { patientInfo } = JSON.parse(event.body);
    
    console.log("Received patientInfo:", patientInfo); // سجل لمعرفة ما تم استلامه

    // Medical documentation system prompt with language flexibility
    const systemPrompt = `You are an experienced emergency medicine consultant with over 20 years of expertise in handling critical cases and applying medico-legal principles.

Create comprehensive medical documentation for the case with emphasis on:
- Documentation of negative findings to rule out serious conditions
- Explicit timing of all assessments and interventions
- Documentation of patient refusals and risks explained
- Clarity about consultation with specialists
- Transparency about delays or systems issues
- Reference to medical literature/guidelines when applicable

Important: Respond in the same language that the user used in their input. If the user writes in Arabic, respond in Arabic. If the user writes in English, respond in English. Always maintain professional medical terminology appropriate for the language used.`;

    // Prepare request body for Claude API
    const requestBody = {
      model: "claude-3-7-sonnet-20250219",
      system: systemPrompt,
      messages: [
        { role: "user", content: patientInfo }
      ],
      max_tokens: 2000
    };
    
    console.log("Sending request to Claude API:", JSON.stringify(requestBody));

    // Call Claude API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    console.log("Claude API response status:", response.status);
    console.log("Claude API response structure:", Object.keys(response.data));
    
    // Check if the response has the expected structure
    if (response.data.content && response.data.content.length > 0) {
      console.log("Claude response text found");
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          response: response.data.content[0].text,
          success: true
        })
      };
    } else {
      console.log("Unexpected Claude API response structure:", JSON.stringify(response.data));
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          response: "غير قادر على معالجة الرد من الخدمة. الهيكل غير متوقع.",
          data: response.data,
          success: false
        })
      };
    }
    
  } catch (error) {
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    // Log more details depending on error type
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error processing your request / حدث خطأ في معالجة طلبك',
        details: error.message,
        type: error.name,
        success: false
      })
    };
  }
};