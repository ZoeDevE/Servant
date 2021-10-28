import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text } from 'react-native-paper';

export const MasterScreen = () => {

    const [text, setText] = React.useState("");

    return (
        <View>
            <Title>Become Master</Title>
            <Divider />
            <Text>
                Enter your servants invite code below and press create contract.
            </Text>
            <TextInput
                label="Invite code"
                value={text}
                multiline={false}
                onChangeText={setText}
            />
            <Button icon="content-save" color={Colors.green700} >Create</Button>
        </View>
    );
}