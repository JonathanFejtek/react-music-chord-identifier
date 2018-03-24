import React from 'react';
import ReactDOM from 'react-dom';
import {GuitarInput} from './guitar-input';
import {KeySpaceView} from './key-space-view';
import {NoteLookup} from './note-lookup';
import {ModeLookup} from './modes-and-keys';


function satisfiesKey(chordTones,keyTones){
  for(let tone of chordTones){
    if(!keyTones.includes(tone%12)){
      return false;
    }
  }
  return true;
}

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        keyIndices : [],
        parentKeyTones : [],
        parentKeyNames : [],
        stringTunings : ["E 4","B 3","G 3","D 3","A 2","E 2"]
      }

      this.state.keys = {};


      let modeLookup = new ModeLookup();

      NoteLookup.getAllNoteNames().forEach((note) => {
        this.state.keys[note] = modeLookup.getMode(note, "ionian");
      })

      this.identifyChord = this.identifyChord.bind(this);
    }

    render() {
      return (
        <div>
          <div className="app-container">
            <div className="fretboard-container">
              <GuitarInput notify = {this.identifyChord} stringTunings = {this.state.stringTunings}/>
            </div>
            <div className="chord-info-container">
              <div className="keyspace-container">
                <KeySpaceView parentKeys = {this.state.parentKeyTones} keyIndices = {this.state.keyIndices} />
              </div>
              <div className="chord-details">
                {/* <p>{this.state.parentKeyNames}</p> */}
              </div>   
            </div>
          </div>
        </div>
      )
    }

    identifyChord(fretState){

      let tones = fretState.map((fretVal, i) => {
        if(typeof fretVal == 'number'){
          return NoteLookup.getToneForNoteName(this.state.stringTunings[i]) + fretVal
        }
      }).filter((toneVal)=>{
        if(toneVal){
          return toneVal;
        }
      })

      let normalizedTones = [... new Set(tones.map((toneVal)=>{
        return (toneVal);
      }))].sort((a,b) => {
        return ((b*7)%12) - ((a*7)%12);
      }
      );

      let parentKeyRootTones = [];
      let parentKeyNames = [];
      for(let key in this.state.keys){
        if(satisfiesKey(tones,this.state.keys[key].tones)){
          parentKeyNames.push(key);
          parentKeyRootTones.push(NoteLookup.getToneForNoteName(key + " 0")%12);
        }
      }

      parentKeyRootTones.sort((a,b) => {
        return ((b*7)%12) - ((a*7)%12);
      }
      );
      this.setState({keyIndices : normalizedTones, parentKeyTones : parentKeyRootTones, parentKeyNames : parentKeyNames});
    }


}

ReactDOM.render(<App />, document.getElementById('app'));
