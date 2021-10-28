import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore, createSubscriber, createHook } from 'react-sweet-state';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const BaseURL = "http://10.0.1.1:8088/";

async function contractsAsync() {
    try {
        console.log("Loading");
        const response = await fetch(BaseURL + "getcontracts", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                id: "9c167fa8-7094-4b8d-9714-fbebf79297ac"
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

async function saveContractConfig(contractId, config) {
    try {
        console.log("Loading");
        const response = await fetch(BaseURL + "contract/config", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
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
        const response = await fetch(BaseURL + "punishment", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
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
        const response = await fetch(BaseURL + "punishment", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
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
    const response = await fetch(BaseURL + "task", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
            contractId: contractId,
            task: task
        })
    });
    return response.status == 204;
}

async function createTask(contractId, task) {
    const response = await fetch(BaseURL + "task", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
            contractId: contractId,
            task: task
        })
    });
    return response.status == 204;
}

async function deleteTask(contractId, task) {
    const response = await fetch(BaseURL + "task", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
            contractId: contractId,
            task: task
        })
    });
    return response.status == 204;
}

async function startTask(contractId, task) {
    const response = await fetch(BaseURL + "task/start", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
            contractId: contractId,
            task: { _id: task._id }
        })
    });
    return response.status == 204;
}

async function performTask(contractId, task) {
    const response = await fetch(BaseURL + "task/perform", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
            contractId: contractId,
            task: { _id: task._id }
        })
    });
    return response.status == 204;
}

async function stopTask(contractId, task) {
    const response = await fetch(BaseURL + "task/stop", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            id: "9c167fa8-7094-4b8d-9714-fbebf79297ac",
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
            const data = await contractsAsync();
            setState({ data, loading: false });
        } catch (error) {
            setState({ error, loading: false });
        }
    },
    invalid: () => ({ getState, setState }) => {
        if (getState().loading) return;
        setState({ data: null, loading: false });
    },
    saveContractConfig: (contractid) => async ({ getState, setState }) => {
        let data = getState().data
        setState({ data, loading: true });
        await saveContractConfig(contractid, contract.config);
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

