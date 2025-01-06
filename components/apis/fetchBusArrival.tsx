type BusArrivalInfo = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
};

type BusService = {
  ServiceNo: string;
  Operator: string;
  nextBuses: BusArrivalInfo[];
};


export default async function fetchBusArrival(busStopCode: string): Promise<BusService[]> {
  const apiKey = "+szqz/rrQeO8c8ZsrgNWLg==";
  const url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`;

  try {
    const response = await fetch(url, {
      headers: {
        AccountKey: apiKey,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching bus arrivals: ${response.status}`);
    }

    const textResponse = await response.text();  // Get the raw response as text
    const data = JSON.parse(textResponse);  // Parse the response text to JSON

    const busServices: BusService[] = data.Services.map((service: any) => {
      const nextBuses: BusArrivalInfo[] = [];

      // Object.keys(service) Retrieves all property names (keys) of the service object, e.g., ["ServiceNo", "Operator", "NextBus", ...]
      Object.keys(service).forEach((key) => {
        if (key.startsWith("NextBus") && service[key]) {
          const busData = service[key];

          nextBuses.push({
            OriginCode: busData.OriginCode,
            DestinationCode: busData.DestinationCode,
            EstimatedArrival: busData.EstimatedArrival,
            Monitored: busData.Monitored !== undefined ? busData.Monitored : 0, // Handle missing `Monitored`
            Latitude: busData.Latitude,
            Longitude: busData.Longitude,
            VisitNumber: busData.VisitNumber,
            Load: busData.Load,
            Feature: busData.Feature,
            Type: busData.Type,
          });
        }
      });

      return {
        ServiceNo: service.ServiceNo,
        Operator: service.Operator,
        nextBuses,
      };
    });

    return busServices;
  } catch (error) {
    console.error("Error fetching bus arrival data:", error);
    throw error;
  }
}
