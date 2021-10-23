import React from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native-appearance';

import { RootNavigator } from './rootNavigator';

export const Main = () => {
  

  return (
    //<PreferencesContext.Provider value={preferences}>
    <PaperProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </PaperProvider>
    //</PreferencesContext.Provider>
  );
};
