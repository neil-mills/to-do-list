import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './tasklist.scss';
import moment from 'moment';

export default class TaskList extends Component {
    constructor(props){
        super(props);
        this.renderTask = this.renderTask.bind(this);
    }

    toggleTaskStatus(e, key) {
        e.preventDefault();
        const task = this.props.tasks[key];
        const status = task.status === 'incomplete' ? 'complete' : 'incomplete';
        task.status = status;
        this.props.updateTask(key, task);
    }

    updateTaskHandler(e, key) {
        e.preventDefault();
        this.props.populateTask(key);
    }

    deleteTaskHandler(e, key) {
        e.preventDefault();
        this.props.deleteTask(key);
    }

    renderTask(key) {
        const task = this.props.tasks[key];
        const attr = task.status === 'complete' ? 'true' : 'false';
        let date = '\u00A0'; //&nbsp;
        if(task.date !== null) {
            date = JSON.parse(task.date);
            date = moment(date, "YYYY-MM-DDTHH:MM:SS.SSS").format('DD.MM');
        }
        return (
            <li key={key} className="list-item" data-complete={attr}>
                <a className="list-item-label align-left" onClick={(e) => e.preventDefault() || this.props.toggleTaskStatus(key)}>
                    <span className="list-item-label__date">{date}</span>
                    <span className="list-item-label__text">{task.title}</span>
                </a>
                <div className="controls align-right">
                    <a className="controls-link controls-link--delete" onClick={(e) => e.preventDefault() || this.props.removeTask(key)}>
                        <svg className="controls-link__icon">
                            <use xlinkHref="#trash"></use>
                        </svg>
                    </a>
                    <a className="controls-link controls-link----update" onClick={(e) => e.preventDefault() || this.props.populateTaskToEdit(key) }>
                        <svg className="controls-link__icon">
                            <use xlinkHref="#edit"></use>
                        </svg>
                    </a>
                </div>
            </li>
        )
    }

    render() {
        return (
            <menu className="tasks">
                <ul className="list">
                    {
                      Object
                      .keys(this.props.tasks)
                      .map((key) => this.renderTask(key))
                    }
                </ul>
            </menu>
        )
    }
}

TaskList.propTypes = {
    removeTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired,
    toggleTaskStatus: PropTypes.func.isRequired
}