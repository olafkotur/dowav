import React from 'react';
import { Text, ScrollView, View, StyleSheet } from 'react-native';

import useFetch from '../hooks/useFetch';
import { Tweet } from '../types';
import ErrorMessage from './ErrorMessage';
import Loader from './Loader';
import { parseDate } from '../App';
import theme from '../theme';

const TWEET_ENDPOINT = 'https://dowav-api.herokuapp.com/api/tweets';

const mapDataToTweets = (data: Tweet[]) => {
  return data.map((tweet, i) => {
    const createdDate = new Date(tweet.created_at);
    const text = tweet.text.split(' ').map((word, i) => (
      <Text
        style={word.startsWith('#') ? styles.highlight : {}}
        key={i}
      >{word} </Text>
    ));

    return (
      <View
        style={styles.tweetContainer}
        key={i}
      >
        <Text style={styles.tweetText}>{text}</Text>
        <Text style={styles.tweetDate}>{parseDate(createdDate)}</Text>
      </View>
    );
  });
}

const TwitterFeed = () => {
  let [ data, error, pending ] = useFetch<Tweet[]>(TWEET_ENDPOINT);

  if (pending) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage dataType="tweet" />;
  }

  if (data) {
    if (data.length) {
      return (
        <>
          <Text style={styles.title}>Last 20 tweets from <Text style={{ fontWeight: 'bold' }}>@dowav1</Text></Text>
          <ScrollView style={styles.container}>
            {mapDataToTweets(data)}
          </ScrollView>
        </>
      );
    } else {
      return <ErrorMessage dataType="tweet" />;
    }
  }

  return <ErrorMessage dataType="tweet" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  highlight: {
    color: theme.accentColor,
  },
  tweetContainer: {
    borderColor: 'white',
    borderWidth: 3,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 20,
  },
  tweetDate: {
    fontSize: 18,
    color: 'white',
    textAlign: 'right',
  },
  tweetText: {
    fontSize: 16,
    color: 'white',
  },
});

export default TwitterFeed;
