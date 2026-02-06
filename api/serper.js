// Vercel Serverless Function: Serper Web Search Proxy
// Path: /api/serper.js

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
        const apiKey = process.env.SERPER_API_KEY;

        if (!apiKey) {
            console.error('ERROR: SERPER_API_KEY not configured');
            return res.status(500).json({
                error: 'API key not configured',
                message: 'Serper API key is missing in environment variables'
            });
        }

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        console.log('Performing web search for:', query);

        const serperResponse = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: query,
                num: 3  // Get top 3 results
            })
        });

        if (!serperResponse.ok) {
            const errorText = await serperResponse.text();
            console.error('Serper API error:', serperResponse.status);

            return res.status(serperResponse.status).json({
                error: `Serper API error: ${serperResponse.status}`,
                details: errorText.substring(0, 200)
            });
        }

        const data = await serperResponse.json();

        // Format response to match expected structure
        const formattedData = {
            results: data.organic?.slice(0, 3).map(r => ({
                title: r.title,
                snippet: r.snippet,
                link: r.link
            })) || [],
            knowledgeGraph: data.knowledgeGraph
        };

        console.log('Web search completed:', formattedData.results.length, 'results');

        return res.status(200).json(formattedData);

    } catch (error) {
        console.error('Function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
