import React from 'react';
import Field from '../main/Field.js';

export default class Input extends Field {

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

