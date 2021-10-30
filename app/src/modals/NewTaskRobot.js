import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text } from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";
import { SettingsStore } from '../data/configprovider';
import { createHook } from 'react-sweet-state';
import uuid from 'react-native-uuid';

const useDataStore = createHook(SettingsStore);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function setVerifyTime(task) {
    let taskrw = {...task};
    let date = new Date()
    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);
    date.setSeconds(0);


    taskrw.start = date.getTime();
    taskrw.verifyTime = date.getTime()+getRandomInt(taskrw.minDuration, taskrw.endDuration);

    return taskrw
}


export const NewTaskRobot = (props) => {
    let date = new Date()
    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);
    date.setSeconds(0);

    let initVal = {
        _id: uuid.v4(),
        type: 0,
        name: "",
        description: "",
        start: date.getTime(),
        minDuration: 6 * (24 * 60 * 60 * 1000),
        endDuration: 7 * (24 * 60 * 60 * 1000),
        goal: 0,
        performed: 0,
        active: false,
        goalVisible: true,
        timeVisible: true,
        globalPunish: true,
        punishments: "",
        locked: false,
        startTime: 0,
        verifyTime: 0
    };
    const [task, setTask] = React.useState(initVal);

    const onChange = (name, value) => {
        setTask((prevState) => ({ ...prevState, [name]: value }));
    };

    const [state, actions] = useDataStore();
    React.useEffect(
        () => { if (!state.data) actions.fetch(); },
        [state, actions],
    );

    if (!state.data) {
        return (
            <ActivityIndicator />
        )
    }

    let goaltarget;
    if (task.type == 0) {
        goaltarget = (<View style={styles.modalRow}>
            <Text>Goal (m)</Text>
            <InputSpinner
                style={styles.spinner}
                max={1000}
                min={0}
                step={1}
                skin="clean"
                height={40}
                width={120}
                value={task.goal / (60 * 1000)}
                onChange={(num) => { onChange("goal", num * 60 * 1000); }}
            />
        </View>);
    } else {
        goaltarget = (<View style={styles.modalRow}>
            <Text>Goal</Text>
            <InputSpinner
                style={styles.spinner}
                max={1000}
                min={0}
                step={1}
                skin="clean"
                height={40}
                width={120}
                value={task.goal}
                onChange={(num) => { onChange("goal", num); }}
            />
        </View>);
    }

    return (
        <View style={styles.modal}>
            <Title>New Task</Title>
            <Divider />
            <TextInput
                label="Name"
                value={task.name}
                disabled={false}
                style={styles.modalDescription}
                multiline={true}
                onChangeText={text => onChange("name", text)}
            />
            <TextInput
                label="Description"
                value={task.description}
                disabled={false}
                style={styles.modalDescription}
                multiline={true}
                onChangeText={text => onChange("description", text)}
            />


            <View style={styles.modalRow}>
                <Text>Timed task?</Text>
                <Switch value={task.type ? false : true} onValueChange={() => onChange("type", !task.type)} />
            </View>
            <View style={styles.modalRow}>
                <Text>Progress visible</Text>
                <Switch value={task.goalVisible} onValueChange={() => onChange("goalVisible", !task.goalVisible)} />
            </View>

            {goaltarget}

            <View style={styles.modalRow}>
                <Text>Time visible</Text>
                <Switch value={task.timeVisible} onValueChange={() => onChange("timeVisible", !task.timeVisible)} />
            </View>

            <View style={styles.modalRow}>
                <Text styles={{ flex: 5 }}>Minimum time (days)</Text>
                <InputSpinner
                    style={styles.spinner}
                    max={60}
                    min={1}
                    step={1}
                    skin="clean"
                    height={40}
                    width={120}
                    value={task.minDuration / (24 * 60 * 60 * 1000)}
                    onChange={(num) => { onChange("minDuration", num * 24 * 60 * 60 * 1000); }}
                />
            </View>

            <View style={styles.modalRow}>
                <Text>Maximum time (days)</Text>
                <InputSpinner
                    style={styles.spinner}
                    max={60}
                    min={1}
                    step={1}
                    skin="clean"
                    height={40}
                    width={120}
                    value={task.endDuration / (24 * 60 * 60 * 1000)}
                    onChange={(num) => { onChange("endDuration", num * 24 * 60 * 60 * 1000); }}
                />
            </View>
            <View style={styles.modalRow}>
                <Text>Use global punishments</Text>
                <Switch value={task.globalPunish} onValueChange={() => onChange("globalPunish", !task.globalPunish)} />
            </View>
            <TextInput
                label="Unique punishments"
                value={task.punishments}
                disabled={false}
                style={styles.modalPunish}
                multiline={true}
                onChangeText={text => onChange("punishments", text)}
            />
            <Divider />
            <View style={styles.modalRow}>
                <Text>Lock</Text>
                <Switch value={task.locked} onValueChange={() => onChange("locked", !task.locked)} />
            </View>
            <View style={styles.buttonRow}>
                <Button icon="content-save" color={Colors.green700} style={styles.modalButton} onPress={() => { actions.createTask(setVerifyTime(task)); props.hide() }}>Save</Button>
                <Button icon="cancel" color={Colors.orange700} style={styles.modalButton} onPress={props.hide}>Cancel</Button>
            </View>
        </View>
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