import React from 'react';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';

import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

import { RootNavigator } from './rootNavigator';


const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: { ...PaperDarkTheme.colors, ...NavigationDarkTheme.colors },
};

export const Main = () => {


  return (
    //<PreferencesContext.Provider value={preferences}>
    <PaperProvider theme={CombinedDarkTheme}>
      <NavigationContainer theme={CombinedDarkTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
    //</PreferencesContext.Provider>
  );
};
