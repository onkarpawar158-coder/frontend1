import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import OtpScreen from '../screens/OtpScreen';
import ProfileLanguageScreen from '../screens/ProfileLanguageScreen';
import LocationAccessScreen from '../screens/LocationAccessScreen';
import VehicleSelectionScreen from '../screens/VehicleSelectionScreen';
import LocationRouteScreen from '../screens/LocationRouteScreen';
import DashboardPlaceholderScreen from '../screens/DashboardPlaceholderScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { theme, currentUser, authLoading } = useApp();

  // If restoring authentication session on app launch, display smooth background loader
  if (authLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#00D09C" />
      </View>
    );
  }

  // Restore authenticated user directly to Home Screen, otherwise show Welcome/SignIn
  const initialRoute = currentUser ? 'LocationRoute' : 'Welcome';

  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === 'dark',
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.textPrimary,
          border: theme.surfaceBorder,
          notification: theme.accent,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ProfileLanguage" component={ProfileLanguageScreen} />
        <Stack.Screen name="LocationAccess" component={LocationAccessScreen} />
        <Stack.Screen name="VehicleSelection" component={VehicleSelectionScreen} />
        <Stack.Screen name="LocationRoute" component={LocationRouteScreen} />
        <Stack.Screen name="Confirmation" component={LocationRouteScreen} />
        <Stack.Screen
          name="DashboardPlaceholder"
          component={DashboardPlaceholderScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardPlaceholderScreen}
          options={{
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppNavigator;
