import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { Colors, ActivityIndicator, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerItem, createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Tasks from './screens/tasks';
import Verify from './screens/verify';
import { SettingsScreen } from './screens/menu/settings';
import { SettingsStore } from "./data/configprovider";
import { PunishmentScreen } from './screens/punishments';
import { createHook } from 'react-sweet-state';
import { ContractScreen } from "./screens/contract"
import { DataStore } from './data/dataprovider';
import getContract from './data/contracthelper';
import { MasterScreen } from './screens/menu/master';
import { ServantScreen } from './screens/menu/servant';
import { RobotServantScreen } from './screens/menu/robotservant';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
const useConfigStore = createHook(SettingsStore);
const useDataStore = createHook(DataStore);

function Home() {
  const [settingsState, settingsActions] = useConfigStore();

  useEffect(
    () => { if (!settingsState.data) settingsActions.fetch(); },
    [settingsState, settingsActions],
  );

  const [dataState, dataActions] = useDataStore();
  useEffect(
      () => { if (!dataState.data) dataActions.fetch(); },
      [dataState, dataActions],
  );

  if(!settingsState.data || !dataState.data) {
      return (<ActivityIndicator />);
  }
  
  //TODO dont depend on settingsState, but fetch contract and check if it is in master or servant
  let [contract, type, id] = getContract(settingsState, dataState);
  
  var vertifyTab;
  if (type == 0) {
    vertifyTab = (
      <Tab.Screen
        name="Verify"
        component={Verify}
        options={{
          tabBarIcon: 'star',
        }}
      />
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Tasks"
      shifting={true}
      sceneAnimationEnabled={false}
    >
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        options={{
          tabBarIcon: 'calendar',
        }}
      />
      {vertifyTab}
      <Tab.Screen
        name="Punishments"
        component={PunishmentScreen}
        options={{
          tabBarIcon: 'gavel',
        }}
      />
      <Tab.Screen
        name="Contract"
        component={ContractScreen}
        options={{
          tabBarIcon: 'script',
        }}
      />
    </Tab.Navigator>
  );
};

function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Become a Master"
        onPress={() => props.navigation.navigate('Become a Master')}
      />
      <DrawerItem
        label="Become a servant"
        onPress={() => props.navigation.navigate('Become a servant')}
      />
      <DrawerItem
        label="Become a robot servant"
        onPress={() => props.navigation.navigate('Become a robot servant')}
      />
      <DrawerItem
        label="Settings"
        onPress={() => props.navigation.navigate('Settings')}
      />
    </DrawerContentScrollView>
  );
}

function DummyScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function MainDrawer() {
  
  const [dataState, dataActions] = useDataStore();
  const [settingsState, settingsActions] = useConfigStore();
  
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent{...props} />}>
      <Drawer.Screen 
        name="Servant" 
        component={Home} 
        style={{margin:5}}
        options={{
          headerRight: () => (
            <IconButton
            icon="refresh"
            size={30}
            color={Colors.grey500}
            onPress={() => {settingsActions.refresh(); dataActions.refresh()}}
            />
          ),
        }}/>
    </Drawer.Navigator>
  );
}

export const RootNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={MainDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Become a Master" component={MasterScreen} />
      <Stack.Screen name="Become a servant" component={ServantScreen} />
      <Stack.Screen name="Become a robot servant" component={RobotServantScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>

  );
};