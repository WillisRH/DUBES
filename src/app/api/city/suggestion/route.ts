// app/api/city/suggestion/route.ts

import { NextRequest, NextResponse } from 'next/server';

const suggestion = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("API key is missing in environment variables.");
    }

    // Fetch city suggestions from OpenWeatherMap API
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );
    const data = await res.json();

    // Map city suggestions
    const citySuggestions = data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));

    // Return city suggestions
    return NextResponse.json(citySuggestions);

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export { suggestion as GET };
