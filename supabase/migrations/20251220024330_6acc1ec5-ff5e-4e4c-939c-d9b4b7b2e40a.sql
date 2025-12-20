-- Allow public/anonymous access for demo mode conversations
CREATE POLICY "Allow public insert for demo mode" 
ON public.conversations 
FOR INSERT 
WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow public select for demo conversations" 
ON public.conversations 
FOR SELECT 
USING (user_id IS NULL);

CREATE POLICY "Allow public update for demo conversations" 
ON public.conversations 
FOR UPDATE 
USING (user_id IS NULL);

CREATE POLICY "Allow public delete for demo conversations" 
ON public.conversations 
FOR DELETE 
USING (user_id IS NULL);

-- Also add for messages table
CREATE POLICY "Allow public insert messages for demo" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND user_id IS NULL
  )
);

CREATE POLICY "Allow public select messages for demo" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND user_id IS NULL
  )
);

CREATE POLICY "Allow public update messages for demo" 
ON public.messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND user_id IS NULL
  )
);

CREATE POLICY "Allow public delete messages for demo" 
ON public.messages 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND user_id IS NULL
  )
);