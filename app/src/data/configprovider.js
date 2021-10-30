import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, createSubscriber, createHook } from 'react-sweet-state';
import uuid from 'react-native-uuid';

const BaseURL = "http://10.0.1.1:8088/";

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
        body: JSON.stringify({id:details.id, inviteCode:details.inviteCode})
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

async function saveConfig(config) {
    try {
        const response = await fetch(BaseURL+"user", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:config.id, inviteCode:config.inviteCode})
        });
        const jsonValue = JSON.stringify(config);
        await AsyncStorage.setItem('@config', jsonValue);
    } catch (e) {
        console.log(e);
        console.log("Error storing");
    }
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
    },
    saveContractConfig: (contractid, config) => async ({ getState, setState}) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        data.robotContract.config.punishments = config.punishments;
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    generateInvite: () => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        data.inviteCode = makeid(14);
        console.log("Invite code: "+data.inviteCode);
        try {
            setState({ data, loading: true });
            await saveConfig(data);
            setState({ data, loading: false });
        } catch (error) {
            setState({ error, loading: false });
        }
    },
    createRobot: () => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        data.robotContract = { tasks:[], openPunishments:"", config: {name: "Robot servant", punishments: "",  unlock:true}}
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    createTask: (task) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        
        data.robotContract.tasks.push(task);
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    saveTask: (task) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        let index = data.robotContract.tasks.findIndex(taskl => taskl._id == task._id);
        if(index > -1) {
            data.robotContract.tasks[index] = task;
        }
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    deleteTask: (task) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        let index = data.robotContract.tasks.findIndex(taskl => taskl._id == task._id);
        if(index > -1) {
            data.robotContract.tasks.splice(index, 1);
        }
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    performTask: (task) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        let index = data.robotContract.tasks.findIndex(taskl => taskl._id == task._id);
        if(index > -1) {
            data.robotContract.tasks[index].performed += 1;
        }
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    startTask: (task) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        let index = data.robotContract.tasks.findIndex(taskl => taskl._id == task._id);
        if(index > -1) {
            data.robotContract.tasks[index].startTime = Date.now();
        }
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    stopTask: (task) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        let index = data.robotContract.tasks.findIndex(taskl => taskl._id == task._id);
        if(index > -1) {
            data.robotContract.tasks[index].performed += (Date.now() - data.robotContract.tasks[index].startTime);
            data.robotContract.tasks[index].startTime = 0;
        }
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
        console.log(data);
    },
    addPunishment: (punishment) => async ({ getState, setState }) => {
        if (getState().loading) return; 
        let data = getState().data;
        setState({data, loading: true})
        data.robotContract.openPunishments.push(punishment);
        await AsyncStorage.setItem('@config', JSON.stringify(data));
        setState({data, loading: false})
    }
}
export const SettingsStore = createStore({ initialState, actions });