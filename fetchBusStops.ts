const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Define the type for the bus stop data
interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
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
            AccountKey: '+szqz/rrQeO8c8ZsrgNWLg==',
            Accept: 'application/json',
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
      console.error('Error fetching bus stops:', error);
      isMoreData = false; // Stop fetching on error
    }
  }

  return allBusStops;
}

// Function to save bus stops to a JSON file
function saveBusStopsToFile(busStops: BusStop[], filePath: string) {
  const jsonData = JSON.stringify(busStops, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf8');
  console.log(`Bus stops saved to ${filePath}`);
}

// Main function to run the script
async function main() {
  const busStops = await fetchAllBusStops();
  if (busStops.length > 0) {
    const filePath = path.join(__dirname, './assets/busStops.json'); // Adjust the path as needed
    saveBusStopsToFile(busStops, filePath);
  } else {
    console.log('No bus stops fetched.');
  }
}

// Run the script
main();