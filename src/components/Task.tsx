import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';

import commonStyles from '../commonStyles';

interface TaskProps {
  id: number;
  description: string;
  estimateAt: Date;
  doneAt: Date | string;
  toggleTask(taskId: number): void;
}

export default function Task({
  id,
  description,
  estimateAt,
  doneAt,
  toggleTask,
}: TaskProps) {
  const doneOrNotStyle = doneAt
    ? {textDecorationLine: 'line-through'}
    : {textDecorationLine: 'none'};

  const getCheckView = (doneDate: Date) => {
    if (doneDate) {
      return (
        <View style={styles.done}>
          <Icon name="check" size={20} color={commonStyles.colors.secundary} />
        </View>
      );
    } else {
      return <View style={styles.pending} />;
    }
  };

  const getDate = () => {
    const date = doneAt !== '' ? doneAt : estimateAt;
    return moment(date).locale('pt-br').format('ddd, D [de] MMMM');
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => toggleTask(id)}>
        <View style={styles.checkContainer}>{getCheckView(doneAt)}</View>
      </TouchableWithoutFeedback>
      <View>
        <Text
          style={{
            ...styles.descritpion,
            textDecorationLine: doneOrNotStyle.textDecorationLine,
          }}>
          {description}
        </Text>
        <Text style={styles.date}>{getDate()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descritpion: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontWeight: 'bold',
    fontSize: 15,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 12,
  },
});
