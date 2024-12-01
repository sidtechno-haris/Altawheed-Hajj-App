import React, { useEffect } from "react";
import Route from "./src/navigation/Route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import Geolocation from "@react-native-community/geolocation";
import {
  getFCMToken,
  listenForForegroundMessages,
  requestUserPermission,
} from "./src/constants/Notification";

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: "always",
  locationProvider: "android",
  enableBackgroundLocationUpdates: true,
});

const App = gestureHandlerRootHOC(() => {
  useEffect(() => {
    const initNotification = async () => {
      await requestUserPermission();
      await getFCMToken();
      const unsubscribe = listenForForegroundMessages();

      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    initNotification();
  }, []);

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Route />
    </QueryClientProvider>
  );
});

export default App;
