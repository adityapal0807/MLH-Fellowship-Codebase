import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const image = formData.get('image') as File

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  const apiFormData = new FormData()
  apiFormData.append('image', image)

  try {
    const response = await fetch('http://127.0.0.1:8000/fetch_category_prices', {
      method: 'POST',
      body: apiFormData,
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

