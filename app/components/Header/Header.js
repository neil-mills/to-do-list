import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import AddTask from '../AddTask/AddTask';
import DateSelect from '../DateSelect/DateSelect'; 
import './header.scss';
import '../../svg/search.svg';
import '../../svg/close.svg';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.onTaskSubmit = this.onTaskSubmit.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.focusInput = this.focusInput.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.clearField = this.clearField.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }

    componentDidUpdate() {
        if(this.props.searchMode) {
            this.searchInput.focus();
        }
    }
    
    clearField() {
        if(this.searchInput.value.length > 0) {
            setTimeout(()=>{
                this.searchInput.value = '';
                this.searchInput.focus();
            },100)
        }
    }  

    onTaskSubmit(e) {
        e.preventDefault();
        if(e.keyCode === 13) { //if return
            const value = e.target.value;
            if(value.length > 0) {

                this.props.addTask(value);
            }
        }
    }

    getDate() {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date();
        const day = date.getDay();
        const month = date.getMonth();
        const dayOfMonth = date.getDate();
        return { day: daysOfWeek[day], month: monthNames[month], date: dayOfMonth};
    }

    handleKeyUp(e) {
        const value = e.target.value;
        e.preventDefault()
        this.props.getSearchResults(value);
    }

    onSearchSubmit(e) {
         if(e.which === 13) { //if return
            console.log('submit')
            e.preventDefault()
            const value = e.target.value;
            /*
            if(value.length > 0) {
                this.props.searchTasks(query);
            }
            */
        }

    }

    focusInput(component) {
        console.log(component)
       
    }

    handleSearchClick(e) {
        if(!this.props.searchMode) {
            this.clearField();
            this.props.toggleSearch(e)
        }
    }

    render() {
        const { day, month, date } = this.getDate();
        
        return (
            <header className="header">
                <div className="form-block form-block--with-cancel form-block--search" data-active={this.props.searchMode}>
                    <form className="form-block__input-wrap align-left" onSubmit={(e) => this.onSearchSubmit(e)}>
                        <svg className="form-block__input-icon">
                            <use xlinkHref="#search"></use>
                        </svg>
                        <input 
                            type="text"
                            name="search"
                            className="form-block__input form-block__input--with-icon"
                            placeholder="Search"
                            ref={(input) => this.searchInput = input }
                            onKeyUp={this.handleKeyUp}
                        />
                        <button className="button button--clear form-block__input-clear" onClick={(e) => e.preventDefault() || this.props.toggleTaskMode}>
                            Clear
                            <svg className="button__svg">
                                <use xlinkHref="#close"></use>
                            </svg>
                        </button>
                    </form>
                    <a
                        className="form-block__cancel align-right"
                        onClick={(e) => this.props.toggleSearch(e)}
                    >
                        Cancel
                    </a>
                </div>
                <div className="header__top">
                    <div className="date">
                        <span className="date__day">{day.toUpperCase()}</span>
                        <span className="date__month"> {month}</span>
                        <span className="date__date"> {date}</span>
                    </div>
                    <button
                        className="button button--search"
                        onClick={this.handleSearchClick}>
                        <svg className="button__svg">
                            <use xlinkHref="#search"></use>
                        </svg>
                        Search
                    </button>
                </div>
                <div className="header__bottom">
                    <AddTask
                        addTask={this.props.addTask}
                        updateTask={this.props.updateTask}
                        toggleTaskMode={this.props.toggleTaskMode}
                        taskMode={this.props.taskMode}
                        editTaskKey={this.props.editTaskKey}
                        tasks={this.props.tasks}
                    />
                    <DateSelect
                        currentDate={this.props.currentDate}
                        setCurrentDate={this.props.setCurrentDate}
                        taskMode={this.props.taskMode}
                        getDate={this.getDate}
                    />
                </div>
            </header>

        );
    }
}

Header.propTypes = {
    addTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    toggleTaskMode: PropTypes.func.isRequired,
    currentDate: PropTypes.object,
    taskMode: PropTypes.bool.isRequired,
    editTaskKey: PropTypes.string,
    tasks: PropTypes.object,
    getSearchResults: PropTypes.func.isRequired,
    searchMode: PropTypes.bool.isRequired,
    toggleSearch: PropTypes.func.isRequired
}