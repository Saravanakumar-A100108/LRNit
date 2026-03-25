
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop old table if it exists (will recreate with correct dimensions)
DROP TABLE IF EXISTS public.knowledge_embeddings CASCADE;

-- Create knowledge_embeddings table
-- embedding-001 produces 768-dimensional vectors
CREATE TABLE public.knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to embeddings (needed for the search RPC)
CREATE POLICY "Public read knowledge" ON public.knowledge_embeddings FOR SELECT USING (true);

-- Allow service role to insert/update
CREATE POLICY "Service role full access" ON public.knowledge_embeddings FOR ALL USING (true);

-- Function to match knowledge using cosine similarity
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
