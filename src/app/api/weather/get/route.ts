import { NextRequest, NextResponse } from "next/server";

const fetchAirPollutionData = async (lat: number, lon: number) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Ensure your API key is stored in environment variables
  if (!apiKey) {
    return { error: "API key is missing in environment variables." };
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!res.ok) {
      return { error: `Failed to fetch air pollution data. Status: ${res.status}` };
    }

    const data = await res.json();
    if (data.list && data.list.length > 0) {
      const pm25Value = data.list[0].components.pm2_5;
      return { pm25Value };
    } else {
      return { error: "No PM2.5 data found" };
    }
  } catch (error: any) {
    console.error("Error fetching air pollution data:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required." }, { status: 400 });
  }

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);

  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    return NextResponse.json({ error: "Invalid latitude or longitude." }, { status: 400 });
  }

  const result = await fetchAirPollutionData(parsedLat, parsedLon);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result); // Respond with the PM2.5 value
}
