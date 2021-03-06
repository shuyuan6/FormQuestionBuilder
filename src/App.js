import React, { isValidElement } from 'react';
import "./App.css";

const displayOrders = ['alphabetical', 'reverse-alphabetical', 'random']
const questionTypes = ['Single Choice', 'Multi Choice']
const warningColor = 'red'
const successColor = 'green'

const initialState = {
  choices: [],
  defaultChoice: '',
  newChoice: '',
  label: '',
  valueRequired: false,
  type: questionTypes[0],
  order: displayOrders[0],
  message: '',
  messageColor: warningColor,
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = Object.assign({}, initialState);
    
    this.handleNewChoiceTextChanged = this.handleNewChoiceTextChanged.bind(this);
    this.handleAddChoiceClicked = this.handleAddChoiceClicked.bind(this)
    this.handleLabelTextChanged = this.handleLabelTextChanged.bind(this)
    this.handleSubmitClicked = this.handleSubmitClicked.bind(this)
    this.handleCancelClicked = this.handleCancelClicked.bind(this)
    this.handleValueRequiredChecked = this.handleValueRequiredChecked.bind(this)
    this.handleTypeSelected = this.handleTypeSelected.bind(this)
    this.handleOrderChange = this.handleOrderChange.bind(this)
    this.handleDeleteChoiceClicked = this.handleDeleteChoiceClicked.bind(this)
    this.handleSetDefaultChoiceClicked = this.handleSetDefaultChoiceClicked.bind(this)
  }

  async sendPostRequest(input) {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    };
    const response = await fetch('http://www.mocky.io/v2/566061f21200008e3aabd919', requestOptions);
    const data = await response.json();
    return data
  }

  isValid(toSend) {
    if (toSend['label'] === '') {
      this.setState({message: 'Label is empty. Please fix and resubmit.', messageColor: warningColor})
      return false
    } else if (toSend['choices'].length === 0) {
      this.setState({message: 'Choices are empty. Please fix and resubmit.', messageColor: warningColor})
      return false
    } else if (toSend['choices'].length > 50) {
      this.setState({message: 'You cannot provide more than 50 choices. Please fix and resubmit.', messageColor: warningColor})
      return false
    } else {
      this.setState({message: 'Congratulations! Submitted succesfully', messageColor: successColor})
      setTimeout(function(){
        this.setState({message: ''})
      }.bind(this),2000); 
      return true
    }
  }

  async handleSubmitClicked(e) {
    var toSend = Object.assign({}, this.state);
    delete toSend['newChoice'];
    delete toSend['message']
    delete toSend['messageColor']
    if (!this.isValid(toSend)) {
      console.log("Information filled is not valid")
      return
    }
    console.log(`Submit clicked. Data to be sent is ${JSON.stringify(toSend)}`)
    const ret = await this.sendPostRequest(toSend)
    console.log(`Got response back ${JSON.stringify(ret)}`)
  }

  handleSetDefaultChoiceClicked(e, item) {
    console.log(`Default Choice clicked for [${item}] ${typeof(item)}`)
    this.setState({defaultChoice: item})
  }

  handleDeleteChoiceClicked(e, item) {
    const toBeDeletedChoice = item
    console.log(`Delete Choice clicked for [${toBeDeletedChoice}] ${typeof(toBeDeletedChoice)}`)
    var array = [...this.state.choices];
    var index = array.indexOf(toBeDeletedChoice)

    // We may also need to clear the default choice 
    const newDefaultChoice = item === this.state.defaultChoice ? '' : this.state.defaultChoice
    
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({choices: array, defaultChoice: newDefaultChoice})
    }
  }

  handleOrderChange(e) {
    console.log('Order changed!')
    var array = [...this.state.choices]
    //var sortedArray
    if (e.target.value === 'alphabetical') {
      array.sort();
    } else if (e.target.value === 'reverse-alphabetical') {
      array.reverse();
    } else {
      array.sort((a,b) => {return 0.5 - Math.random()});
    }
    this.setState({order: e.target.value, choices: array})
  }

  handleTypeSelected(e) {
    console.log("Radio button selected")
    this.setState({type: e.target.value})
  }

  handleValueRequiredChecked(e) {
    var checked = e.target.checked;
    console.log("Checked: " + checked)
    this.setState({valueRequired: checked})
  }

  handleCancelClicked(e) {
    console.log('Cancel clicked. Clearing all fields')
    this.setState(Object.assign({}, initialState))
  }

  handleLabelTextChanged(e) {
    this.setState({label: e.target.value})
  }

  handleNewChoiceTextChanged(e) {
    this.setState({newChoice: e.target.value})
  }

  handleAddChoiceClicked(e) {
    this.setState(state => {
      if (this.state.choices.includes(this.state.newChoice)) {
        console.log(`Choice ${this.state.newChoice} already there; will do nothing`)
        return {message: "You don't need to add a duplicate choice.", messageColor: 'red'}
      } else {
        const next = this.state.choices.concat(this.state.newChoice)
        return {choices: next, newChoice: ''}
      }
    })      
  };

  render() {
    return (
    <div className='container'>
      <div className='fieldBuilder'>
        Field Builder
      </div>
      
      <div className='content'>
        <div className='row'>
          <label className='leftColumn'>Label</label>
          <input className='rightColumn' type="text" value={this.state.label} onChange={this.handleLabelTextChanged}/>
        </div>

        <div className='row'>
          <label className='leftColumn'>Type</label>
          <div className='rightColumn' onChange={this.handleTypeSelected}>
            {questionTypes.map(item =>
              <div key={item} className='inner'>
                <label>{item}</label>
                <input type="radio" name="select-type" value={item} onChange={()=>{}} checked={this.state.type === item}/>
              </div>
            )}
          </div>
        </div>

        <div className='row'>
          <label className='leftColumn'>A Value is Required </label>
          <input type="checkbox" onChange={this.handleValueRequiredChecked} checked={this.state.valueRequired}></input>
        </div>

        <div className='row'>
          <label className='leftColumn' >New Choice </label>
          <div className='rightColumn'>
            <textarea className='newChoiceTextField' value={this.state.newChoice} onChange={this.handleNewChoiceTextChanged} cols="40" rows="5"></textarea>
            <button className='addChoiceButton' type="button" onClick={this.handleAddChoiceClicked}>Add</button>
          </div>
        </div>

        <div className='row'>
          <label className='leftColumn'>Choices</label>
          <ul className='rightColumn' className='choices'>
            {this.state.choices.map(item => 
              <li key={item}>
                  <button className='inner' value={item} onClick={e => this.handleDeleteChoiceClicked(e, item)} className="clickChoiceBox">delete</button> 
                  <button className='inner' value={item} onClick={e => this.handleSetDefaultChoiceClicked(e, item)} className="clickChoiceBox">set as default</button> 
                  {this.state.defaultChoice === item ?  (<p className='inner'><b> {item}</b></p>) :  (<p className='inner'>{item}</p>) }
              </li>
            )}
          </ul>
        </div>

        <div className='row'>
          <label className='leftColumn'>Order</label>
          <select className='rightColumn' onChange={this.handleOrderChange}>
            {displayOrders.map(item =>
              <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className='row' style={{color: this.state.messageColor}}>
          <center>
            {this.state.message}
          </center>
        </div>

        <div className='row' >
          <center>
            <button className='submissonButton' type="button" name="submit-button" onClick={this.handleSubmitClicked}> Submit</button>
            <p className='inner'> or </p>
            <button className='cancelButton' type="button" name="cancel-button" onClick={this.handleCancelClicked}> Cancel</button>
          </center>
        </div>
       
      </div>
    </div>
    )
  }
}

export default App;
