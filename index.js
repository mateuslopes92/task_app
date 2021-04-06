/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import TaskList from './src/pages/TaskList';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TaskList);
