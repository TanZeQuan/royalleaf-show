// App.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "language/i18n";


import store from "store";
import { fonts } from "styles";
import AppNavigation from "./src/navigation/AppNavigator";

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts
        await Font.loadAsync(fonts);
      } catch (e) {
        console.warn("Font load error:", e);
      } finally {
        setFontsLoaded(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // Hide splash screen when fonts are ready
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // keep splash until fonts are loaded
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <AppNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
