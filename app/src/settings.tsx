import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { ActivityIndicator, Text, View } from 'react-native';
import { createStore, createSubscriber, createHook } from 'react-sweet-state';

async function configAsync() {
    try {
        console.log("Loading");
        const jsonValue = await AsyncStorage.getItem('@config');
        console.log(jsonValue);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            return await generateDefaultConfig();
        }
    } catch (e) {  // saving error  
        console.log("Error");
    } finally {
        console.log("Done");
    }

}

async function generateDefaultConfig() {
    var data = {};
    data['id'] = uuid.v4();
    console.log(data['id']);
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@config', jsonValue);
    } catch (e) {
        console.log("Error");
    }
    return data;
}


const initialState = {
    data: null,
    loading: false,
    error: null,
};

const actions = {
    fetch: () => async ({ getState, setState }) => {
        if (getState().loading) return; setState({ loading: true });
        try {
            const data = await configAsync();
            setState({ data, loading: false });
        } catch (error) {
            setState({ error, loading: false });
        }
    }
}
export const SettingsStore = createStore({ initialState, actions });

const useCounter = createHook(SettingsStore);


export const SettingsScreen = () => {
    const [state, actions] = useCounter();
    useEffect(
        () => { if (!state.data) actions.fetch(); },
        [state, actions], 
      );
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings</Text>
            <Text> {state.data.id}</Text>
        </View>
    );
}