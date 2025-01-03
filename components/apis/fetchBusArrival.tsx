export type BusArrivalData = {
  [busNumber: string]: string[];
};

const fetchBusArrival = async (busStopCode: string): Promise<BusArrivalData> => {
  const myHeaders = new Headers();
  myHeaders.append("AccountKey", "+szqz/rrQeO8c8ZsrgNWLg==");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as RequestRedirect,
  };

  const getTimeDifference = (estimatedArrival: string): string => {
    const arrivalTime = new Date(estimatedArrival);
    const currentTime = new Date();
    
    if (isNaN(arrivalTime.getTime())) {
      return "Invalid time"; // Return a fallback message if the time is invalid
    }

    const timeDifference = Math.max(0, (arrivalTime.getTime() - currentTime.getTime()) / 1000); // in seconds
    
    const minutes = Math.floor(timeDifference / 60);
    const seconds = Math.floor(timeDifference % 60);
    
    return `${minutes}min ${seconds}s`; // return formatted time
  };

  try {
    const response = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`,
      requestOptions
    );
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    
    const busArrivalData: BusArrivalData = data.Services.reduce((acc: BusArrivalData, service: any) => {
      const busNumber = service.ServiceNo;
      
      const timings: string[] = [];
      
      // Safely extract the timings
      if (service.NextBus && service.NextBus.EstimatedArrival) {
        timings.push(getTimeDifference(service.NextBus.EstimatedArrival));
      } else {
        timings.push("-");
      }
      
      if (service.NextBus2 && service.NextBus2.EstimatedArrival) {
        timings.push(getTimeDifference(service.NextBus2.EstimatedArrival));
      } else {
        timings.push("-");
      }

      if (service.NextBus3 && service.NextBus3.EstimatedArrival) {
        timings.push(getTimeDifference(service.NextBus3.EstimatedArrival));
      } else {
        timings.push("-");
      }

      acc[busNumber] = timings;
      return acc;
    }, {});

    return busArrivalData;
  } catch (error) {
    console.error("fetchBusArrival.tsx: Error fetching bus arrival data, error: ", error);
    throw error;
  }
};

export default fetchBusArrival;
