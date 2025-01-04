import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchAllBusStops = async () => {
  try {
    // Check if bus stops are already stored in AsyncStorage
    const storedAllBusStops = await AsyncStorage.getItem("allBusStops");
    if (storedAllBusStops) {
      console.log(`fetchAllBusStops.tsx: ${JSON.parse(storedAllBusStops).length} Bus stops already exist in AsyncStorage`);
      return; // Skip fetching data
    }

    // Fetch data from the API
    let skip = 0;
    let allBusStops: any[] = [];
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
        allBusStops = [...allBusStops, ...data.value];
        skip += 500;
      } else {
        isMoreData = false; // Stop fetching if no more data
      }
    }

    // Save data to AsyncStorage
    if (allBusStops.length > 0) {
      await AsyncStorage.setItem("allBusStops", JSON.stringify(allBusStops));
      console.log(`fetchAllBusStops.tsx: ${allBusStops.length} All Bus stops successfully stored in AsyncStorage`);
    } else {
      console.warn("fetchAllBusStops.tsx: No bus stops retrieved from the API.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("fetchAllBusStops.tsx: Error fetching bus stops:", error.message);
    }
  }
};

export default fetchAllBusStops