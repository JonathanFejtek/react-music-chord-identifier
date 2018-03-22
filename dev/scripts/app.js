import React from 'react';
import ReactDOM from 'react-dom';
import {GuitarInput} from './guitar-input';

class App extends React.Component {
    render() {
      return (
        <div>
          <GuitarInput stringTunings = {["A","B","C","D","E","F"]}/>
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
