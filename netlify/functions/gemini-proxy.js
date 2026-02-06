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

        // Models to try in order (fallback chain)
        const models = [
            'gemini-2.5-flash-lite',
            'gemini-2.5-flash',
            'gemini-3.0-flash-lite',
            'gemini-3.0-flash'
        ];

        let lastError = null;

        // Try each model until one succeeds
        for (const model of models) {
            try {
                console.log(`DEBUG: Trying model: ${model}`);

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
                            maxOutputTokens: 900
                        }
                    })
                });

                console.log(`DEBUG: ${model} response status:`, geminiResponse.status);

                // If rate limited (429), try next model
                if (geminiResponse.status === 429) {
                    console.log(`WARN: ${model} rate limited (429), trying next model...`);
                    lastError = { status: 429, model: model };
                    continue; // Try next model
                }

                // If other error, return it
                if (!geminiResponse.ok) {
                    const errorText = await geminiResponse.text();
                    console.error(`ERROR: ${model} API error:`, geminiResponse.status, errorText);

                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({
                            error: `${model} API error: ${geminiResponse.status}`,
                            details: errorText.substring(0, 200)
                        })
                    };
                }

                // Success! Parse and return response
                const data = await geminiResponse.json();
                console.log(`SUCCESS: ${model} response received`);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        response: data.candidates[0]?.content?.parts[0]?.text || 'No response generated',
                        modelUsed: model
                    })
                };

            } catch (modelError) {
                console.error(`ERROR: ${model} failed:`, modelError.message);
                lastError = { model: model, error: modelError.message };
                continue; // Try next model
            }
        }

        // All models failed
        console.error('ERROR: All models failed');
        return {
            statusCode: 503,
            headers,
            body: JSON.stringify({
                error: 'All AI models are currently unavailable or rate limited',
                lastError: lastError,
                suggestion: 'Please try again in a few moments'
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
