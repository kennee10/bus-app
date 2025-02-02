import AsyncStorage from "@react-native-async-storage/async-storage";
import fetchAllBusStops from "./fetchAllBusStops";
import fetchBusArrival from "./fetchBusArrival";

type BusStopsData = {
  [busStopCode: string]: string[]; // Use arrays to store bus service numbers
};

const fetchAllBuses = async () => {
  try {
    // Fetch all bus stops
    await fetchAllBusStops();

    // Retrieve stored bus stops from AsyncStorage
    const storedAllBusStops = await AsyncStorage.getItem("allBusStops");
    if (!storedAllBusStops) {
      console.warn("fetchAllBuses.tsx: No bus stops found in AsyncStorage.");
      return;
    }

    const allBusStops = JSON.parse(storedAllBusStops);
    const busStopsData: BusStopsData = {};

    // Iterate through each bus stop and fetch bus arrival data
    for (const busStop of allBusStops) {
      const busStopCode = busStop.BusStopCode;

      try {
        // Fetch bus arrival data for the current bus stop
        const busServices = await fetchBusArrival(busStopCode);

        // Extract unique bus service numbers for the current bus stop
        const serviceNumbers: string[] = [];
        busServices.forEach((service) => {
          if (!serviceNumbers.includes(service.ServiceNo)) {
            serviceNumbers.push(service.ServiceNo);
          }
        });

        // Add the bus stop and its services to the data object
        busStopsData[busStopCode] = serviceNumbers;

        console.log(`fetchAllBuses.tsx: Fetched ${serviceNumbers.length} buses for bus stop ${busStopCode}`);
      } catch (error) {
        console.error(`fetchAllBuses.tsx: Error fetching buses for bus stop ${busStopCode}:`, error);
      }
    }

    // Save the bus stops data to AsyncStorage
    await AsyncStorage.setItem("busStopsData", JSON.stringify(busStopsData));
    console.log("fetchAllBuses.tsx: Bus stops data successfully stored in AsyncStorage");
  } catch (error) {
    console.error("fetchAllBuses.tsx: Error fetching all buses:", error);
  }
};

export default fetchAllBuses;