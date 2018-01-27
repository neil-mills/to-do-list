import React, { Component } from 'react';
import DefaultGroups  from '../../utils/groups.js';
import DefaultTasks from '../../utils/tasks.js';
import Header from '../Header/Header';
import GroupMenu from '../GroupMenu/GroupMenu';
import TaskList from '../TaskList/TaskList';
import './app.scss';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: {},
            tasks: {},
            currentDate: null,
            currentGroup: 'all', 
            taskMode: false,
            editTaskKey: null,
            filteredTasks: {},
            editGroupMode: false,
            editGroupKey: null
        }
        this.addTask = this.addTask.bind(this);
        this.toggleTaskMode = this.toggleTaskMode.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.searchTasks = this.searchTasks.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.updateGroup = this.updateGroup.bind(this);
        this.setCurrentDate = this.setCurrentDate.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.toggleTaskStatus = this.toggleTaskStatus.bind(this);
        this.groupTasksCount = this.groupTasksCount.bind(this);
        this.populateTaskToEdit = this.populateTaskToEdit.bind(this);
        this.toggleEditGroupMode = this.toggleEditGroupMode.bind(this);
    }

    componentDidMount() {
        const localStorageTasks = localStorage.getItem('tasks');
        const localStorageGroups = localStorage.getItem('groups')
        if(localStorageTasks) {
            this.setState({
                tasks: JSON.parse(localStorageTasks),
                filteredTasks: JSON.parse(localStorageTasks),
                groups: JSON.parse(localStorageGroups)
            })
        } else {
            this.setState({
                groups: DefaultGroups,
                tasks: DefaultTasks,
                filteredTasks: DefaultTasks
            })
        }
    }

    componentWillUpdate(nextProps, nextState) {
        //runs when props or state update
        localStorage.setItem('tasks', JSON.stringify(nextState.tasks));
        localStorage.setItem('groups', JSON.stringify(nextState.groups))
    }

    getTimestamp() {
        return Date.now();
    }

    addTask(task) {
        const tasks = {...this.state.tasks}
        const timestamp = this.getTimestamp();
        tasks[`task-${timestamp}`] = {
            date: JSON.stringify(this.state.currentDate),
            group: this.state.currentGroup,
            title: task,
            status: 'incomplete'
        };
        this.state.tasks = tasks; //update the state without a re-render
        this.filterTasks(this.state.currentGroup);  
    }

    toggleTaskStatus(key) {
        const tasks = {
            ...this.state.tasks
        }
        const status = tasks[key].status === 'incomplete' ? 'complete' : 'incomplete';
        tasks[key].status = status;
        this.setState({ tasks });
    }

    filterTasks(key) {
        let filteredTasks = {};
        if(key === 'all') {
            filteredTasks = this.state.tasks;
        } else {
            Object
            .keys(this.state.tasks)
            .map((taskKey) => {
                const task = this.state.tasks[taskKey];
                if(task.group === key) {
                    filteredTasks[taskKey] = task
                }
            })
        }
        this.setState({
            filteredTasks,
            currentGroup: key
        })
    }

    removeTask(key) {
        const tasks = {...this.state.tasks};
        if(tasks[key]) {
            delete tasks[key];
            this.state.tasks = tasks;
            this.filterTasks(this.state.currentGroup);
        }
    }

    updateTask(title) {
        const tasks = {...this.state.tasks}
        tasks[this.state.editTaskKey].title = title;
        tasks[this.state.editTaskKey].group = this.state.currentGroup;
        tasks[this.state.editTaskKey].date = JSON.stringify(this.state.currentDate),
        this.state.tasks = tasks;
        this.filterTasks(this.state.currentGroup);
        this.toggleTaskMode();
    }

    populateTaskToEdit(key) {
       this.setState({
                editTaskKey: key,
                taskMode: true
        });   
    }

    searchTasks(query) {
        //get tasks matching query
        const matchingTasks = this.state.tasks.map((task) => task.title.indexOf(query) !== -1);
        return matchingTasks;
    }

    addGroup(group) {
        const groups = {...this.state.groups};
        const timestamp = this.getTimestamp();
        groups[`group-${timestamp}`] = {name: group};
        this.setState({ groups });
    }

    setCurrentDate(date) {
        this.setState({ currentDate: date })
    }

    removeGroup(key) {
        const groups = {...this.state.groups}
        if(groups[key]) {
            delete groups[key];
        }
        this.setState({ groups })
    }

    updateGroup(key, group) {
        const groups = {...this.state.groups, [key]: group}
        this.setState({ groups });
    }

    toggleTaskMode() {
        const taskMode = this.state.taskMode ? false : true;
        this.setState( { 
            taskMode,
            editTaskKey: null
        });
    }

    groupTasksCount(groupKey) {
        let count=0;
        if(groupKey !== 'all') {
            Object
            .keys(this.state.tasks)
            .map((key) => {
                const task = this.state.tasks[key];
                if(task.group === groupKey) count++;
            });
        } else {
            count = Object.keys(this.state.tasks).length;
        }
        return count;
    }

    handleClick(e) {
        e.preventDefault();
        if(!this.state.taskMode) {
            this.toggleTaskMode();
        }
    }

    toggleEditGroupMode(key=null) {
        const editGroupKey = key === null ? null : key;
        let editGroupMode;
        if(key === null) {
            editGroupMode = this.state.editGroupMode ? false : true;
        }
        if(key && this.state.editGroupMode === false) {
            editGroupMode = true;
        }
        console.log('mode',editGroupMode,'key',editGroupKey)
        this.setState( { 
            editGroupMode,
            editGroupKey
        });
    }

    render() {
        const { currentGroup, tasks } = this.state;
        return(
            <div>
                <Header
                    addTask={this.addTask}
                    updateTask={this.updateTask}
                    searchTasks={this.searchTasks}
                    toggleTaskMode={this.toggleTaskMode}
                    currentDate={this.state.currentDate}
                    setCurrentDate={this.setCurrentDate}
                    taskMode={this.state.taskMode}
                    editTaskKey={this.state.editTaskKey}
                    tasks={this.state.tasks}
                />
                <GroupMenu
                    groups={this.state.groups}
                    currentGroup={this.state.currentGroup}
                    filterTasks={this.filterTasks}
                    removeGroup={this.removeGroup}
                    updateGroup={this.updateGroup}
                    addGroup={this.addGroup}
                    taskMode={this.state.taskMode}
                    groupTasksCount={this.groupTasksCount}
                    editGroupMode={this.state.editGroupMode}
                    editGroupKey={this.state.editGroupKey}
                    toggleEditGroupMode={this.toggleEditGroupMode}
                />
                <TaskList
                    removeTask={this.removeTask}
                    updateTask={this.updateTask}
                    tasks={this.state.filteredTasks}
                    toggleTaskStatus={this.toggleTaskStatus}
                    populateTaskToEdit={this.populateTaskToEdit}

                />
                <button
                    type="button"
                    className="button button--add-task"
                    data-hide={this.state.taskMode}
                    onClick={this.handleClick}>
                        <svg className="button__svg">
                            <use xlinkHref="#add"></use>
                        </svg>
                </button>
            </div>
        )
    }
}