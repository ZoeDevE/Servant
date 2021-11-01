import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Colors, ProgressBar, Modal, Portal, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator, Card } from 'react-native-paper';
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

    var master = (type == 0) || (type == 2);

    const [config, setState] = React.useState(contract.config);
    const onChange = (name, value) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    let configurationRobot;
    let locked = false;
    let contractHandler = dataActions;
    if (type == 2) {
        configurationRobot = (
            <View>
                <Divider style={{ margin: 5 }} />
                <Text>Configuration options for your robot servant, if any tasks are locked editing is not possible.</Text>
                <View style={styles.modalRow}>
                    <Text>Unlock</Text>
                    <Switch value={config.unlock} onValueChange={() => onChange("unlock", !config.unlock)} />
                </View>
            </View>
        );
        contract.tasks.forEach(function (item, index) {
            if (item.locked) {
                locked = true;
            }
        });
        contractHandler = actions;
    }

    return (
        <Card style={styles.card}>
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
                disabled={!master || locked}
                multiline={true}
                onChangeText={(text) => onChange("punishments", text)}
            />
            {configurationRobot}
            <View style={styles.buttonRow}>
                <Button icon="content-save"
                    disabled={!master}
                    color={Colors.green700}
                    style={styles.button}
                    onPress={() => { contractHandler.saveContractConfig(contractid, config) }}
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
        </Card>
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
    },
    modalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 0,
    },
    card: {
        marginTop: 7,
        marginLeft: 7,
        marginRight: 7,
        padding: 5,
        paddingBottom: 15
    },
});