import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text, Surface} from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";
import { DataStore } from "../data/dataprovider";
import { createHook } from 'react-sweet-state';

const useDataStore = createHook(DataStore);

export const EditTask = (props) => {
    const [task, setTask] = React.useState(props.task);

    const onChange = (name, value) => {
        setTask((prevState) => ({ ...prevState, [name]: value }));
    };

    const [state, actions] = useDataStore();

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
        <Surface style={styles.modal}>
            <Title>{task.name}</Title>
            <Divider />
            <TextInput
                label="Description"
                value={task.description}
                disabled={false}
                style={styles.modalDescription}
                multiline={true}
                onChangeText={text => onChange("description", text)}
            />


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
            <View style={styles.buttonRow}>
                <Button icon="content-save" color={Colors.green700} style={styles.modalButton} onPress={() => { actions.saveTask(props.contract._id, task); props.hide() }}>Save</Button>
                <Button icon="delete" color={Colors.red700} style={styles.modalButton} onPress={() => { actions.deleteTask(props.contract._id, task); props.hide() }}>Delete</Button>
                <Button icon="cancel" color={Colors.orange700} style={styles.modalButton} onPress={props.hide}>Cancel</Button>
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    modal: {
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