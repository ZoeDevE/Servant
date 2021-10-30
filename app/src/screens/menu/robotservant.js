import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator} from 'react-native-paper';
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
        <View>
            <Title>Become robot servant</Title>
            <Divider />
            <Text>
                Currently no master? Become a robot servant by pressing the button below. You can add tasks and the robot will punish you when you fail to meet your goals.
            </Text>
            <Button icon="content-save" color={Colors.green700} onPress={actions.createRobot}>Create</Button>
        </View>
    );
}