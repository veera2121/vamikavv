import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { product_id } = req.query;

  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product_id)
    .order('created_at', { ascending: false });

  res.json(data);
}
