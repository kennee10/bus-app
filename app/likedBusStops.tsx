import React from 'react';
import { Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import colors from '../assets/styles/Colors';
import getNearbyBusStops from '../components/getNearbyBusStops';
import BusStopComponent from '../components/main/BusStopComponent'

const busStopsNearby = () => {
  const [busStops, setBusStops] = React.useState<{label: string; code: string; distance:number, detail: string}[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const nearbyBusStops = await getNearbyBusStops();
        const sortedStops = Object.entries(nearbyBusStops)
        .map(([code, [label, detail, distance]]) => ({ code, label, detail, distance }))
        .sort((a, b) => a.distance - b.distance);

        setBusStops(sortedStops);
      
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to get nearby bus stops:', error.message);
          setErrorMsg(error.message);
        }
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Render logic */}
      {busStops.length > 0 ? (
        
        // if TRUE
        <FlatList
          data={busStops}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <BusStopComponent BusStopCode={item.code} Distance={item.distance.toFixed(0)} Description={item.label} RoadName={item.detail}/>
          )}
        />
      ) : (
        
        // if FALSE
        <Text style={styles.messageText}>No nearby bus stops found.</Text>
      )}
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center'
  },


  // ONLY WHEN ERROR
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
});

export default busStopsNearby;
