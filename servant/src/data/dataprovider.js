import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, createSubscriber, createHook } from 'react-sweet-state';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import { SettingsStore, ID } from './configprovider';
import { endpoint } from '../../app.json';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

async function contractsAsync() {
    try {
        console.log("Loading");
        while(!ID) {    //Shitty wait function for ID to be set
            await new Promise(r => setTimeout(r, 100));
        }
        const response = await fetch(endpoint + "getcontracts", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                id: ID
            })
        })
        data = response.json()
        console.log(data);
        if (data != null) {
            return data;
        } else {
            return {};
        }
    } catch (e) {  // saving error 
        console.log(e);
        console.log("Error");
        await new Promise(r => setTimeout(r, 2000));
    } finally {
        console.log("Done");
    }

}

async function createContract(inviteCode, name) {
    try {
        console.log("Creating contract");
        const response = await fetch(endpoint + "contract", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: ID,
                inviteCode: inviteCode,
                name: name
            })
        })
    } catch (e) {  // saving error 
        console.log(e);
        console.log("Error");
        await new Promise(r => setTimeout(r, 2000));
        return false;
    } finally {
        console.log("Done");
        return true;
    }
}

async function saveContractConfig(contractId, config) {
    try {
        console.log("Loading");
        const response = await fetch(endpoint + "contract/config", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: ID,
                contractId: contractId,
                config: config
            })
        })
    } catch (e) {  // saving error 
        console.log(e);
        console.log("Error");
        await new Promise(r => setTimeout(r, 2000));
        return false;
    } finally {
        console.log("Done");
        return true;
    }
}

async function addPunishment(contractId, punishment) {
    try {
        console.log("Loading");
        const response = await fetch(endpoint + "punishment", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: ID,
                contractId: contractId,
                punishment: punishment
            })
        })
    } catch (e) {  // saving error 
        console.log(e);
        console.log("Error");
        await new Promise(r => setTimeout(r, 2000));
        return false;
    } finally {
        console.log("Done");
        return true;
    }
}

async function removePunishment(contractId, punishment) {
    try {
        console.log("Loading");
        const response = await fetch(endpoint + "punishment", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: ID,
                contractId: contractId,
                punishment: punishment
            })
        })
    } catch (e) {  // saving error 
        console.log(e);
        console.log("Error");
        await new Promise(r => setTimeout(r, 2000));
        return false;
    } finally {
        console.log("Done");
        return true;
    }
}

async function saveTask(contractId, task) {
    const response = await fetch(endpoint + "task", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: ID,
            contractId: contractId,
            task: task
        })
    });
    return response.status == 204;
}

async function createTask(contractId, task) {
    const response = await fetch(endpoint + "task", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: ID,
            contractId: contractId,
            task: task
        })
    });
    return response.status == 204;
}

async function deleteTask(contractId, task) {
    const response = await fetch(endpoint + "task", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: ID,
            contractId: contractId,
            task: task
        })
    });
    return response.status == 204;
}

async function startTask(contractId, task) {
    const response = await fetch(endpoint + "task/start", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: ID,
            contractId: contractId,
            task: { _id: task._id }
        })
    });
    return response.status == 204;
}

async function performTask(contractId, task) {
    const response = await fetch(endpoint + "task/perform", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: ID,
            contractId: contractId,
            task: { _id: task._id }
        })
    });
    return response.status == 204;
}

async function stopTask(contractId, task) {
    const response = await fetch(endpoint + "task/stop", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: ID,
            contractId: contractId,
            task: { _id: task._id }
        })
    });
    return response.status == 204;
}



const actions = {
    fetch: () => async ({ getState, setState }) => {
        if (getState().loading) return;
        setState({ loading: true });
        try {
            const data = await contractsAsync();
            setState({ data, loading: false });
        } catch (error) {
            setState({ error, loading: false });
        }
    },
    refresh: () => async ({ getState, setState }) => {
        if (getState().loading) return;
        try {
            setState({ loading: true });
            const data = await contractsAsync();
            setState({ data, loading: false });
        } catch (error) {
            setState({ error, loading: false });
        }
    },
    createContract: (inviteCode, name) => async ({getState, setState}) => {
        await createContract(inviteCode, name);
        setState({ loading: true });
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    saveContractConfig: (contractid, config) => async ({ getState, setState }) => {
        let data = getState().data
        setState({ data, loading: true });
        await saveContractConfig(contractid, config);
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    saveTask: (contractid, task, punishment = null) => async ({ getState, setState }) => {
        try {
            let data = getState().data;
            setState({ data, loading: true });
            if (punishment) {
                await addPunishment(contractid, punishment);
            }
            let res = await saveTask(contractid, task);
            data = await contractsAsync();
            setState({ data, loading: false });
        } catch (e) {
            console.log(e);
        }
    },
    createTask: (contractid, task) => async ({ getState, setState }) => {
        let data = getState().data;
        setState({ data, loading: true });
        await createTask(contractid, task);
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    deleteTask: (contractid, task) => async ({ getState, setState }) => {
        let data = getState().data;
        setState({ data, loading: true });
        await deleteTask(contractid, task);
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    performTask: (contractid, task) => async ({ getState, setState }) => {
        let data = getState().data;
        setState({ data, loading: true });
        await performTask(contractid, task);
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    startTask: (contractid, task) => async ({ getState, setState }) => {
        let data = getState().data;
        setState({ data, loading: true });
        await startTask(contractid, task);
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    stopTask: (contractid, task) => async ({ getState, setState }) => {
        let data = getState().data;
        setState({ data, loading: true });
        await stopTask(contractid, task);
        data = await contractsAsync();
        setState({ data, loading: false });
    },
    removePunishment: (contractid, punishment) => async ({ getState, setState }) => {
        let data = getState().data;
        setState({ data, loading: true });
        await removePunishment(contractid, punishment);
        data = await contractsAsync();
        setState({ data, loading: false });

    }
}

export const DataStore = createStore({ initialState, actions });

