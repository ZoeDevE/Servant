import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator, Card} from 'react-native-paper';
import { SettingsStore } from '../../data/configprovider'
import { createHook } from 'react-sweet-state';

const useDataStore = createHook(SettingsStore);

export const RobotServantScreen = () => {
    const [text, setText] = React.useState("");

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

    return (
        <Card style={styles.card}>
            <Title style={{padding:10}}>Become robot servant</Title>
            <Divider />
            <Text style={{padding:10}}>
                Currently no master? Become a robot servant by pressing the button below. You can add tasks and the robot will punish you when you fail to meet your goals.
            </Text>
            <Button icon="content-save" color={Colors.green700} onPress={actions.createRobot}>Create</Button>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 7,
        marginLeft: 7,
        marginRight: 7,
        padding: 5,
        paddingBottom: 15
    }
});