import React from 'react';
import Field from '../main/Field.js';
import _Select from 'react-select';
import '../style/Select.less';

export default class Select extends Field {

  constructor(props) {
    super(props);
    this.state = {
      value: this.getDefaultValue()
    };
  }

  componentDidMount() {
    this.onChange(this.props.value || this.getDefaultValue());
    //onChange = { (newValue, values) => this.props.onChange({category: values.map( (v) => { return v.value; }) })}
  }

  getDefaultValue() {
    return this.props.multi === true ? [] : '';
  }

  _onChange(values) {
    let newVal = null;
    if ( this.props.multi === true && values ) {
      newVal = values.map( (v) => { return v.value; });
    } else if ( values ) {
      newVal = values.value;
    }
    this.onChange(newVal);
  }

  renderField(other) {
    return (
      <_Select
        {...other}
        value={this.state.value || this.getDefaultValue()}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this._onChange.bind(this)}
      />
      );
  }
}
