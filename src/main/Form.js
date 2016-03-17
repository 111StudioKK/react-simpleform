import React from 'react';
import JSONTree from 'react-json-tree';

export default class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      submiting: false,
      data: {},
      submitFailures: 0,
      debug:  window.sessionStorage.getItem('debug') || false
    };
  }

  static childContextTypes = {
    onChange: React.PropTypes.func,
    submitFailures: React.PropTypes.number
  }

  validateSchema(field, value, reseting = false) {
    return new Promise((resolve) => {
      let newData = this.state.data;
      newData[field] = value;
      this.setState({
        data: newData
      }, () => {
        this.props.schema
        .validate(this.state.data)
        .then(() => {
          this.setState({
            validated: true
          });
          resolve(false);
        })
        .catch((errors) => {
          this.setState({
            validated: false
          });
          let currentFieldErrored = (errors.inner.filter((err) => field === err.path).length === 1);
          resolve(!reseting && currentFieldErrored);
        });
      });
    });
  }

  onSubmit(evt) {
    evt.preventDefault();
    if(this.state.validated){
      this.props.onSubmit(this.state.data);
    }
    else{
      this.setState({
        submitFailures: ++this.state.submitFailures
      });
    }
  }

  onChange() {
    if(this.props.onChange){
      this.props.onChange(this.state);
    }
  }

  _debugToggle(e) {
    e.preventDefault();
    this.setState({
      debug: !this.state.debug
    }, () => window.sessionStorage.setItem('debug', this.state.debug) );
  }

  _displayDebug() {
    let _switch = {
      marginTop: 15,
      cursor: 'pointer',
      display: 'inline-block'
    };
    let theme = {
      scheme: 'ocean',
      author: 'chris kempson (http://chriskempson.com)',
      base00: '#2b303b',
      base01: '#343d46',
      base02: '#4f5b66',
      base03: '#65737e',
      base04: '#a7adba',
      base05: '#c0c5ce',
      base06: '#dfe1e8',
      base07: '#eff1f5',
      base08: '#bf616a',
      base09: '#d08770',
      base0A: '#ebcb8b',
      base0B: '#a3be8c',
      base0C: '#96b5b4',
      base0D: '#8fa1b3',
      base0E: '#b48ead',
      base0F: '#ab7967'
    };

    let _debug = (this.state.debug) ?
      <div>
        <span style={_switch} onClick={ this._debugToggle.bind(this) }>Debug [-]</span>
        <div style={ {backgroundColor: theme.base00} }>
          <JSONTree data={ this.state } />
        </div>
      </div>
      : <span style={_switch} onClick={ this._debugToggle.bind(this) }>Debug [+]</span>;
    return (
      <div>
        {_debug}
      </div>
    );
  }
  getChildContext() {
    return {onChange: this.validateSchema.bind(this), submitFailures: this.state.submitFailures};
  }
  
  render() {
    let {onSubmit, ...other} = this.props;
    let debug = (__DEV__) ?
      this._displayDebug()
      : null;
    return (
      <form {...other} onSubmit={this.onSubmit.bind(this)} onChange={this.onChange.bind(this)}>
        <fieldset disabled={this.props.disabled}>
          {this.props.children}
        </fieldset>
        {debug}
      </form>
    );
  }
}
