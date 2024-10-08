import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { input } = await req.json();

  // Validate input
  if (!input) {
    return NextResponse.json({ error: 'Input is required' }, { status: 400 });
  }

  try {
    const response = await fetch('http://localhost:5000/input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the response as text
      console.error('Error response:', errorText); // Log the error
      return NextResponse.json({ error: `HTTP error! Status: ${response.status}` }, { status: response.status });
    }

    const data = await response.json(); // Parse JSON response
    return NextResponse.json(data, { status: 200 }); // Send response back to client
  } catch (error) {
    console.error('Error communicating with Python server:', error);
    return NextResponse.json({ error: 'Error communicating with Python server' }, { status: 500 });
  }
}
