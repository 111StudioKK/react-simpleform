import React from 'react';
import TagsInput from 'react-tagsinput';
import {Radio, Checkbox} from 'react-icheck';
import _Select from 'react-select';
import moment from 'moment';
import JSONTree from 'react-json-tree';
import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import enhanceWithClickOutside from 'react-click-outside';

export class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      submiting: false,
      data: {},
      submitFailures: 0,
      debug:  window.sessionStorage.getItem('debug') || false
    };
  }

  static childContextTypes = {
    onChange: React.PropTypes.func,
    submitFailures: React.PropTypes.number
  }

  validateSchema(field, value, reseting = false) {
    return new Promise((resolve) => {
      let newData = this.state.data;
      newData[field] = value;
      this.setState({
        data: newData
      }, () => {
        this.props.schema
        .validate(this.state.data)
        .then(() => {
          this.setState({
            validated: true
          });
          resolve(false);
        })
        .catch((errors) => {
          this.setState({
            validated: false
          });
          let currentFieldErrored = (errors.inner.filter((err) => field === err.path).length === 1);
          resolve(!reseting && currentFieldErrored);
        });
      });
    });
  }

  onSubmit(evt) {
    evt.preventDefault();
    if(this.state.validated){
      this.props.onSubmit(this.state.data);
    }
    else{
      this.setState({
        submitFailures: ++this.state.submitFailures
      });
    }
  }

  onChange() {
    if(this.props.onChange){
      this.props.onChange(this.state);
    }
  }

  _debugToggle(e) {
    e.preventDefault();
    this.setState({
      debug: !this.state.debug
    }, () => window.sessionStorage.setItem('debug', this.state.debug) );
  }

  _displayDebug() {
    let _switch = {
      marginTop: 15,
      cursor: 'pointer',
      display: 'inline-block'
    };
    let theme = {
      scheme: 'ocean',
      author: 'chris kempson (http://chriskempson.com)',
      base00: '#2b303b',
      base01: '#343d46',
      base02: '#4f5b66',
      base03: '#65737e',
      base04: '#a7adba',
      base05: '#c0c5ce',
      base06: '#dfe1e8',
      base07: '#eff1f5',
      base08: '#bf616a',
      base09: '#d08770',
      base0A: '#ebcb8b',
      base0B: '#a3be8c',
      base0C: '#96b5b4',
      base0D: '#8fa1b3',
      base0E: '#b48ead',
      base0F: '#ab7967'
    };

    let _debug = (this.state.debug) ?
      <div>
        <span style={_switch} onClick={ this._debugToggle.bind(this) }>Debug [-]</span>
        <div style={ {backgroundColor: theme.base00} }>
          <JSONTree data={ this.state } />
        </div>
      </div>
      : <span style={_switch} onClick={ this._debugToggle.bind(this) }>Debug [+]</span>;
    return (
      <div>
        {_debug}
      </div>
    );
  }
  getChildContext() {
    return {onChange: this.validateSchema.bind(this), submitFailures: this.state.submitFailures};
  }
  
  render() {
    let {onSubmit, ...other} = this.props;
    let debug = (__DEV__) ?
      this._displayDebug()
      : null;
    return (
      <form {...other} onSubmit={this.onSubmit.bind(this)} onChange={this.onChange.bind(this)}>
        <fieldset disabled={this.props.disabled}>
          {this.props.children}
        </fieldset>
        {debug}
      </form>
    );
  }
}

class Field extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      pristine: true
    };
  }

  static contextTypes = {
    onChange: React.PropTypes.func,
    submitFailures: React.PropTypes.number
  }

  componentDidMount() {
    this.onChange(this.props.value || '');
  }

  componentDidUpdate(p, s, nextContext){
    if(nextContext.submitFailures !== this.context.submitFailures){
      this.onChange(this.state.value);
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.reseting === true) {
      this.onChange(this.props.value || '', true);
    }
  }

  onChange(evt, reseting = false) {
    let value = (evt && evt.target)? evt.target.value : evt;
    this.setState({
      value: value
    });
    this.context.onChange(this.props.name, value, reseting).then(err => {

      this.setState({
        error: err
      });
    });
  }

  onFocus() {
    this.setState({focused: true, pristine: false});
  }

  onBlur() {
    this.setState({focused: false});
  }

  render() {
    let formGroupClass = 'form-group';

    let {label, hint, required, ...other} = this.props;

    if(this.state.focused){
      formGroupClass += ' active';
    }
    else if(this.state.error && (this.state.pristine === false || this.context.submitFailures)){
      formGroupClass += ' danger';
    }

    if(this.props.inlineLabel){
      formGroupClass += ' inline';
    }

    //Only display the label if it's passed as props
    let _label = label ? <label htmlFor='{other.name}'>{label}</label> : null;
    return (
      <div className={formGroupClass}>
        {_label}
        {this.renderField(other)}
      </div>
    );
  }
}

export class Input extends Field {

  componentDidMount() {
    if (this.props.type === 'number' && this.props.value) {
      this.onChange(parseInt(this.props.value));
    }
    else {
      this.onChange(this.props.value || '');
    }
  }

  renderField(other) {
    return (
      <input
        {...other}
        value={this.state.value}
        className='form-input'
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this.onChange.bind(this)}
      />);
  }
}

export class Textarea extends Field {
  renderField(other) {
    return (
      <textarea
        {...other}
        value={this.state.value}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this.onChange.bind(this)}
      />);
  }
}

export class Tags extends Field {

  constructor(props) {
    super(props);
    this.state.value = [];
  }

  componentDidMount() {
    this.onChange(this.props.value || []);
  }

  renderField(other) {
    return (
      <TagsInput
        {...other}
        value={this.state.value || []}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this.onChange.bind(this)}
      />);
  }
}

export class Select extends Field {

  constructor(props) {
    super(props);
    this.state.value = [];
  }

  componentDidMount() {
    this.onChange(this.props.value || []);
    //onChange = { (newValue, values) => this.props.onChange({category: values.map( (v) => { return v.value; }) })}
  }

  _onChange(newValue, values) {
    this.onChange(values.map( (v) => { return v.value; }));
  }

  renderField(other) {
    return (
      <_Select
        {...other}
        value={this.state.value || []}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this._onChange.bind(this)}
      />
      );
  }
}

export class Buttons extends Field {
  _onClick(evt) {
    this.onChange(evt.currentTarget.value);
  }

  renderButtons(params) {
    let {values, btnClasses, ...others} = params;
    return values.map( (obj, key) => {
      let classes = obj.class + ' ' + btnClasses;
      return <button key={key} className={classes} {...others} value={obj.value} onClick={this._onClick.bind(this)}>{obj.label}</button>;
    });
  }

  renderField(params) {
    let {className, ...others} = params;
    return <div className={className}>{this.renderButtons(others)}</div>;
  }
}

export class Boolean extends Field {
  componentDidMount(){
    this.onChange(this.props.value || false);
  }
  _onChange(evt) {
    let value = (evt.target.value === 'true') ? true : false;
    this.onChange(value);
  }

  renderField() {
    return (
      <div className="radios">
        <Radio
          checked={this.state.value === false}
          value={false}
          radioClass={this.props.radioClass}
          label={this.props.labelFalse}
          onChange={this._onChange.bind(this)}
        />
        <Radio
          checked={this.state.value === true}
          value={true}
          radioClass={this.props.radioClass}
          label={this.props.labelTrue}
          onChange={this._onChange.bind(this)}
        />
      </div>
    );
  }
}

export class CheckBoxes extends Field {

  constructor(props) {
    super(props);
    this.state.value = [];
  }

  _onChange(value) {
    let values = this.state.value;
    let valueIndex = values.indexOf(value);
    if(valueIndex !== -1){
      values.splice(valueIndex, 1);
    }
    else {
      values.push(value);
    }
    this.setState({
      value: values
    });
    this.onChange(values);
  }

  componentDidMount() {
    this.onChange(this.props.value || []);
  }

  renderField() {
    return (
      <div className='checkboxes'>
        {this.props.values.map( (checkbox) => {
          return <Checkbox
            label={checkbox.label}
            checkboxClass={this.props.checkboxClass}
            onChange={this._onChange.bind(this, checkbox.value)}
            checked={(this.state.value.indexOf(checkbox.value) !== -1)}
            key={checkbox.value}
          />;
        })}
      </div>
    );
  }
}

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

export const Calendar = enhanceWithClickOutside(_Calendar);