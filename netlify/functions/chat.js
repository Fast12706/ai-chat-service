const axios = require('axios');

exports.handler = async function(event, context) {
  // Check HTTP method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { patientInfo } = JSON.parse(event.body);
    
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

    // Call Claude API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-7-sonnet-20250219",
        system: systemPrompt,
        messages: [
          { role: "user", content: patientInfo }
        ],
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        response: response.data.content[0].text 
      })
    };
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    
    // Determine error message language based on error text if possible
    // Default to English for system errors
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error processing your request / حدث خطأ في معالجة طلبك',
        details: error.message 
      })
    };
  }
};