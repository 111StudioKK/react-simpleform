import React from 'react';
import Field from '../main/Field.js';

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

