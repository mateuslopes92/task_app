import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import commonStyles from '../commonStyles';
import moment from 'moment';

interface AddTaskProps {
  onCancel(): void;
  onSave(newTask: string, date: Date): void;
  isVisible: boolean;
}

export default function AddTask({onCancel, onSave, isVisible}: AddTaskProps) {
  const [newTask, setNewTask] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: Event, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  useEffect(() => {
    setShow(Platform.OS === 'ios');
  }, []);

  const getDatePicker = () => {
    let dateTimePicker = (
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onChange}
        style={styles.datePicker}
      />
    );

    if (Platform.OS === 'android') {
      dateTimePicker = (
        <View>
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text style={styles.date}>
              {moment(date).format('ddd, D [de] MMMM [de] YYYY')}
            </Text>
          </TouchableOpacity>
          {show && dateTimePicker}
        </View>
      );
    }

    return dateTimePicker;
  };

  const handleSave = () => {
    onSave(newTask, date);
    setDate(new Date());
    setNewTask('');
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onCancel}
      animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Nova Tarefa</Text>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Nova tarefa..."
          style={styles.input}
        />
        {getDatePicker()}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={[styles.background, {flex: 0.7}]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 0.3,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: commonStyles.colors.secundary,
  },
  header: {
    fontSize: 18,
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secundary,
    textAlign: 'center',
    padding: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    height: 45,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 20,
  },
  buttonText: {
    color: commonStyles.colors.today,
    fontFamily: commonStyles.fontFamily,
    fontSize: 18,
    marginRight: 24,
  },
  datePicker: {
    height: Platform.OS === 'ios' ? 100 : 10,
    marginTop: 10,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 16,
  },
});
