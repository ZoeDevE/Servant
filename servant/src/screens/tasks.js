import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Colors, ProgressBar, Modal, Portal, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator, FAB, Card} from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";
import { DataStore } from "../data/dataprovider";
import { createHook } from 'react-sweet-state';
import { SettingsStore } from "../data/configprovider";
import getContract from '../data/contracthelper';
import { EditTask } from '../modals/EditTask';
import { NewTask } from '../modals/NewTask';
import { EditTaskRobot } from '../modals/EditTaskRobot';
import { NewTaskRobot } from '../modals/NewTaskRobot';
import checkTask from '../data/robottask';

const useDataStore = createHook(DataStore);
const useConfigStore = createHook(SettingsStore);

const TaskCard = (props) => {
    let button;
    let progress = 0;
    let progressColor = Colors.red800;
    let timeProgress = 0;
    let timeProgressColor = Colors.green400;
    let buttonPressable = false;


    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
 
    const [dataState, dataActions] = useDataStore();


   
    if (props.task.goalVisible || props.master) {
        progress = props.task.performed / props.task.goal;
        if (progress < 0.5) {
            progressColor = Colors.red800;
        } else if (progress < 1.0) {
            progressColor = Colors.yellow800;
        } else {
            progressColor = Colors.green400;
            progress = 1.0;
        }
    } else {
        progress = 0.0
        progressColor = Colors.grey500;
    }

    timeProgress = ((Date.now() - props.task.start)) / props.task.endDuration;
    if (props.task.timeVisible || props.master) {
        if (timeProgress < 0.5) {
            timeProgressColor = Colors.green400;
            buttonPressable = true;
        } else if (timeProgress < 1.0) {
            timeProgressColor = Colors.yellow800;
            buttonPressable = true;
        } else {
            timeProgressColor = Colors.red800;
            timeProgress = 1.0;
        }
    } else {
        timeProgress = 0.0
        timeProgressColor = Colors.grey500;
    }


    if (props.task.type == 0) {
        if (props.task.startTime == 0) {
            button = <IconButton
                icon="play"
                onPress={() => { dataActions.startTask(props.contract._id, props.task) }}
                size={40}
                color={Colors.green700}
                style={styles.button}
                disabled={!buttonPressable}
            />
        } else {
            button = <IconButton
                icon="stop"
                onPress={() => { dataActions.stopTask(props.contract._id, props.task) }}
                size={40}
                color={Colors.green700}
                style={styles.button}
                disabled={!buttonPressable}
            />
        }
    } else {
        button = <IconButton
            icon="check-bold"
            onPress={() => { dataActions.performTask(props.contract._id, props.task) }}
            size={40}
            color={Colors.yellow700}
            style={styles.button}
            disabled={!buttonPressable}
        />
    }

    let edittask;
    if (props.robot) {
        edittask = (<EditTaskRobot {...props} hide={hideModal} />);
    } else {
        edittask = (<EditTask {...props} hide={hideModal} />);
    }


    return (
        <Card style={styles.card}
            onPress={showModal}
        >
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} >
                    {edittask}
                </Modal>
            </Portal>
            <Text style={styles.cardTitle}>{props.task.name}</Text>
            <View style={[styles.container, {
                // Try setting `flexDirection` to `"row"`.
                flexDirection: "row"
            }]}>
                <View style={{ flex: 3.5}}>
                    <Text>Progress</Text>
                    <ProgressBar progress={progress} color={progressColor} style={styles.progressbar} />
                    <Text>Time left</Text>
                    <ProgressBar progress={timeProgress} color={timeProgressColor} />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {button}
                </View>
            </View>
        </Card >
    );
}

export default function Tasks() {
    const [dataState, dataActions] = useDataStore();
    const [settingsState, settingsActions] = useConfigStore();
    useEffect(
        () => { if (!settingsState.data) settingsActions.fetch(); },
        [settingsState, settingsActions],
    );
    if (!settingsState.data) {
        return (<ActivityIndicator size='large' animating={true} color={Colors.red800} style={{ align: "center" }} />);
    }
    useEffect(
        () => { if (!dataState.data) dataActions.fetch(); },
        [dataState, dataActions],
    );

    

    //Show loading animation while loading data and settings
    if (!dataState.data || !settingsState.data) {
        return (<ActivityIndicator size='large' animating={true} color={Colors.red800} style={{ align: "center" }} />);
    }

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    let [contract, type, id] = getContract(settingsState, dataState);

    if (!contract) {
        return (<Title>No contract found</Title>)
    }

    useEffect(() => {
        if (type == 2) {
            contract.tasks.forEach(task => {
                //task.verifyTime = task.verifyTime - 200000000;
                let [changed, punishment] = checkTask(task, contract);
                console.log(changed);
                if (punishment) {
                    settingsActions.addPunishment(punishment);
                }
                if (changed) {
                    settingsActions.saveTask(task);
                }            
            });
        }
    }, [settingsActions]);

    let fab;
    if (type == 0 || type == 2) {
        fab = (<FAB
            style={styles.fab}
            large
            icon="plus"
            onPress={showModal}
        />);
    }
    
    let newtask;
    let cards = contract.tasks
    .filter(task => (Date.now() < (task.start + task.endDuration)))
    .map(task => (<TaskCard task={task} contract={contract} key={task._id} master={type == 0} robot={type == 2} />));

    if (type == 2) {
        newtask = (<NewTaskRobot hide={hideModal} contract={contract} />);
    } else {
        newtask = (<NewTask hide={hideModal} contract={contract} />);
    }

    return (
        <View style={{ flex: 1 }}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal}>
                    {newtask}
                </Modal>
            </Portal>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
                <View>
                    {cards}
                </View>
            </ScrollView>
            {fab}
        </View>

    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 7,
        marginLeft: 7,
        marginRight: 7,
        padding: 5,        
    },
    cardTitle: {
        fontSize: 30,
        marginBottom: 10,
        marginLeft: 5
    },
    container: {
        flex: 1,
        padding: 0,
    },
    button: {
        marginTop: 0,
    },
    progressbar: {
        marginBottom: 10
    }, 
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});