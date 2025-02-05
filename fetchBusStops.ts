const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Define the type for the bus stop data
interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
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

// Fetch all bus stops and initialize the output structure
async function fetchAllBusStops(): Promise<BusStopWithServices> {
  const busStopsWithServices: BusStopWithServices = {};
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
        // Initialize each bus stop with an empty ServiceNos array
        data.value.forEach((busStop: BusStop) => {
          busStopsWithServices[busStop.BusStopCode] = {
            Description: busStop.Description,
            RoadName: busStop.RoadName,
            Latitude: busStop.Latitude,
            Longitude: busStop.Longitude,
            ServiceNos: [],
          };
        });
        skip += 500;
      } else {
        isMoreData = false;
      }
    } catch (error) {
      console.error("Error fetching bus stops:", error);
      isMoreData = false;
    }
  }

  return busStopsWithServices;
}

// Fetch all bus routes and populate ServiceNos incrementally
async function fetchAndMapBusRoutes(
  busStopsWithServices: BusStopWithServices
): Promise<void> {
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
        // Process each route entry directly
        data.value.forEach((route: any) => {
          const busStopCode = route.BusStopCode;
          const serviceNo = route.ServiceNo;

          if (busStopsWithServices[busStopCode]) {
            // Add ServiceNo if not already present
            if (!busStopsWithServices[busStopCode].ServiceNos.includes(serviceNo)) {
              busStopsWithServices[busStopCode].ServiceNos.push(serviceNo);
              console.log(`Added into ${busStopCode}: serviceNo ${serviceNo}`)
            }
          }
        });

        skip += 500;
      } else {
        isMoreData = false;
      }
    } catch (error) {
      console.error("Error fetching bus routes:", error);
      isMoreData = false;
    }
  }
}

// Save the final data
function saveBusStopsToFile(busStops: BusStopWithServices, filePath: string) {
  const jsonData = JSON.stringify(busStops, null, 2);
  fs.writeFileSync(filePath, jsonData, "utf8");
  console.log(`Bus stops saved to ${filePath}`);
}

// Main function
async function main() {
  const busStopsWithServices = await fetchAllBusStops();
  if (Object.keys(busStopsWithServices).length > 0) {
    await fetchAndMapBusRoutes(busStopsWithServices);
    const filePath = path.join(__dirname, "./assets/busStopsWithServices.json");
    saveBusStopsToFile(busStopsWithServices, filePath);
  } else {
    console.log("No bus stops fetched.");
  }
}

// Run the script
main();