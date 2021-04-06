import React, {useEffect, useState, useRef} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';

import todayImg from '../../assets/imgs/today.jpg';

import Task from '../components/Task';
import commonStyles from '../commonStyles';
import {TextInput} from 'react-native-gesture-handler';

interface TaskProps {
  id: number;
  description: string;
  estimateAt: Date;
  doneAt?: Date | string;
}

export default function TaskList() {
  const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
  const [showDoneTasks, setShowDoneTasks] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<TaskProps[]>([
    {
      id: Math.random(),
      description: 'Ligar amor <3',
      estimateAt: moment().toDate(),
      doneAt: moment().toDate(),
    },
    {
      id: Math.random(),
      description: 'Lsfafa',
      estimateAt: moment().toDate(),
      doneAt: '',
    },
  ]);
  const [visibleTasks, setVisibleTasks] = useState<TaskProps[]>([]);
  const sheetRef = useRef(null);

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
  }, [showDoneTasks]);

  useEffect(() => {
    setBottomSheetVisible(0);
  }, []);

  const renderContent = () => (
    <View style={styles.sheetContainer}>
      <View style={styles.sheetHeader}>
        <View />
        <Text style={styles.sheetHeaderTitle}>NOVA TAREFA</Text>
        <Icon
          name="close"
          size={20}
          color="#000"
          onPress={() => {
            setBottomSheetVisible(0);
            setNewTask('');
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
          placeholder="Nova tarefa..."
          onFocus={() => setBottomSheetVisible(550)}
        />
        <TouchableOpacity
          style={styles.buttonSave}
          onPress={() => setBottomSheetVisible(500)}>
          <Icon
            name="save"
            size={20}
            color={commonStyles.colors.secundary}
            onPress={() => {
              setBottomSheetVisible(0);
              setNewTask('');
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        onPress={() => setBottomSheetVisible(500)}>
        <Icon name="plus" size={20} color={commonStyles.colors.secundary} />
      </TouchableOpacity>
      {bottomSheetVisible > 0 && (
        <KeyboardAvoidingView style={styles.modal}>
          <BottomSheet
            ref={sheetRef}
            snapPoints={[bottomSheetVisible, 300, 500]}
            borderRadius={10}
            renderContent={renderContent}
            onCloseEnd={() => {
              setTimeout(() => {
                setBottomSheetVisible(0);
              }, 1500);
            }}
          />
        </KeyboardAvoidingView>
      )}
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
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    height: 700,
    backgroundColor: commonStyles.colors.secundary,
    padding: 16,
  },
  sheetHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sheetHeaderTitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    height: 45,
    padding: 10,
    borderRadius: 8,
    fontFamily: commonStyles.fontFamily,
    width: '83%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSave: {
    backgroundColor: commonStyles.colors.today,
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
