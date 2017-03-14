import React from 'react';
import Field from '../main/Field.js';

export default class Textarea extends Field {
  renderField(other) {
    return (
      <textarea
        {...other}
        className='form-textarea'
        value={this.state.value}
        onBlur={this.onBlur.bind(this)}
        onChange={this.onChange.bind(this)}
        onCompositionEnd={this.handleComposition}
        onCompositionStart={this.handleComposition}
        onCompositionUpdate={this.handleComposition}
        onFocus={this.onFocus.bind(this)}
      />);
  }
}

