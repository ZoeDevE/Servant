import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { IconButton, Colors, ProgressBar, Modal, Portal, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";
import { DataStore } from "../data/dataprovider";
import { createHook } from 'react-sweet-state';
import { SettingsStore } from "../data/configprovider";
import { Picker } from '@react-native-picker/picker';
import getContract from '../data/contracthelper';
import { EditTask } from '../modals/EditTask';

const useDataStore = createHook(DataStore);
const useConfigStore = createHook(SettingsStore);

const TaskCard = (props) => {
    let progress = 0;
    let progressColor = Colors.red800;
    let timeProgress = 0;
    let timeProgressColor = Colors.green400;
    let name = "Unknown";

    const [visible, setVisible] = React.useState(false);

    const [state, actions] = useDataStore();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    if (props.task) {
        name = props.task.name;
    }

    if (props.task) {

        progress = props.task.performed / props.task.goal;
        if (progress < 0.5) {
            progressColor = Colors.red800;
        } else if (progress < 1.0) {
            progressColor = Colors.yellow800;
        } else {
            progressColor = Colors.green400;
            progress = 1.0;
        }


        timeProgress = ((Date.now() - props.task.start)) / props.task.endDuration;
        console.log(timeProgress);
        if (timeProgress < 0.5) {
            timeProgressColor = Colors.green400;
        } else if (timeProgress < 1.0) {
            timeProgressColor = Colors.yellow800;
        } else {
            timeProgressColor = Colors.red800;
            timeProgress = 1.0;
        }
    }

    let defaultPunish;
    let punish;
    if (props.task.punishments) {
        punish = props.task.punishments.split("\n").map(punishname => <Picker.Item key={"S" + punishname} label={punishname} value={punishname} />);
        if(props.task.goal > props.task.performed) defaultPunish = props.task.punishments.split("\n")[0];
    }
    let gPunish;
    if (props.task.globalPunish) {
        gPunish = props.contract.config.punishments.split("\n").map(punishname => <Picker.Item key={"G" + punishname} label={punishname} value={punishname} />);
        if(props.task.goal > props.task.performed && !defaultPunish) defaultPunish = props.contract.config.punishments.split("\n")[0];
    }
    console.log(defaultPunish);
    const [punishment, setPunishment] = React.useState(defaultPunish);

    const resetTask = () => {
        let date = new Date()
        date.setHours(0);
        date.setMinutes(0);
        date.setMilliseconds(0);
        date.setSeconds(0);

        props.task.start = date.getTime();
        actions.saveTask(props.contract._id, props.task, punishment);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardTouch}
                onPress={showModal}
            >
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <EditTask {...props} hide={hideModal} />
                    </Modal>
                </Portal>
                <Text style={styles.cardTitle}>{name}</Text>
                <View style={[styles.container, {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: "row"
                }]}>
                    <View style={{ flex: 4, padding: 5 }}>
                        <Text>Progress</Text>
                        <ProgressBar progress={progress} color={progressColor} style={{ marginBottom: 10 }} />
                        <Text>Time left</Text>
                        <ProgressBar progress={timeProgress} color={timeProgressColor} />

                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                            icon="check-outline"
                            onPress={resetTask}
                            size={50}
                            color={Colors.green700}
                            style={styles.button}
                        />
                    </View>

                </View>
            </TouchableOpacity >
            <Picker
                style={{ backgroundColor: "white", marginTop: 30 }}
                selectedValue={punishment}
                onValueChange={(itemValue, itemIndex) =>
                    setPunishment(itemValue)
                }
            >
                <Picker.Item key="No punish" label="No punishment" value="" />
                {punish}
                {gPunish}
            </Picker>
        </View>
    );
}

export default function Verify() {
    const [dataState, dataActions] = useDataStore();
    useEffect(
        () => { if (!dataState.data) dataActions.fetch(); },
        [dataState, dataActions],
    );
    const [settingsState, settingsActions] = useConfigStore();
    useEffect(
        () => { if (!settingsState.data) settingsActions.fetch(); },
        [settingsState, settingsActions],
    );

    //Show loading animation while loading data and settings
    if (!dataState.data || !settingsState.data) {
        return (<ActivityIndicator size='large' animating={true} color={Colors.red800} style={{ align: "center" }} />);
    }

    let [contract, type, id] = getContract(settingsState, dataState);

    if (!contract) {
        return (<Title>No contract found</Title>)
    }

    console.log(Date.now());

    let cards = contract.tasks
        .filter(task => Date.now() > (task.start + task.minDuration))
        .map(task => (<TaskCard task={task} contract={contract} key={task._id} />));

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
        backgroundColor: '#cfd8dc',
        padding: 5,
        height: 180,
    },
    cardTouch: {
        height: 80
    },
    cardTitle: {
        fontSize: 30,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        padding: 0,
    },
    button: {
        marginTop: 12,
    },
    modal: {
        backgroundColor: 'white',
        padding: 10,
        paddingBottom: 5,
    },
    modalDescription: {
        marginTop: 10
    },
    modalPunish: {
        marginTop: 10,
        marginBottom: 10
    },
    spinner: {
        marginRight: 10,
    },
    modalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 0,
    },
    buttonRow: {
        flex: 1,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        height: 40,
        margin: 5
    }
});