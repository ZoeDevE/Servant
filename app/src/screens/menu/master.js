import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text } from 'react-native-paper';
import { DataStore } from '../../data/dataprovider'
import { createHook } from 'react-sweet-state';

const useDataStore = createHook(DataStore);

export const MasterScreen = () => {

    const [dataState, dataActions] = useDataStore();
    React.useEffect(
        () => { if (!dataState.data) actions.fetch(); },
        [dataState, dataActions],
    );

    //Wait for everything to load
    if (!dataState.data) {
        return (
            <ActivityIndicator />
        )
    }

    const [text, setText] = React.useState({invite:"", contract:""});

    const onChange = (name, value) => {
        setText((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <View>
            <Title>Become Master</Title>
            <Divider />
            <Text>
                Enter your servants invite code below and press create contract.
            </Text>
            <TextInput
                label="Invite code"
                value={text.invite}
                multiline={false}
                onChangeText={(text) => {onChange("invite", text)}}
            />
            <TextInput
                label="Contract name"
                value={text.contract}
                multiline={false}
                onChangeText={(text) => {onChange("contract", text)}}
            />
            <Button icon="content-save" color={Colors.green700} onPress={() => {dataActions.createContract(text.invite, text.contract)}}>Create</Button>
        </View>
    );
}