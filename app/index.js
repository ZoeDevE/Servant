import * as React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Main } from './src/main';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';

export default function App() {
    return (
        <Main />
    );
}

AppRegistry.registerComponent(appName, () => App);