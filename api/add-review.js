import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form error' })

    let imageUrl = null

    if (files.image) {
      const file = files.image
      const fileData = fs.readFileSync(file.filepath)
      const fileName = `reviews/${Date.now()}-${file.originalFilename}`

      const { error } = await supabase.storage
        .from('review-images')
        .upload(fileName, fileData, {
          contentType: file.mimetype
        })

      if (!error) {
        imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/review-images/${fileName}`
      }
    }

    const { error } = await supabase.from('reviews').insert([{
      product_id: fields.product_id,
      customer_name: fields.name,
      rating: fields.rating,
      review: fields.review,
      image_url: imageUrl
    }])

    if (error) return res.status(500).json({ error: error.message })

    res.json({ success: true })
  })
}
