const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get the API key from environment variables (secure!)
        const apiKey = process.env.GEMINI_API_KEY;

        console.log('DEBUG: API key exists?', !!apiKey);
        console.log('DEBUG: API key length:', apiKey ? apiKey.length : 0);

        if (!apiKey) {
            console.error('ERROR: API key not configured');
            throw new Error('API key not configured');
        }

        // Parse the request body
        const { message, conversationHistory } = JSON.parse(event.body);

        if (!message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        console.log('DEBUG: Calling Gemini API...');

        // Call Gemini API
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        console.log('DEBUG: Gemini response status:', geminiResponse.status);

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            console.error('ERROR: Gemini API error:', geminiResponse.status, errorText);

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: `Gemini API error: ${geminiResponse.status}`,
                    details: errorText.substring(0, 200) // First 200 chars
                })
            };
        }

        const data = await geminiResponse.json();
        console.log('DEBUG: Gemini response received');

        // Return the response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                response: data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
            })
        };

    } catch (error) {
        console.error('ERROR: Exception:', error.message, error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'Internal server error',
                stack: error.stack ? error.stack.substring(0, 200) : 'No stack trace'
            })
        };
    }
};
