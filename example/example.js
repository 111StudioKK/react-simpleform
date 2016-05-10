import React from 'react';
import { render } from 'react-dom';
import Form, { Boolean, Buttons, Calendar, Checkboxes, Input, Yup } from '../src/index.js';

//var App = React.createClass({
class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      schema: Yup.object().shape({
        name: Yup.string().required(),
        niveau: Yup.string().required(),
        noob: Yup.boolean().required()/*,
        rank: Yup.array().min(1).required(),
        when: Yup.number(),
        valid: Yup.string().required()*/
      })
    };
  }
  
  submit(data) {
    console.log(data);
  }

  render() {
    return (
      <div className="app">
        <Form
          onSubmit={this.submit.bind(this)}
          schema={this.state.schema}>
          <Input name="name" type="text" label="Name" value="" className="name"/>
          <Input name="niveau" type="text" label="Niveau" value="Noob" disabled />
          <Checkboxes
            name="rank"
            checkboxClass="checkbox"
            values={['bronze', 'silver', 'gold', 'platinium', 'diamond'].map( (i) => { return {label: i.toUpperCase(), value:i};})} />
          <Boolean name="noob" labelTrue="Yes very noob" labelFalse="Yes, a bit noob" />
          <Calendar name="when" label="When" className="date" />
          <Buttons values={[
            {value:'ok', class:'btn-approve', label:<div>OK</div>},
            {value:'ko', class:'btn-deny', label:<div>Nop</div>}
          ]} name="valid" btnClasses="i-am-a-button" className="we-are-buttons" />
        </Form>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('content')
);
