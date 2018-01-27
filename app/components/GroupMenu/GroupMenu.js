import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './groupmenu.scss';
import '../../svg/chevron.svg';
import '../../svg/trash.svg';
import '../../svg/add.svg';
import '../../svg/edit.svg';
import '../../svg/add-circle.svg';

export default class GroupMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGroupSettings: false
        }
        this.renderItem = this.renderItem.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.toggleGroupSettings = this.toggleGroupSettings.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentWillUpdate(newProps, newState) {
        if(newProps.editGroupMode) {
            setTimeout(()=>{
                this.groupInput.focus();
            },100);
        }
        if(newProps.editGroupKey !== null) {
            this.groupInput.value = this.props.groups[newProps.editGroupKey].name;
        }
    }

    handleKeyPress(e) {
        if(e.which === 13 && this.groupInput.value !== '') { //if return
            e.preventDefault()
            const value = e.target.value;
            if(this.props.editGroupKey === null) { 
                this.props.addGroup(value);
            } else {
                this.props.updateGroup(this.props.editGroupKey, {name: value});
            }
            this.clearField();
            this.props.toggleEditGroupMode();
        }
    }

    clearField() {
        if(this.groupInput.value.length > 0) {
            this.groupInput.value = '';
            this.groupInput.focus();
        }
    }

    clickHandler(e, key) {
        e.preventDefault();
        this.props.filterTasks(key);
    }

    renderItem(key) {
        const group = this.props.groups[key];
        const count = this.props.groupTasksCount(key);
        const dispCount = count ? ` (${count})` : '';
        const activeClass = key === this.props.currentGroup ? ' group-item__link group-item__link--current' : 'group-item__link';
        return(
            <li key={key} className="group-item">
                <a
                    className={activeClass} onClick={(e) => this.clickHandler(e, key)}>{group.name}{dispCount}</a>
            </li>
        )
    }

    submitGroup() {
        if(this.updateGroupKey !== null) {
            this.props.updateGroup(this.state.updateGroupKey, {name: this.groupInput.value});
        } else {
            this.props.addGroup(this.groupInput.value);
        }
    }

    renderSettingsItem(key) {
        const group = this.props.groups[key];
        return (
            <li key={key} className="list-item">
                <span className="list-item-label align-left">{group.name}</span>
                <div className="controls align-right">
                    <a className="controls-link controls-link--delete" onClick={(e) => e.preventDefault() || this.props.removeGroup(key)}>
                        <svg className="controls-link__icon">
                            <use xlinkHref="#trash"></use>
                        </svg>
                    </a>
                    <a className="controls-link controls-link----update" onClick={(e) => e.preventDefault() || this.props.toggleEditGroupMode(key)}>
                        <svg className="controls-link__icon">
                            <use xlinkHref="#edit"></use>
                        </svg>
                    </a>
                </div>
            </li>
        )
    }

    toggleGroupSettings() {
        const showGroupSettings = this.state.showGroupSettings === true ? false : true;
        this.setState( { showGroupSettings });
    }

    render() {
        return(
            <div className="group">
                <menu
                    className="group-menu"
                    data-active={this.props.addTaskMode}
                >
                    <div className="group-menu__mask">
                    <ul className="group-list">
                    {   
                        Object
                        .keys(this.props.groups)
                        .map((key) => this.renderItem(key) )
                    }
                    </ul>
                    </div>
                    <button type="button" className="button button--settings" onClick={this.toggleGroupSettings}>
                        <svg className="button__svg">
                            <use xlinkHref="#chevron"></use>
                        </svg>
                    </button>
                </menu>
                <div className="group-settings" data-active={this.state.showGroupSettings}>
                    <ul className="list">
                        {
                            Object
                            .keys(this.props.groups)
                            .map((key) => this.renderSettingsItem(key) )
                        }
                    </ul>
                    <p>
                        <a className="icon-link" onClick={(e) => e.preventDefault() || this.props.toggleEditGroupMode()}>
                            New Group
                            <svg className="icon-link__svg">
                                <use xlinkHref="#add-circle"></use>
                            </svg>
                        </a>
                    </p>
                    <form className="form-block form-block--with-cancel form-block--group" onSubmit={this.submitGroup} data-active={this.props.editGroupMode}>
                        <div className="form-block__input-wrap align-left">
                            <input
                                className="form-block__input"
                                type="text"
                                ref={this.setFocus}
                                ref={(input) => this.groupInput = input}
                                onKeyPress={this.handleKeyPress}
                                placeholder="+ add a new group"
                            />
                            <button className="button button--clear form-block__input-clear" onClick={(e) => e.preventDefault() || this.clearField()}>
                            Clear
                                <svg className="button__svg">
                                    <use xlinkHref="#close"></use>
                                </svg>
                            </button>
                        </div>
                        <a className="form-block__cancel align-right" onClick={(e) => e.preventDefault() || this.props.toggleEditGroupMode()}>Cancel</a>
                    </form>
                </div>
            </div>
        )
    }
}

GroupMenu.propTypes = {
    groups: PropTypes.object.isRequired,
    currentGroup: PropTypes.string.isRequired,
    filterTasks: PropTypes.func.isRequired,
    removeGroup: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    taskMode: PropTypes.bool.isRequired,
    groupTasksCount: PropTypes.func.isRequired,
    editGroupKey: PropTypes.string,
    editGroupMode: PropTypes.bool.isRequired,
    toggleEditGroupMode: PropTypes.func.isRequired
}