import React from 'react';
import Field from '../main/Field.js';

export default class Textarea extends Field {
  renderField(other) {
    return (
      <textarea
        {...other}
        className='form-textarea'
        value={this.state.value}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this.onChange.bind(this)}
      />);
  }
}

