import axios from "axios";
import fs from "fs";
import path from "path";

// Define the type for the bus stop data
interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

// Define the type for the bus route data
interface BusRoute {
  ServiceNo: string;
  BusStopCode: string;
}

// Define the type for the final output format
interface BusStopWithServices {
  [busStopCode: string]: {
    Description: string;
    RoadName: string;
    Latitude: number;
    Longitude: number;
    ServiceNos: string[];
  };
}

// Function to fetch all bus stops from the API
async function fetchAllBusStops(): Promise<BusStop[]> {
  let allBusStops: BusStop[] = [];
  let skip = 0;
  let isMoreData = true;

  while (isMoreData) {
    try {
      const response = await axios.get(
        `https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`,
        {
          headers: {
            AccountKey: "+szqz/rrQeO8c8ZsrgNWLg==",
            Accept: "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data;

      if (data.value.length > 0) {
        allBusStops = [...allBusStops, ...data.value];
        skip += 500; // Increment skip for the next page
      } else {
        isMoreData = false; // Stop fetching if no more data
      }
    } catch (error) {
      console.error("Error fetching bus stops:", error);
      isMoreData = false; // Stop fetching on error
    }
  }

  return allBusStops;
}

// Function to fetch all bus routes from the API
async function fetchAllBusRoutes(): Promise<BusRoute[]> {
  let allBusRoutes: BusRoute[] = [];
  let skip = 0;
  let isMoreData = true;

  while (isMoreData) {
    try {
      const response = await axios.get(
        `https://datamall2.mytransport.sg/ltaodataservice/BusRoutes?$skip=${skip}`,
        {
          headers: {
            AccountKey: "+szqz/rrQeO8c8ZsrgNWLg==",
            Accept: "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data;

      if (data.value.length > 0) {
        // Extract ServiceNo and BusStopCode from each route
        const routes = data.value.map((route: any) => ({
          ServiceNo: route.ServiceNo,
          BusStopCode: route.BusStopCode,
        }));
        allBusRoutes = [...allBusRoutes, ...routes];
        skip += 500; // Increment skip for the next page
      } else {
        isMoreData = false; // Stop fetching if no more data
      }
    } catch (error) {
      console.error("Error fetching bus routes:", error);
      isMoreData = false; // Stop fetching on error
    }
  }

  return allBusRoutes;
}

// Function to map bus routes to bus stops
function mapRoutesToStops(busStops: BusStop[], busRoutes: BusRoute[]): BusStopWithServices {
  const busStopsWithServices: BusStopWithServices = {};

  // Initialize each bus stop with an empty ServiceNos array
  for (const busStop of busStops) {
    busStopsWithServices[busStop.BusStopCode] = {
      Description: busStop.Description,
      RoadName: busStop.RoadName,
      Latitude: busStop.Latitude,
      Longitude: busStop.Longitude,
      ServiceNos: [],
    };
  }

  // Populate the ServiceNos array for each bus stop
  for (const route of busRoutes) {
    if (busStopsWithServices[route.BusStopCode]) {
      // Add the ServiceNo if it's not already in the array
      if (!busStopsWithServices[route.BusStopCode].ServiceNos.includes(route.ServiceNo)) {
        busStopsWithServices[route.BusStopCode].ServiceNos.push(route.ServiceNo);
      }
    }
  }

  return busStopsWithServices;
}

// Function to save bus stops with services to a JSON file
function saveBusStopsToFile(busStops: BusStopWithServices, filePath: string) {
  const jsonData = JSON.stringify(busStops, null, 2);
  fs.writeFileSync(filePath, jsonData, "utf8");
  console.log(`Bus stops saved to ${filePath}`);
}

// Main function to run the script
async function main() {
  const busStops = await fetchAllBusStops();
  if (busStops.length > 0) {
    const busRoutes = await fetchAllBusRoutes();
    const busStopsWithServices = mapRoutesToStops(busStops, busRoutes);
    const filePath = path.join(__dirname, "../assets/busStopsWithServices.json"); // Adjust the path as needed
    saveBusStopsToFile(busStopsWithServices, filePath);
  } else {
    console.log("No bus stops fetched.");
  }
}

// Run the script
main();