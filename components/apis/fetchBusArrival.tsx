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

export default async function fetchBusArrival(
  busStopCode: string,
  serviceNos: string[] = [] // Optional second parameter with a default value of an empty array
): Promise<BusService[]> {
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
      throw new Error(`fetchBusArrivals.tsx: Error fetching bus arrivals: ${response.status}`);
    }

    const textResponse = await response.text(); // Get the raw response as text
    const data = JSON.parse(textResponse); // Parse the response text to JSON

    let busServices: BusService[] = data.Services.map((service: any) => {
      const nextBuses: BusArrivalInfo[] = [];

      Object.keys(service).forEach((key) => {
        if (key.startsWith("NextBus") && service[key]) {
          const busData = service[key];

          nextBuses.push({
            OriginCode: busData.OriginCode,
            DestinationCode: busData.DestinationCode,
            EstimatedArrival: busData.EstimatedArrival,
            Monitored: busData.Monitored !== undefined ? busData.Monitored : 0,
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

    // If `serviceNos` is not empty, filter the services to include only those specified
    if (serviceNos.length > 0) {
      busServices = busServices.filter((service) => serviceNos.includes(service.ServiceNo));
    }

    return busServices;
  } catch (error) {
    console.error("fetchBusArrival.tsx: Error fetching bus arrival data:", error);
    throw error;
  }
}

