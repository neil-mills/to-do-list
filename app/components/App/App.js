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
            editGroupKey: null,
            searchMode: false
        }
        this.addTask = this.addTask.bind(this);
        this.toggleTaskMode = this.toggleTaskMode.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.updateGroup = this.updateGroup.bind(this);
        this.setCurrentDate = this.setCurrentDate.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.toggleTaskStatus = this.toggleTaskStatus.bind(this);
        this.groupTasksCount = this.groupTasksCount.bind(this);
        this.populateTaskToEdit = this.populateTaskToEdit.bind(this);
        this.toggleEditGroupMode = this.toggleEditGroupMode.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
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

    getSearchResults(value) {
        let filteredTasks = {}
        if(value.length > 0) {
            Object
            .keys(this.state.tasks)
            .map((key) => {
                const task = this.state.tasks[key];
                if (task.title.includes(value)) {
                    filteredTasks[key] = task;
                }
            })
        } else {
            filteredTasks = {...this.state.tasks}
        }
        this.setState({ filteredTasks });
    }

    getTimestamp() {
        return Date.now();
    }

    addTask(task) {
        const tasks = {...this.state.tasks}
        const timestamp = this.getTimestamp();
        const date = this.state.currentDate !== null ? JSON.stringify(this.state.currentDate) : null;
        tasks[`task-${timestamp}`] = {
            date,
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
        const currentDate = this.state.currentDate !== null ? JSON.stringify(this.state.currentDate) : null;
        tasks[this.state.editTaskKey].date = currentDate;
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
        this.setState( { 
            editGroupMode,
            editGroupKey
        });
    }

    toggleSearch(e) {
        e.preventDefault
        const searchMode = this.state.searchMode === true ? false : true;
        if(!searchMode) {
            this.setState({
                searchMode,
                filteredTasks: this.state.tasks
             });
        } else {
            this.setState({ searchMode });
        }
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
                    getSearchResults={this.getSearchResults}
                    searchMode={this.state.searchMode}
                    toggleSearch={this.toggleSearch}
                />
                { !this.state.searchMode &&
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
                }
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