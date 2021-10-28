import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, createSubscriber, createHook } from 'react-sweet-state';
import uuid from 'react-native-uuid';

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
        console.log(e);
        console.log("Error saving");
    } finally {
        console.log("Done");
    }

}

async function createAcount(details) {
    const response = await fetch(BaseURL+"user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(details)
    });
    return response.status == 204;
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

async function generateDefaultConfig() {
    var data = {};
    data['id'] = uuid.v4();
    data['activeContract'] = null;
    data['robotContract'] = null;
    data['master'] = false;
    data['inviteCode'] = makeid(14);
    console.log(data['id']);
    try {
        await createAcount(data);
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@config', jsonValue);
    } catch (e) {
        console.log("Error storing");
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
    },
    saveContract: (contract) => async ({ getState, setState }) => {
        if (getState().loading) return;
        var data = getState().data;
        data.activeContract = contract;
        console.log(contract);
        setState({ data, loading: true });
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({ data, loading: false });
    }
}
export const SettingsStore = createStore({ initialState, actions });