import React from 'react';
import Field from '../main/Field.js';
import {Radio} from 'react-icheck';

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

