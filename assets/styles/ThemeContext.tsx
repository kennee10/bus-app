import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof darkColors;
  font: typeof font;
  containerStyles: ReturnType<typeof createContainerStyles>;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

// Define color schemes
const darkColors = {
  background: "#0d0d0d",
  surface: "#212429",
  surface2: "#292b30",
  surface3: "#1d1f24",
  surface4: "#15171B",
  onBackground: "#FFFFFF",
  onBackgroundSecondary: "#84848A",
  onBackgroundSecondary2: "#5b5c5f",
  onSurface: "#FFFFFF",
  onSurfaceSecondary: "#AFAFB2",
  onSurfaceSecondary2: "gray",
  onSurfaceSecondary3: "rgba(255, 255, 255, 0.25)",
  onSurface2: "#FFFFFF",
  onSurface2Secondary: "#bdbdbd",
  primaryDark: "#9171CD",
  primary: "#a17ee4",
  secondary: "#b19aeb",
  secondary2: "#ccbff3",
  accent: "#1EB980",
  accent2: "#045D56",
  accent3: "#FF6859",
  accent4: "#f3d251",
  accent5: "#2fa7f3",
  accent6: "sienna",
  accent7: "khaki",
  accent8: "#348cc0",
  highlight: "#a17ee4",
  busIcon: "powderblue",
  borderToPress: "rgba(255, 255, 255, 0.15)",
  borderToPress2: "rgba(255, 255, 255, 0.1)",
  modalOverlayBackgroundColor: "rgba(0,0,0,0.8)",
  info: 'gray',
  warning: '#f99a07',
  error: '#FF6859',
};

const lightColors = {
  background: "#f9f9f9", // Very light gray
  surface: "#FFFFFF", // Pure white
  surface2: "#f0f0f0", // Slightly darker surface
  surface3: "#e8e8e8", // Even darker surface
  surface4: "#f5f5f5", // Light surface
  onBackground: "#000000", // Black text on light background
  onBackgroundSecondary: "#333333", // Dark gray secondary text
  onBackgroundSecondary2: "#666666", // Medium gray text
  onSurface: "#000000", // Black text on white surface
  onSurfaceSecondary: "#444444", // Slightly lighter black secondary text
  onSurfaceSecondary2: "#777777", // Medium gray text
  onSurfaceSecondary3: "rgba(0, 0, 0, 0.25)", // Light gray overlay
  onSurface2: "#000000",
  onSurface2Secondary: "#424242",
  primaryDark: "#6741d9", // Darker purple
  primary: "#7950f2", // Bright purple
  secondary: "#8f6ef7", // Lighter purple
  secondary2: "#b197f9", // Even lighter purple
  accent: "#1EB980",
  accent2: "#045D56",
  accent3: "#FF6859",
  accent4: "#f3d251",
  accent5: "#1E90FF",
  accent6: "sienna",
  accent7: "#F4C430",
  accent8: "#348cc0",
  highlight: "#7950f2", // Primary color used for highlight
  busIcon: "steelblue", // Darker blue for icon
  borderToPress: "rgba(0, 0, 0, 0.15)", // Subtle dark border
  borderToPress2: "rgba(0, 0, 0, 0.1)", // Even subtler dark border
  modalOverlayBackgroundColor: "rgba(0,0,0,0.5)", // Light overlay
  info: 'dimgray',
  warning: '#F4C430',
  error: '#FF6859',
};



const font = {
  medium: "Nunito-Medium",
  semiBold: "Nunito-SemiBold",
  bold: "Nunito-Bold"
};

const createContainerStyles = (colors: typeof darkColors) => StyleSheet.create({
  globalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background
  },
  pageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  innerPageContainer: {
    flex: 1,
    width: '97%',
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.surface2,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 5
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.onBackgroundSecondary
  },
  globalTextMessage: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.onBackground,
    textAlign: "center",
  },
  globalInfoTextMessage: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
  },
  globalWarningText: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.warning,
    textAlign: "center",
  },
  globalErrorText: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.error,
    textAlign: "center",
  },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  
  const colors = useMemo(() => theme === 'dark' ? darkColors : lightColors, [theme]);
  const containerStyles = useMemo(() => createContainerStyles(colors), [colors]);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) setTheme(savedTheme as Theme);
    };
    loadTheme();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, font, containerStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};