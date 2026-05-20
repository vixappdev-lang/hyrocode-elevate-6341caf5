-- Allow 'draft' status on pix_orders so we can create orders before customer fills the form
ALTER TABLE public.pix_orders
  ALTER COLUMN customer_name DROP NOT NULL,
  ALTER COLUMN customer_email DROP NOT NULL,
  ALTER COLUMN customer_cpf DROP NOT NULL;

-- Authorized Telegram chat IDs for the admin bot
CREATE TABLE IF NOT EXISTS public.telegram_admins (
  chat_id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no public access to telegram_admins"
  ON public.telegram_admins FOR SELECT
  USING (false);

CREATE INDEX IF NOT EXISTS idx_pix_orders_created_at ON public.pix_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_created_at ON public.visitor_events (created_at DESC);