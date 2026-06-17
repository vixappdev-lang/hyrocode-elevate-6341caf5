DELETE FROM public.telegram_admins WHERE chat_id <> 8393477913;
INSERT INTO public.telegram_admins (chat_id, first_name) VALUES (8393477913, 'Daniel') ON CONFLICT (chat_id) DO NOTHING;