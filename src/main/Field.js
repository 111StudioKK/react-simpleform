import React from 'react';

let onComposition = false;

export default class Field extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: '',
      pristine: true
    };
  }

  static contextTypes = {
    onChange: React.PropTypes.func,
    submitFailures: React.PropTypes.number
  }

  componentDidMount() {
    this.onChange(this.props.value || '');
  }

  componentDidUpdate(p, s, nextContext){
    if(nextContext.submitFailures !== this.context.submitFailures){
      this.onChange(this.state.value);
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.reseting === true) {
      this.onChange(this.props.value || '', true);
    }
  }

  handleComposition  = (event) => {
    if (event.type === 'compositionend') {
      onComposition = false;
      this.onChange(event);
    } else {
      onComposition = true;
    }
  }

  onChange(evt, reseting = false) {
    let value = (evt && evt.target)? evt.target.value : evt;
    this.setState({value: value});
    if ( !onComposition ) {
      this.context.onChange(this.props.name, value, reseting).then(err => {
        this.setState({
          error: err
        });
      });
    }
  }

  onFocus() {
    this.setState({focused: true, pristine: false});
  }

  onBlur() {
    this.setState({focused: false});
  }

  render() {
    let {label, hint, required, className, ...other} = this.props;

    let formGroupClass = 'form-group' + (className ? ' ' + className : '');

    if(this.state.focused){
      formGroupClass += ' active';
    }
    else if(this.state.error && (this.state.pristine === false || this.context.submitFailures)){
      formGroupClass += ' danger';
    }

    if(this.props.inlineLabel){
      formGroupClass += ' inline';
    }

    //Only display the label if it's passed as props
    let _label = label ? <label htmlFor='{other.name}'>{label}</label> : null;
    return (
      <div className={formGroupClass}>
        {_label}
        {this.renderField(other)}
      </div>
    );
  }
}
