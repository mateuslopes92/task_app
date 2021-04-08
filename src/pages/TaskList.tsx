import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import todayImg from '../../assets/imgs/today.jpg';

import Task from '../components/Task';
import AddTask from '../components/AddTask';
import commonStyles from '../commonStyles';

interface TaskProps {
  id: number;
  description: string;
  estimateAt: Date;
  doneAt?: Date | string;
}

export default function TaskList() {
  const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
  const [showDoneTasks, setShowDoneTasks] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [visibleTasks, setVisibleTasks] = useState<TaskProps[]>([]);

  const onSave = (newTask: string, date: Date) => {
    if (!newTask || !newTask.trim()) {
      // eslint-disable-next-line no-alert
      alert('Dados invalidos', 'Informe a descricao!');

      return;
    } else {
      const newTasks = [
        ...tasks,
        {
          id: Math.random(),
          description: newTask,
          estimateAt: date,
          doneAt: '',
        },
      ];

      setTasks(newTasks);
      setShowDoneTasks(true);
      filterTasks();
      setIsModalVisible(false);

      console.log(newTasks);
    }
  };

  const toggleTask = (taskId: number) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    const taskToUpdateIndex = tasks.findIndex(t => t.id === taskId);

    if (taskToUpdate) {
      taskToUpdate.doneAt = taskToUpdate?.doneAt === '' ? new Date() : '';
      console.log(taskToUpdate);
      tasks.splice(taskToUpdateIndex, 1);
      const newTasks = [taskToUpdate, ...tasks];
      setTasks(newTasks);
      setVisibleTasks(newTasks);
    }
  };

  const toggleFilter = () => {
    setShowDoneTasks(!showDoneTasks);
  };

  const filterTasks = () => {
    if (showDoneTasks) {
      const pending = tasks.filter(t => t.doneAt === '');
      setVisibleTasks(pending);
    } else {
      setVisibleTasks(tasks);
    }
  };

  useEffect(() => {
    filterTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDoneTasks]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' && commonStyles.colors.today}
      />
      <AddTask
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={onSave}
      />
      <ImageBackground source={todayImg} style={styles.background}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => toggleFilter()}>
            <Icon
              name={showDoneTasks ? 'eye' : 'eye-slash'}
              size={20}
              color={commonStyles.colors.secundary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subtitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <FlatList
          style={{flex: 1}}
          data={visibleTasks}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => {
            return (
              <Task
                id={item.id}
                description={item.description}
                estimateAt={item.estimateAt}
                doneAt={item.doneAt}
                toggleTask={toggleTask}
              />
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}>
        <Icon name="plus" size={20} color={commonStyles.colors.secundary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  background: {
    flexGrow: 2,
  },
  taskList: {
    flexGrow: 8,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secundary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.secundary,
  },
  iconBar: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    justifyContent: 'flex-end',
    marginRight: 20,
    paddingVertical: 40,
  },
  buttonAdd: {
    backgroundColor: commonStyles.colors.today,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
});
function alert(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}
