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
    const { product_id, name, rating, review } = req.body; // ✅ FIX

    if (!product_id || !name || !rating || !review) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase
      .from('reviews')
      .insert([{
        product_id,
        customer_name: name,
        rating: Number(rating),
        review,
        is_verified: false,
        image_url: null
      }]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
