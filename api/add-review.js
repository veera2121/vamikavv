import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await req.json();  // ✅ Parse JSON manually
    const { product_id, name, rating, review } = body;

    const { error } = await supabase
      .from('reviews')
      .insert([{ product_id, name, rating, review }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
