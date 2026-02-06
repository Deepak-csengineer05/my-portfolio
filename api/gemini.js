// Vercel Serverless Function: Gemini AI Proxy
// Path: /api/gemini.js

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('ERROR: GEMINI_API_KEY not configured');
            return res.status(500).json({ error: 'API key not configured' });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Models to try in order (fallback chain)
        const models = [
            'gemini-2.5-flash-lite',
            'gemini-2.5-flash',
            'gemini-1.5-flash'
        ];

        let lastError = null;

        // Try each model until one succeeds
        for (const model of models) {
            try {
                console.log(`Trying model: ${model}`);

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                const geminiResponse = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: message }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 900
                        }
                    })
                });

                // If rate limited (429), try next model
                if (geminiResponse.status === 429) {
                    console.log(`${model} rate limited (429), trying next...`);
                    lastError = { status: 429, model: model };
                    continue;
                }

                // If other error, try next model
                if (!geminiResponse.ok) {
                    const errorText = await geminiResponse.text();
                    console.error(`${model} API error:`, geminiResponse.status);
                    lastError = { status: geminiResponse.status, model: model };
                    continue;
                }

                // Success! Parse and return response
                const data = await geminiResponse.json();
                console.log(`SUCCESS: ${model} response received`);

                return res.status(200).json({
                    response: data.candidates[0]?.content?.parts[0]?.text || 'No response generated',
                    modelUsed: model
                });

            } catch (modelError) {
                console.error(`${model} failed:`, modelError.message);
                lastError = { model: model, error: modelError.message };
                continue;
            }
        }

        // All models failed
        console.error('All models failed');
        return res.status(503).json({
            error: 'All AI models are currently unavailable or rate limited',
            lastError: lastError,
            suggestion: 'Please try again in a few moments'
        });

    } catch (error) {
        console.error('Function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
