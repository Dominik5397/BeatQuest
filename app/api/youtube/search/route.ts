import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Brak parametru wyszukiwania' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        query
      )}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=5`
    );

    if (!response.ok) {
      throw new Error('Błąd API YouTube');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Błąd wyszukiwania YouTube:', error);
    return NextResponse.json(
      { error: 'Nie udało się wyszukać w YouTube' },
      { status: 500 }
    );
  }
} 