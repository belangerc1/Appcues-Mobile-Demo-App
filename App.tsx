import React, {useEffect, useRef} from 'react';
import {Linking} from 'react-native';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Appcues from '@appcues/react-native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EventsScreen from './src/screens/EventsScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import EmbedsScreen from './src/screens/EmbedsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Login: {accountId?: string; applicationId?: string} | undefined;
  Home: {userId: string; userProps: UserProps; accountId: string; applicationId: string};
  Profile: {userId: string; userProps: UserProps};
  Events: {userId: string};
  Explore: {userId: string};
  Embeds: {userId: string};
  Settings: {currentAccountId: string; currentApplicationId: string};
};

export type UserProps = {
  email: string;
  role: string;
  company: string;
  plan: string;
  industry: string;
  language: string;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCREEN_MAP: Record<string, keyof RootStackParamList> = {
  home: 'Home',
  profile: 'Profile',
  events: 'Events',
  explore: 'Explore',
  embeds: 'Embeds',
};

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const handleURL = async (url: string) => {
    const handled = await Appcues.didHandleURL(url);
    if (!handled) {
      const match = url.match(/^appcuestestapp:\/\/screen\/(\w+)/);
      if (match) {
        const screenKey = match[1].toLowerCase();
        const screenName = SCREEN_MAP[screenKey];
        if (screenName && navigationRef.current) {
          const currentRoute = navigationRef.current.getCurrentRoute();
          const currentParams = currentRoute?.params as any;

          // Only navigate if we have user context (i.e. user is logged in)
          if (currentParams?.userId) {
            navigationRef.current.navigate(screenName as any, {
              userId: currentParams.userId,
              userProps: currentParams.userProps,
            });
          } else {
            console.warn('Deep link navigation skipped — no user session active.');
          }
        }
      } else {
        console.log('Unhandled URL:', url);
      }
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({url}) => handleURL(url));

    Linking.getInitialURL().then(url => {
      if (url) handleURL(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Embeds" component={EmbedsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}