/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFAW5 from 'react-native-vector-icons/FontAwesome5';
import {Avatar} from 'react-native-elements';

export default function UserForm({setUser, navigation}) {
  const [userRole, setUserRole] = useState();
  const [defaultStyle, setDefaultStyle] = useState(true);
  const [userName, setuserName] = useState('');
  const [userDOB, setuserDOB] = useState();
  const [userAbout, setuserAbout] = useState();
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(auth().currentUser.email)
      .get()
      .then(doc => {
        setuserAbout(doc.data().about);
        setUserRole(doc.data().role);
        doc.data().role === 'user' ? setDefaultStyle(!defaultStyle) : null;
        let DAT = new Date((7200 + doc.data().dob.seconds) * 1000);
        /*//times go by sec GMT, so in order to get the right date, need to add 2 hours and mult by 1000 in nanosec*/
        setuserDOB(DAT.toDateString());
        setuserName(doc.data().name);
      })
      .catch(() => {});
    return subscriber;
  }, [setuserAbout, setUserRole, setDefaultStyle, setuserName, setuserDOB]);

  return (
    <View style={styles.main}>
      <View style={styles.backline} />
      <Avatar
        size="xlarge"
        rounded
        source={{
          uri:
            'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg',
        }}
        containerStyle={{alignSelf: 'center', borderWidth: 2}}
      />
      <View style={styles.row}>
        <Text style={styles.name}>{userName}</Text>
        <TouchableOpacity
          onPress={() => {
            console.log('editing user name of ' + userName);
          }}>
          <IconFAW5
            name={'edit'}
            color={'#000000'}
            size={18}
            style={{margin: 5}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text>Date of Birth:</Text>
        <Text style={{fontSize: 18, margin: 5}}>{userDOB}</Text>
      </View>
      <View style={{padding: 20}}>
        <Text style={{fontWeight: 'bold', fontSize: 21}}>About Me:</Text>
        <Text style={{fontSize: 17}}>{userAbout}</Text>
      </View>

      {/*the following view contain the logout / manage users buttons*/}
      <View style={styles.chose}>
        {userRole && userRole == 'admin' ? (
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Manage Users')}>
            <Text style={{color: '#000000', fontSize: 20}}>Manage Users</Text>
            <IconFAW5 name={'user-cog'} color={'#666666'} size={20} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={defaultStyle ? styles.option : styles.userOption}
          onPress={() =>
            auth()
              .signOut()
              .then(() => setUser(auth().currentUser))
          }>
          <Text style={{color: '#ff0000', fontSize: 20}}>Log Out</Text>
          <IconFeather name={'log-out'} color={'#ff0000'} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgb(200,200,220)',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  name: {
    fontSize: 34,
    fontWeight: 'bold',
    margin: 5,
  },
  chose: {
    alignItems: 'flex-end',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  option: {
    width: '50%',
    backgroundColor: 'rgb(240,240,255)',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
  },
  userOption: {
    width: '100%',
    backgroundColor: 'rgb(240,240,255)',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
  },
  backline: {
    backgroundColor: 'rgb(160,160,200)',
    height: Dimensions.get('screen').height / 10,
    marginBottom: -Dimensions.get('screen').height / 15,
  },
});
