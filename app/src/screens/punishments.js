import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Colors, Title, ActivityIndicator, Card } from 'react-native-paper';
import { DataStore } from "../data/dataprovider";
import { createHook } from 'react-sweet-state';
import { SettingsStore } from "../data/configprovider";
import getContract from '../data/contracthelper';

const useDataStore = createHook(DataStore);
const useConfigStore = createHook(SettingsStore);

const TaskCard = (props) => {

    const [dataState, dataActions] = useDataStore();

    return (
        <Card style={styles.card}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 4, padding: 5, justifyContent: 'center' }}>
                    <Title>{props.punishment}</Title>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                        icon="clipboard-check"
                        onPress={() => { dataActions.removePunishment(props.contract._id, props.punishment) }}
                        size={50}
                        color={Colors.green700}
                        style={styles.button}
                    />
                </View>
            </View>
        </Card>
    )
}

const TaskCardRobot = (props) => {

    const [dataState, dataActions] = useConfigStore();

    return (
        <Card style={styles.card}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 4, padding: 5, justifyContent: 'center' }}>
                    <Title>{props.punishment}</Title>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                        icon="clipboard-check"
                        onPress={() => { dataActions.removePunishment(props.contract._id, props.punishment) }}
                        size={50}
                        color={Colors.green700}
                        style={styles.button}
                    />
                </View>
            </View>
        </Card>
    )
}

export const PunishmentScreen = () => {
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

    let cards;

    if (contract.openPunishments.length >= 0) {
        console.log(contract.openPunishments.length)
        if (type == 2) {
            cards = contract.openPunishments
                .map((punishment, index) => (<TaskCardRobot contract={contract} punishment={punishment} master={master} key={index} />));
            cards = (<TaskCardRobot contract={contract} punishment={"Test punishment"} master={master} key={0} />);
        } else {
            cards = contract.openPunishments
                .map((punishment, index) => (<TaskCard contract={contract} punishment={punishment} master={master} key={index} />));
        }
    } else {
        cards = (<Title>No punishments left</Title>)
    }

    return (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
            <View>
                {cards}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 7,
        marginLeft: 7,
        marginRight: 7,
        padding: 5,
        height: 80,
    },
    button: {
        marginTop: 12,
    }
});