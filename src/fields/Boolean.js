import React from 'react';
import Field from '../main/Field.js';

export default class Boolean extends Field {
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
        <input
          name={this.props.name}
          type="radio"
          checked={this.state.value === false}
          value={false}
          className={this.props.radioClass}
          onChange={this._onChange.bind(this)}
        /> {this.props.labelFalse}
        <input
          name={this.props.name}
          type="radio"
          checked={this.state.value === true}
          value={true}
          className={this.props.radioClass}
          onChange={this._onChange.bind(this)}
        /> {this.props.labelTrue}
      </div>
    );
  }
}

