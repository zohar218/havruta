import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon2 from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';

/**A component that renders a signle chat in the chat screen.
 * displays the name of the chat, the last messeage sent in the chat and a picture that the chat creator chose */
function ChatItem({ id, item }) {
    const chat_name = item.data ? item.data.name : 'untitled';
    const [lastMessage, setlastMessage] = useState('Loading...');
    const [lastSenderName, setLastSenderName] = useState('');

    /**this useEffect triger firestore call to get the name of the user who send the last message in the chat. */
    useEffect(() => {
        let last_m;
        last_m = item.data.messages[item.data.messages.length - 1]
        if (last_m) {
            firestore().collection('users').doc(last_m.user._id).get()
                .then(doc => {
                    setLastSenderName(last_m.user.name);
                    if (last_m.text.length > 20) {
                        setlastMessage(last_m.text.substring(0, 20).concat("..."));
                    } else {
                        setlastMessage(last_m.text);
                    }
                })
                .catch(err => {
                    setLastSenderName('Error');
                    setlastMessage('Cannot Load Meassage');
                    console.log('Last message not loaded: ', err)
                })
        } else {
            setLastSenderName('');
            setlastMessage('');

        }
    }, [setLastSenderName, setlastMessage])

    return (
        <View style={styles.main} >
            <Image style={styles.image} source={item.data.imageUrl ? { uri: item.data.imageUrl } : require('../../Assets/logo.png')} />
            <View style={{ width: '70%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 17, textAlign: 'right' }}>{chat_name}</Text>
                <View style={{ flexDirection: 'row-reverse', paddingBottom: 5, paddingTop: 5, marginTop: 5 }}>
                    <Text style={{ color: '#333', textAlignVertical: 'bottom', textAlign: 'right' }} >{lastSenderName}</Text>
                    <Text style={{ color: '#333', textAlignVertical: 'bottom', textAlign: 'right' }}> :</Text>
                    <Text style={{ color: '#666', textAlignVertical: 'bottom', textAlign: 'right' }}>{lastMessage}</Text>
                </View>
            </View>
            <Icon2
                name={'left'}
                size={20}
                color={'gray'}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#cfcfcf',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    image: {
        backgroundColor: '#fff',
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#aaa'
    }
});
export default ChatItem;