import React from 'react';
import Field from '../main/Field.js';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import enhanceWithClickOutside from 'react-click-outside';
import '../style/Calendar.less';

class _Calendar extends Field {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      month: new Date()
    };
  }

  componentDidMount() {
    this.onChange(this.props.value || 0);
    if(this.props.value){
      this.setState({
        inputValue: moment(this.props.value).format('L')
      }, () => this.onChange(moment(this.props.value).valueOf()));
    }
  }

  handleDayClick(e, day) {
    this.setState({
      inputValue: moment(day).format('L'),
      month: day,
      showPicker: false
    }, () => this.onChange(moment(day).valueOf()));
  }

  showPicker() {
    if(!this.props.disabled){
      this.setState({
        showPicker: true
      },this.showCurrentDate);
    }

  }

  showCurrentDate() {
    this.refs.daypicker.showMonth(this.state.month);
  }

  handleClickOutside() {
    if(this.state.showPicker === true){
      this.setState({
        showPicker: false
      });
    }
  }

  renderField(other) {
    const selectedDay = moment(this.state.inputValue, 'L', true).toDate();
    let picker = (this.state.showPicker) ?
      <div className="picker-container">
        <DayPicker
          locale={other.locale}
          localeUtils={ MomentLocaleUtils }
          ref='daypicker'
          initialMonth={ this.state.month }
          modifiers={{
            selected: day => DateUtils.isSameDay(selectedDay, day),
            disabled: DateUtils.isPastDay
          }}
          onDayClick={ this.handleDayClick.bind(this) }
        />
      </div>
      :
      null;
    return (
      <div className="relative">
        <div className="input-group">
          <input
            {...other}
            ref='input'
            type='text'
            value={ this.state.inputValue }
            placeholder='YYYY/MM/DD'
            onFocus={ this.showPicker.bind(this) }
          />
          <span className="icon-calendar pointer" onClick={ this.showPicker.bind(this) }></span>
        </div>
        {picker}
      </div>
    );
  }
}

export default enhanceWithClickOutside(_Calendar);