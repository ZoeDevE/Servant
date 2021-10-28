import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text } from 'react-native-paper';

export const ServantScreen = () => {

    const [text, setText] = React.useState("");

    return (
        <View>
            <Title>Become servant</Title>
            <Divider />
            <Text>
                To become a servant send your Master your invite code, press randomize to change your code.
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