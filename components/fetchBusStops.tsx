import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchBusStops = (onComplete: () => void) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("useFetchBusStops.tsx: Fetching bus stops...");
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

        if (busStops.length > 0) {
            console.log(`useFetchBusStops.tsx: Total bus stops fetched: ${busStops.length}`);
          await AsyncStorage.setItem("busStops", JSON.stringify(busStops));
          console.log("useFetchBusStops.tsx: Bus stops successfully stored.");
        
        } else {
          console.warn("useFetchBusStops.tsx: No bus stops retrieved from API.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("useFetchBusStops.tsx: Fetch error:", error.message);
        }
      } finally {
        onComplete(); // Notify the parent component that fetching is complete
      }
    };

    fetchData();
  }, [onComplete]);
};

export default fetchBusStops;
