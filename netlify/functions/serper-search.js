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
        const apiKey = process.env.SERPER_API_KEY;

        console.log('DEBUG: Serper API key exists?', !!apiKey);

        if (!apiKey) {
            console.error('ERROR: Serper API key not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Search API key not configured',
                    message: 'Please add SERPER_API_KEY to environment variables'
                })
            };
        }

        // Parse the request body
        const { query } = JSON.parse(event.body);

        if (!query) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Search query is required' })
            };
        }

        console.log('DEBUG: Searching for:', query);

        // Call Serper.dev API
        const serperResponse = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: query,
                num: 5 // Get top 5 results
            })
        });

        console.log('DEBUG: Serper response status:', serperResponse.status);

        if (!serperResponse.ok) {
            const errorText = await serperResponse.text();
            console.error('ERROR: Serper API error:', serperResponse.status, errorText);

            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: `Search API error: ${serperResponse.status}`,
                    details: errorText.substring(0, 200)
                })
            };
        }

        const data = await serperResponse.json();
        console.log('DEBUG: Serper search completed');

        // Format search results
        const results = [];

        // Add organic results
        if (data.organic && data.organic.length > 0) {
            data.organic.slice(0, 5).forEach(result => {
                results.push({
                    title: result.title,
                    snippet: result.snippet,
                    link: result.link
                });
            });
        }

        // Add knowledge graph if available
        let knowledgeGraph = null;
        if (data.knowledgeGraph) {
            knowledgeGraph = {
                title: data.knowledgeGraph.title,
                description: data.knowledgeGraph.description,
                type: data.knowledgeGraph.type
            };
        }

        // Return the formatted results
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                query: query,
                results: results,
                knowledgeGraph: knowledgeGraph,
                searchTime: new Date().toISOString()
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
