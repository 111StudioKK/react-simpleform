import React from 'react';
import { render } from 'react-dom';
import Form, { Boolean, Buttons, Calendar, Checkboxes, Input, Select, Tags, Yup } from '../src/index.js';

//var App = React.createClass({
class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      schema: Yup.object().shape({
        keywords: Yup.array().required(),
        name: Yup.string().required(),
        noob: Yup.boolean().required(),
        roles: Yup.string().required(),
        rank: Yup.string().required()
        /*when: Yup.number(),
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
            name="roles"
            checkboxClass="checkbox"
            values={['top', 'jungle', 'mid', 'adc', 'support'].map( (i) => { return {label: i.toUpperCase(), value:i};})} />
          <Boolean name="noob" labelTrue="Yes very noob" labelFalse="Yes, a bit noob" />
          <Select 
            className="rank"
            name="rank"
            options={ [
              { label: 'Bronze', value: 'b' },
              { label: 'Silver', value: 's' },
              { label: 'Gold', value: 'g' },
              { label: 'Platinium', value: 'p' },
              { label: 'Diamond', value: 'd' },
              { label: 'Master', value: 'm' },
              { label: 'Chalenger', value: 'c' }
            ]}
          />
          <Tags
            label="Adj"
            name="keywords"
            inputProps={ {placeholder: 'what?'} }
            value={ ['noob', 'newbee'] }
          />
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
