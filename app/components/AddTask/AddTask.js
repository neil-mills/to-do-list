import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './addtask.scss';

export default class AddTask extends Component {
    constructor(props) {
        super(props);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.clearField = this.clearField.bind(this);
        this.cancelTask = this.cancelTask.bind(this);
    }

    componentWillUpdate(newProps, newState) {
        if(newProps.editTaskKey !== null) {
            this.taskInput.value = newProps.tasks[newProps.editTaskKey].title;
        }
        if(newProps.taskMode) {
            setTimeout(() => {
                this.taskInput.focus();
            },100);
        } else {
            this.taskInput.value='';
        }
    }

    handleKeyPress(e) {
        if(e.which === 13 && this.taskInput.value !== '') { //if return
            e.preventDefault()
            const value = e.target.value;
            if(this.props.editTaskKey === null) { 
                this.props.addTask(value);
            } else {
                this.props.updateTask(value);
            }
            this.clearField();
        }
    }

    handleFocus() {
        if(!this.props.taskMode) {
            this.props.toggleTaskMode();
        }
    }

    handleBlur(e) {
        if(this.taskInput.value.length === 0 && this.props.taskMode) {
            this.props.toggleTaskMode();
        }
    }

    cancelTask(e) {
        if(this.props.taskMode) {
            this.props.toggleTaskMode();
        }
    }

    clearField() {
        if(this.taskInput.value.length > 0) {
            this.taskInput.value = '';
            this.taskInput.focus();
        }
    }

    render() {
        return (
            <div className="form-block form-block--add-task form-block--with-cancel">
                <form className="form-block__input-wrap align-left">
                    <input
                        type="text"
                        className="task-input"
                        placeholder="+ add a new task"
                        onKeyPress={this.handleKeyPress}
                        onFocus={this.handleFocus}
                        ref={(input) => this.taskInput = input}  
                    />
                    <button type="button"
                        className="button button--clear input-clear"
                        onClick={this.clearField}>
                        Clear
                        <svg className="button__svg">
                            <use xlinkHref="#close"></use>
                        </svg>
                    </button>
                </form>
                <a
                    className="form-block__cancel align-right"
                    onClick={this.cancelTask}
                >
                    Cancel
                </a>
            </div>
        )
    }
}

AddTask.propTypes = {
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    taskMode: PropTypes.bool.isRequired,
    toggleTaskMode: PropTypes.func.isRequired,
    editTaskKey: PropTypes.string,
    tasks: PropTypes.object
}