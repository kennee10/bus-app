import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchBusStops = async () => {
  try {
    // Check if bus stops are already stored in AsyncStorage
    const storedBusStops = await AsyncStorage.getItem("busStops");
    if (storedBusStops) {
      console.log(`fetchBusStops.tsx: ${JSON.parse(storedBusStops).length} Bus stops already exist in AsyncStorage`);
      return; // Skip fetching data
    }

    // Fetch data from the API
    let skip = 0;
    let busStops: any[] = [];
    let isMoreData = true;

    while (isMoreData) {
      const response = await fetch(
        `https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`,
        {
          headers: {
            AccountKey: "+szqz/rrQeO8c8ZsrgNWLg==",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.value.length > 0) {
        busStops = [...busStops, ...data.value];
        skip += 500;
      } else {
        isMoreData = false; // Stop fetching if no more data
      }
    }

    // Save data to AsyncStorage
    if (busStops.length > 0) {
      await AsyncStorage.setItem("busStops", JSON.stringify(busStops));
      console.log(`fetchBusStops.tsx: ${busStops.length} Bus stops successfully stored in AsyncStorage`);
    } else {
      console.warn("fetchBusStops.tsx: No bus stops retrieved from the API.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("fetchBusStops.tsx: Error fetching bus stops:", error.message);
    }
  }
};

export default fetchBusStops