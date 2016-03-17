import React from 'react';
import Field from '../main/Field.js';
import TagsInput from 'react-tagsinput';

export default class Tags extends Field {

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

