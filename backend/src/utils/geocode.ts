interface GeoResult {
    lat: number
    lng: number
}

export const geocodeAddress = async (address: string): Promise<GeoResult> => {
     const url = new URL("https://nominatim.openstreetmap.org/search")

     url.searchParams.append("q", address)
     url.searchParams.append("format", "json")
     url.searchParams.append("limit", "1")

     const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
        // Required by Nominatim ToS (important)
        "User-Agent": "PharmaCare/1.0 (kirbypanasan0.com)",
        },
    });

    const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error(`Could not geocode address: "${address}"`);
  }
  
   return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };

}