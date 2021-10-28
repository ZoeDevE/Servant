import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Title, Divider, Switch, TextInput, Button, Text } from 'react-native-paper';

export const RobotServantScreen = () => {

    const [text, setText] = React.useState("");

    return (
        <View>
            <Title>Become robot servant</Title>
            <Divider />
            <Text>
                Currently no master? Become a robot servant by pressing the button below. You can add tasks and the robot will punish you when you fail to meet goals.
            </Text>
            <Button icon="content-save" color={Colors.green700} >Create</Button>
        </View>
    );
}