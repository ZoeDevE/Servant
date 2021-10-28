import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { IconButton, Colors, ProgressBar, Modal, Portal, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";
import { DataStore } from "../data/dataprovider";
import { createHook } from 'react-sweet-state';
import { SettingsStore } from "../data/configprovider";
import getContract from '../data/contracthelper';

const useDataStore = createHook(DataStore);
const useConfigStore = createHook(SettingsStore);

export const ContractScreen = () => {
    const [state, actions] = useConfigStore();
    useEffect(
        () => { if (!state.data) actions.fetch(); },
        [state, actions],
    );

    const [dataState, dataActions] = useDataStore();
    useEffect(
        () => { if (!dataState.data) actions.fetch(); },
        [dataState, dataActions],
    );

    //Wait for everything to load
    if (!state.data || !dataState.data) {
        return (
            <ActivityIndicator />
        )
    }

    let [contract, type, contractid] = getContract(state, dataState);

    if (!contract) {
        return (<Title>No contract</Title>)
    }

    var master = (type == 0);

    const [config, setState] = React.useState(contract.config);
    const onChange = (name, value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <View>
            <Title>Contract: {config.name}</Title>
            <TextInput
                label="Name"
                value={config.name}
                disabled={!master}
                multiline={false}
                onChangeText={(text) => onChange("name", text)}
            />
            <TextInput
                label="Punishments"
                value={config.punishments}
                disabled={!master}
                multiline={true}
                onChangeText={(text) => onChange("punishments", text)}
            />
            <View style={styles.buttonRow}>
                <Button icon="content-save"
                    disabled={!master}
                    color={Colors.green700}
                    style={styles.button}
                    onPress={() => { contract.config = config; dataActions.saveContractConfig(contractid)}}
                >Save</Button>
                <Button icon="delete"
                    disabled={!master}
                    color={Colors.red700}
                    style={styles.button}
                >Delete</Button>
                <Button icon="cancel"
                    disabled={!master}
                    color={Colors.orange700}
                    style={styles.button}
                    onPress={() => setState(contract.config)}
                >Cancel</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonRow: {
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        height: 40,
        margin: 5
    }
});