import React from 'react';
import { Text, View, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerItem, createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Tasks from './tasks';
import { SettingsScreen} from './settings';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

function Home() {
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
      <Tab.Screen
        name="Verify"
        component={DummyScreen}
        options={{
          tabBarIcon: 'star',
        }}
      />
      <Tab.Screen
        name="Punishments"
        component={DummyScreen}
        options={{
          tabBarIcon: 'gavel',
        }}
      />
    </Tab.Navigator>
  );
};

function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
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
      <DrawerItem
        label="Help"
        onPress={() => console.log('https://mywebsite.com/help')}
      />
    </DrawerContentScrollView>
  );
}

function MasterScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
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
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent{...props} />}>
      <Drawer.Screen name="Servant" component={Home} />    
    </Drawer.Navigator>
  );
}

export const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
          name="Root"
          component={MainDrawer}
          options={{ headerShown: false }}
      />
      <Stack.Screen name="Become a Master" component={MasterScreen} />
      <Stack.Screen name="Become a servant" component={MasterScreen} />
      <Stack.Screen name="Become a robot servant" component={MasterScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>

  );
};