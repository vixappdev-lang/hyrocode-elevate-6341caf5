
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.pix_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  plan_key text NOT NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'brl',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_cpf text NOT NULL,
  customer_about text,
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text UNIQUE,
  pix_qr_data text,
  pix_qr_image_url text,
  expires_at timestamptz
);

ALTER TABLE public.pix_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read pix orders"
ON public.pix_orders
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_pix_orders_status ON public.pix_orders(status);
CREATE INDEX idx_pix_orders_created_at ON public.pix_orders(created_at DESC);

CREATE TRIGGER update_pix_orders_updated_at
BEFORE UPDATE ON public.pix_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
