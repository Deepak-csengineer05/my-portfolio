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

        if (!apiKey) {
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

        // Call Gemini API
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

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

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            throw new Error(`Gemini API error: ${errorText}`);
        }

        const data = await geminiResponse.json();

        // Return the response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                response: data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'Internal server error'
            })
        };
    }
};
