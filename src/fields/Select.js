import React from 'react';
import Field from '../main/Field.js';
import _Select from 'react-select';

export default class Select extends Field {

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
