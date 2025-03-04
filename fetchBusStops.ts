import { Dir } from "fs";

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

interface TimingsData {
  ServiceNo: string;
  Operator: string;
  Direction: number;
  StopSequence: number;
  BusStopCode: string;
  Distance: number;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
}

interface BusDirection {
    WD_FirstBus: string;
    WD_LastBus: string;
    SAT_FirstBus: string;
    SAT_LastBus: string;
    SUN_FirstBus: string;
    SUN_LastBus: string;
}

interface BusFirstLastTimings {
  [serviceNo: string]: {
    [busStopCode: string]: {
      [direction: string]: BusDirection
    };
  };
}

// Fetch all first and last bus timings
async function fetchAllTimings(): Promise<BusFirstLastTimings> {
  const busFirstLastTimings: BusFirstLastTimings = {};
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
          }
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = response.data;

      if (data.value.length > 0) {
        data.value.forEach((timingsData: TimingsData) => {
          const { ServiceNo, BusStopCode, Direction, ...busTimings } = timingsData;

          if (!busFirstLastTimings[ServiceNo]) {
            busFirstLastTimings[ServiceNo] = {};
          }
          if (!busFirstLastTimings[ServiceNo][BusStopCode]) {
            busFirstLastTimings[ServiceNo][BusStopCode] = {};
          }

          busFirstLastTimings[ServiceNo][BusStopCode][Direction] = {
            WD_FirstBus: busTimings.WD_FirstBus,
            WD_LastBus: busTimings.WD_LastBus,
            SAT_FirstBus: busTimings.SAT_FirstBus,
            SAT_LastBus: busTimings.SAT_LastBus,
            SUN_FirstBus: busTimings.SUN_FirstBus,
            SUN_LastBus: busTimings.SUN_LastBus,
          };
        });

        skip += 500;

      } else {
        isMoreData = false;
      }
    } catch (error) {
        console.error("fetchBusStops.ts: Error fetching bus timings: ", error)
        isMoreData = false;
      }
    }

  return busFirstLastTimings;
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

function saveTimingsToFile(busFirstLastTimings: BusFirstLastTimings, filePath: string) {
  const jsonData = JSON.stringify(busFirstLastTimings, null, 2);
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
    console.log("fetchBusStops.ts: No bus stops fetched.");
  }

  const busFirstLastTimings = await fetchAllTimings();
  if (Object.keys(busFirstLastTimings).length > 0) {
    const busFirstLastTimingsFilePath = path.join(__dirname, "./assets/busFirstLastTimings.json");
    saveTimingsToFile(busFirstLastTimings,busFirstLastTimingsFilePath);
  } else {
    console.log("fetchBusStops.ts: no first/last bus timings fetched.")
  }
}

// Run the script
main();