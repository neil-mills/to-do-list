import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import './dateselect.scss';
import '../../svg/calendar.svg';

export default class DateSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDatePicker: false
        }
        this.updateDate = this.updateDate.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
        this.toggleDatePicker = this.toggleDatePicker.bind(this);
    }

    getDates() {
        const today = moment(new Date())
        const tomorrow = moment(new Date()).add(1, 'days');
        return { today, tomorrow };
    }

    updateDate(e, date) {
        e.preventDefault();
        console.log('update date',date);
        this.props.setCurrentDate(date);
    }

    handleDatePickerChange(date) {
        this.props.setCurrentDate(date);
    }

    toggleDatePicker(e) {
        e.preventDefault();
        const showDatePicker = this.state.showDatePicker === true ? false : true;
        this.setState( { showDatePicker })
    }

    render() {
        const { today, tomorrow } = this.getDates(); // moment objects
        return(
            <div className="date-select" data-active={this.props.taskMode}>
                <menu className="date-menu">
                    <ul className="date-menu__list">
                        <li className="date-menu__item">
                            <a className="date-menu__link date-menu__link--calendar" onClick={(e) => this.toggleDatePicker(e)}>
                                <svg className="date-menu__icon">
                                    <use xlinkHref="#calendar"></use>
                                </svg>
                            </a>
                        </li>
                        <li className="date-menu__item">
                            <a
                                className="date-menu__link"
                                onClick={(e) => this.updateDate(e, today) }
                                data-active={ (this.props.currentDate !== null && this.props.currentDate.format('MM-DD-YYYY') === today.format('MM-DD-YYYY')) ? 'true' : 'false'}
                            >
                                Today
                            </a>
                        </li>
                        <li className="date-menu__item">
                            <a
                                className="date-menu__link"
                                onClick={(e) => this.updateDate(e, tomorrow) }
                                data-active={ (this.props.currentDate !== null && this.props.currentDate.format('MM-DD-YYYY') === tomorrow.format('MM-DD-YYYY')) ? 'true' : 'false'}
                            >
                                Tomorrow
                            </a>
                        </li>
                        <li className="date-menu__item">
                            <a
                                className="date-menu__link date-menu__link"
                                onClick={(e) => this.updateDate(e, null) }
                                data-active={ this.props.currentDate === null ? 'true' : 'false'}
                            >
                                None
                            </a>
                        </li>
                    </ul>
                </menu>
                <div className="date-picker" data-active={this.state.showDatePicker}>
                    <DatePicker onChange={ this.handleDatePickerChange } />
                </div>
            </div>
        )
    }
}

DateSelect.propTypes = {
    setCurrentDate: PropTypes.func.isRequired,
    currentDate: PropTypes.object,
    getDate: PropTypes.func.isRequired
}
