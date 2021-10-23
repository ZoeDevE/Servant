import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { IconButton, Colors, ProgressBar } from 'react-native-paper';

const timedTask = {
    type: 0,
    name: "Timed task",
    start: Date.now() - 3*1000,
    minDuration: 5,
    endDuration: 7,
    goal: 5*60,
    performed: 7*60,
    goalVisible: false,
    timeVisible: false,
}

const fixedTask = {
    type: 1,
    name: "Fixed task",
    start: Date.now(),
    minDuration: 5,
    endDuration: 7,
    goal: 5*60,
    performed: 3*60,
    goalVisible: true,
    timeVisible: true,
}


const TaskCard = (props) => {
    let button;
    let progress = 0;
    let progressColor = Colors.red800;
    let timeProgress = 0;
    let timeProgressColor = Colors.green400;
    let buttonPressable = false;
    let name = "Unkown";

    if (props.task) {
        name = props.task.name;
    }

    if (props.task) {
        if(props.task.goalVisible) {
            progress = props.task.performed/props.task.goal;
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
        
        if(props.task.goalVisible) {
            timeProgress = ((Date.now() - props.task.start)/1000)/props.task.endDuration;
            console.log(timeProgress);
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
    }

    if (props.task && props.task.type == 0) {
        button = <IconButton
            icon="play"
            onPress={() => alert('Tapped button')}
            size={50}
            color={Colors.green700}
            style={styles.button}
            disabled={!buttonPressable}
        />
    } else {
        button = <IconButton
            icon="check-bold"
            onPress={() => alert('Tapped button')}
            size={50}
            color={Colors.yellow700}
            style={styles.button}
            disabled={!buttonPressable}
        />
    }

    return (
        <TouchableOpacity style={styles.card}
            onPress={() => { alert('Tapped card'); }}
        >
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
                    {button}
                </View>
            </View>
        </TouchableOpacity >
    );
}


export default function Tasks() {
    return (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
            <View>
                <TaskCard task={timedTask}/>
                <TaskCard task={fixedTask}/>
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
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
        height: 120,
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
    }
});