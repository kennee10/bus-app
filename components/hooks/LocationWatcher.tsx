import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

type Coordinates = {
    latitude: number;
    longitude: number;
  }

export async function LocationWatcher(onLocationChange: (coords: Coordinates) => void) {
    // Requesting location access
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'We needs access to your location to find nearby bus stops. Please enable location access in settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ]
      );
    }
  
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10, // Trigger updates when the user moves 10 meters
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        console.log("LocationWatcher.tsx: New location: ", latitude, longitude);
        onLocationChange({ latitude, longitude });
      }
    );
  
    return { subscription };
  }
