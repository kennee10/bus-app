import { createWidget } from 'react-native-android-widget';

createWidget({
  widgetName: 'LikedBusStopsWidget',
  layout: async () => {
    const likedBusStops = await AsyncStorage.getItem('likedBusStops');
    const busStops = likedBusStops ? JSON.parse(likedBusStops) : [];
    
    const busStopItems = busStops.map(stop => ({
      type: 'Text',
      text: `${stop.Description} (${stop.Distance.toFixed(0)}m)`,
      textSize: 16,
      textColor: '#000000',
    }));

    return {
      type: 'Column',
      children: busStopItems,
    };
  },
  updateInterval: 60000, // Update every minute
});
