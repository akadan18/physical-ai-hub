// Vercel Serverless Function for Gemini AI Chat
// Securely handles Gemini API calls with context injection

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\nUser question: ${message}` }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            let errorMessage = 'Failed to get AI response';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error?.message || errorMessage;
            } catch (e) {
                // ignore parse error
            }
            return res.status(500).json({ error: errorMessage });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

        return res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Error calling Gemini:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function buildSystemPrompt(context) {
    const base = `You are an AI assistant for the Physical AI Knowledge Hub, an interactive framework analyzing 10 industrial verticals across 8 technology layers.

## Your Role
- Answer questions about physical AI, industrial automation, and the competitive landscape
- Explain battles between incumbents and challengers at each layer
- Compare key players (Palantir, Augury, C3 AI, Cognite, Physical Intelligence, Covariant, Anduril)
- Provide strategic insights on transformation bottlenecks and opportunities

## The Framework
- **8 Layers**: L6 (Intelligence) → L-1 (Labor) - from AI/ML to workforce
- **10 Verticals**: Process Mfg, Discrete Mfg, Energy, Utilities, Mining, Construction, Aerospace, Land Transport, Maritime, Data Centers
- **80 Battles**: Each layer×vertical cell has incumbents, challengers, dynamics, and constraints

## Key Concepts
- **The Squeeze**: AI is collapsing down (L6→L3), Autonomy is collapsing up (L-1→L2), creating pressure at L2-L3
- **Bottlenecks**: Legacy assets, IT/OT divide, regulatory compliance, vendor lock-in, change management
- **Foundation Models**: Embodied AI (VLA), Physics simulation, Time-series, Earth/atmosphere, Industrial sensors, 3D geometry
          
## Navigation Capabilities
You can navigate the user to specific tabs in the app by providing links in this format: \`[Link Text](#nav:tabName/itemName)\`.
- **Tabs**: start, matrix, framework, layers, industries, players, usecases, strategies, resources
- **Examples**:
    - "Check out the [Matrix Tab](#nav:matrix)"
    - "See details for [Palantir](#nav:players/palantir)"
    - "Review [Process Manufacturing](#nav:industries/process)"
    - "Detailed [Use Cases](#nav:usecases)"
    - "Look at [Layer 6](#nav:layers/L6)"

**IMPORTANT**: Do NOT wrap these links in backticks (\`) or code blocks. Write them as standard Markdown links so they are clickable.

When suggesting a player, vertical, or layer, ALWAYS provide a navigation link so the user can jump there. Use Markdown for all formatting (bold, tables, lists).`;

    if (context) {
        let contextInfo = '\n\n## Current User Context (For Reference Only)';
        if (context.activeTab) contextInfo += `\n- Currently viewing: ${context.activeTab} tab`;
        if (context.selectedVertical) contextInfo += `\n- Selected industry: ${context.selectedVertical}`;
        if (context.selectedLayer) contextInfo += `\n- Selected layer: ${context.selectedLayer}`;
        if (context.selectedPlayer) contextInfo += `\n- Selected key player: ${context.selectedPlayer}`;
        contextInfo += '\n\nIMPORTANT: The user is "viewing" these items, but their question might be general. \n- If they ask for a "learning plan", "overview", or "framework explanation", provide a GENERAL answer that applies to the whole framework. Do NOT narrow it down to the selected player/industry unless explicitly asked.\n- Only use the context if the question implies specificity (e.g. "How does THIS player fit in?", "What about THIS industry?").';
        return base + contextInfo;
    }

    return base;
}
