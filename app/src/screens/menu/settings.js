import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { View } from 'react-native';
import { Text, Title, ActivityIndicator, Divider } from 'react-native-paper'
import { createStore, createSubscriber, createHook } from 'react-sweet-state';
import { DataStore } from "../../data/dataprovider";
import { SettingsStore } from "../../data/configprovider";
import { Picker } from '@react-native-picker/picker';
import getContract from '../../data/contracthelper';

const useConfig = createHook(SettingsStore);
const useDataStore = createHook(DataStore);

export const SettingsScreen = () => {
    const [state, actions] = useConfig();
    useEffect(
        () => { if (!state.data) actions.fetch(); },
        [state, actions],
    );

    const [dataState, dataActions] = useDataStore();
    useEffect(
        () => { if (!dataState.data) actions.fetch(); },
        [dataState, dataActions],
    );

    if(!state.data || !dataState.data) {
        return (<ActivityIndicator/>);
    }

    const selectContract = (contract) => {
        setSelectedContract(contract);
        actions.saveContract(contract);
    }

    const [selectedContract, setSelectedContract] = useState(state.data.activeContract);

    var master = dataState.data.master.map(contract => (<Picker.Item key={contract._id} label={"Master - " + contract.config.name} value={contract._id} />));
    var servant = dataState.data.servant.map(contract => (<Picker.Item key={contract._id} label={"servant - " + contract.config.name} value={contract._id} />));
    var robot;
    if (dataState.data.robotContract) {
        robot = (<Picker.Item key="robot" label="Robot servant" value="robot" />)
    }
    
    return (
        <View style={{ flex: 1, margin: 20 }}>
            <Title>Your id</Title>
            <Text> {state.data.id}</Text>
            <Text> Never share this ID with anyone</Text>
            <Divider style={{ marginVertical: 20 }} />
            <Title>Contract</Title>
            <Text>Select the contract you want to display in the app</Text>
            <Picker
                selectedValue={selectedContract}
                onValueChange={(itemValue, itemIndex) =>
                    selectContract(itemValue)
                }>
                {master}
                {servant}
                {robot}
            </Picker>
        </View>
    );
}