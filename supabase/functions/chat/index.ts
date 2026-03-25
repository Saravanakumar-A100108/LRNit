
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query } = await req.json()
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const apiKey = Deno.env.get('GEMINI_API_KEY') ?? ''

        // 1. Generate embedding using text-embedding-004 on v1beta
        const embResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'models/text-embedding-004',
                    content: { parts: [{ text: query }] }
                })
            }
        )

        const embResult = await embResponse.json()
        if (!embResponse.ok) throw new Error(`Embedding Error: ${JSON.stringify(embResult)}`)
        const queryEmbedding = embResult.embedding.values

        // 2. Search for relevant context
        const { data: contextData, error: matchError } = await supabaseClient.rpc('match_knowledge', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3,
            match_count: 5,
        })

        if (matchError) throw matchError

        const contextText = contextData?.map((item: any) => item.content).join("\n") || ""

        // 3. Generate response using gemini-1.5-flash on v1beta
        const chatResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
            You are the LRNit Superbot, a helpful and friendly assistant for the LRNit organization.
            Use the following pieces of context to answer the user's question.
            If you don't know the answer based on the context, say that you don't have that info.
            Keep the answer concise and professional.

            Context:
            ${contextText}

            User Question: ${query}

            Answer:
          ` }]
                    }]
                })
            }
        )

        const chatResult = await chatResponse.json()
        if (!chatResponse.ok) throw new Error(`Chat Error: ${JSON.stringify(chatResult)}`)

        const responseText = chatResult.candidates[0].content.parts[0].text

        return new Response(JSON.stringify({ answer: responseText }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
