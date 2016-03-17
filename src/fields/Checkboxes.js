import React from 'react';
import Field from '../main/Field.js';

export class Checkboxes extends Field {

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
