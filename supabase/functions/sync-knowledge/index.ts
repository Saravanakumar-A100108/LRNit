
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
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const apiKey = Deno.env.get('GEMINI_API_KEY') ?? ''

        // 1. Fetch data from tables
        const { data: programs } = await supabaseClient.from('programs').select('*')
        const { data: announcements } = await supabaseClient.from('announcements').select('*')
        const { data: team } = await supabaseClient.from('team_members').select('*')

        const knowledgeItems: { content: string; metadata: object }[] = []

        programs?.forEach((p: any) => {
            knowledgeItems.push({
                content: `Program/Event: ${p.title}. Description: ${p.description}.`,
                metadata: { type: 'program', id: p.id }
            })
        })

        announcements?.forEach((a: any) => {
            knowledgeItems.push({
                content: `Announcement: ${a.title}. Content: ${a.content}. Date: ${a.date}`,
                metadata: { type: 'announcement', id: a.id }
            })
        })

        team?.forEach((t: any) => {
            knowledgeItems.push({
                content: `Team Member: ${t.name}. Role: ${t.role}. Department: ${t.department}.`,
                metadata: { type: 'team_member', id: t.id }
            })
        })

        // 2. Generate embeddings using text-embedding-004 on v1beta
        for (const item of knowledgeItems) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'models/text-embedding-004',
                        content: { parts: [{ text: item.content }] }
                    })
                }
            )

            const result = await response.json()
            if (!response.ok) throw new Error(`Gemini Error: ${JSON.stringify(result)}`)

            const embedding = result.embedding.values

            await supabaseClient.from('knowledge_embeddings').upsert({
                content: item.content,
                metadata: item.metadata,
                embedding: embedding
            }, { onConflict: 'content' })
        }

        return new Response(JSON.stringify({ success: true, count: knowledgeItems.length }), {
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
