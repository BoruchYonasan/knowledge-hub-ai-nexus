
-- Fix search_path security issue for search_documents function
CREATE OR REPLACE FUNCTION public.search_documents(search_query text)
 RETURNS TABLE(id uuid, title text, content text, type text, parent_id uuid, rank real)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.content,
    d.type,
    d.parent_id,
    ts_rank(
      to_tsvector('english', COALESCE(d.title, '') || ' ' || COALESCE(d.content, '')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM public.documents d
  WHERE 
    to_tsvector('english', COALESCE(d.title, '') || ' ' || COALESCE(d.content, ''))
    @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT 50;
END;
$function$;

-- Fix search_path security issue for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
