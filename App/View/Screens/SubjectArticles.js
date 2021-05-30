/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Dimensions, Text, StyleSheet, View, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PostInFeed from './PostInFeed';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function SubjectArticles({ navigation, route }) {
  const [fullArticles, setFullArticles] = useState({ articles: [], temp: [], recevied: 0 });

  function articlesUpdater(art, index, length) {
    fullArticles.temp[index] = art;
    fullArticles.recevied++;
    if (fullArticles.recevied == length) {
      setFullArticles({ articles: fullArticles.temp, recevied: length });
    }
  }


  useEffect(() => {

    let articles_wp = [{
      "id": "arti1",
      "headline": "Daimonds in the sky",
      "autor": "Zohar",
      "date": "1/1/1001",
      "contant": "Shine bright like a diamond. Shine bright like a diamond. Find light in the beautiful sea. I choose to be happy, You and I, you and I, We're like diamonds in the sky, You're a shooting star I see, A vision of ecstasy, When you hold me, I'm alive",
      "contant-short": "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    }, {
      "id": "arti2",
      "headline": "זה מגן מטילים וגם ממרגמות",
      "autor": "Daniel Ohayon",
      "date": "6/6/2021",
      "contant": "לך עליה עליה בבוקר, למה לא למה לא, אם רצית בה לגעת כמו חלום, למה לא, אם הצעת לה טבעת יהלום, למה לא, אם ניסית והצלחת, למה לא למה לא, למה לא למה לא",
      "contant-short": "bla"
    }, {
      "id": "arti3",
      "headline": "This is America",
      "autor": "Rihanna",
      "date": "21/12/2012",
      "contant": "Shine bright like a diamond. Shine bright like a diamond. Find light in the beautiful sea. I choose to be happy, You and I, you and I, We're like diamonds in the sky, You're a shooting star I see, A vision of ecstasy, When you hold me, I'm alive",
      "contant-short": "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    },
    ]

    articles_wp.forEach((val, i, arr) => {
      firestore()
        .collection('article')
        .doc(val.id)
        .get()
        .then(doc => {
          let art = { ...val, likes: doc.data().likes, comments: doc.data().comments, art_id: val.id }
          articlesUpdater(art, i, arr.length)
        })
        .catch(err => {
          console.log('error:', err.code);
        });
    })

  }, [])


  return (
    <View style={styles.main}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(120,90,140)' }} />
      <SafeAreaView style={styles.main}>
        <View style={styles.header}>
          <View
            style={[styles.register, { backgroundColor: 'rgba(0,0,0,0)' }]}></View>
          <Text style={styles.screen_title}>Havruta</Text>
          <View
            style={[styles.register, { backgroundColor: 'rgba(0,0,0,0)' }]}></View>
        </View>
        {
          fullArticles.articles.length == 0 ?
            <ActivityIndicator style={{ marginTop: '30%' }} size={'large'} color={'#000'} />
            :
            <FlatList
              data={fullArticles.articles}
              renderItem={({ item }) => (
                <PostInFeed
                  onPress={() => navigation.navigate('ArticleScreen', { data: item })}
                  data={item}
                  onPressLike={() => {
                    if (auth().currentUser) {
                      // firestore().collection('article').doc(item.art_id)
                      // .update({'likes'})
                    }
                  }}
                />
              )}
              keyExtractor={(item, idx) => idx}
            />
        }
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0,127,255)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
  },
  header: {
    width: '100%',
    height: Dimensions.get('screen').height / 10,
    backgroundColor: 'rgb(120,90,140)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#999',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },

  screen_title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(255,255,255)',
  },

  register: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SubjectArticles;
