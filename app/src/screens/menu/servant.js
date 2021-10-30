import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text, ActivityIndicator} from 'react-native-paper';
import { DataStore } from "../../data/dataprovider";
import { SettingsStore } from "../../data/configprovider";
import { createHook } from 'react-sweet-state';
import Clipboard from '@react-native-clipboard/clipboard';

const useConfig = createHook(SettingsStore);
const useDataStore = createHook(DataStore);

export const ServantScreen = () => {
    const [state, actions] = useConfig();
    React.useEffect(
        () => { if (!state.data) actions.fetch(); },
        [state, actions],
    );

    const [dataState, dataActions] = useDataStore();
    React.useEffect(
        () => { if (!dataState.data) actions.fetch(); },
        [dataState, dataActions],
    );

    if(!state.data || !dataState.data) {
        return (<ActivityIndicator/>);
    }

    const [text, setText] = React.useState(state.data.inviteCode);

    return (
        <View>
            <Title style={{padding:10}}>Become servant</Title>
            <Divider />
            <Text style={{padding:10}}>
                To become a servant send your Master your invite code, press randomize to change your code.
            </Text>
            <TextInput
                label="Invite code"
                value={state.data.inviteCode}
                multiline={false}
                disabled={true}
                mode={'outlined'}
                style={{padding:10}}
            />
            <Button icon="content-save" color={Colors.green700} onPress={actions.generateInvite}>Randomize</Button>
            <Button icon="content-copy" color={Colors.green700} onPress={() => {Clipboard.setString(state.data.inviteCode)}}>Copy</Button>
        </View>
    );
}