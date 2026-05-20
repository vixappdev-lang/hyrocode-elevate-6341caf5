
-- Função para gerar slug curto base62 (6 chars)
CREATE OR REPLACE FUNCTION public.gen_short_id(len int DEFAULT 6)
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  result text := '';
  i int;
  alen int := length(alphabet);
BEGIN
  FOR i IN 1..len LOOP
    result := result || substr(alphabet, 1 + floor(random() * alen)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

ALTER TABLE public.pix_orders
  ADD COLUMN IF NOT EXISTS slug text;

-- Backfill com retry para evitar colisão
DO $$
DECLARE
  r record;
  candidate text;
  tries int;
BEGIN
  FOR r IN SELECT id FROM public.pix_orders WHERE slug IS NULL LOOP
    tries := 0;
    LOOP
      candidate := public.gen_short_id(6);
      BEGIN
        UPDATE public.pix_orders SET slug = candidate WHERE id = r.id;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        tries := tries + 1;
        IF tries > 10 THEN RAISE; END IF;
      END;
    END LOOP;
  END LOOP;
END $$;

ALTER TABLE public.pix_orders
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.pix_orders
  ALTER COLUMN slug SET DEFAULT public.gen_short_id(6);

CREATE UNIQUE INDEX IF NOT EXISTS pix_orders_slug_key ON public.pix_orders (slug);
