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
        stringTunings : ["E 4","B 3","G 3","D 3","A 2","E 2"],
        currentTonesPlayed : [],
        currentNotesPlayed : [],
        currentFretState : []
      }

      this.state.keys = {};


      let modeLookup = new ModeLookup();

      NoteLookup.getAllNoteNames().forEach((note) => {
        this.state.keys[note] = modeLookup.getMode(note, "ionian");
      })

      this.identifyChord = this.identifyChord.bind(this);
      this.getChordToneValues = this.getChordToneValues.bind(this);
      this.getNotesInChord = this.getNotesInChord.bind(this);
      this.getIntervalStructures = this.getIntervalStructures.bind(this);
      //this.getNormalizedToneSet = this.getNormalizedToneSet.bind(this);
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
                <h2>Notes in Chord:</h2>
                <div className="notes-in-chord-list">
                  {this.state.currentNotesPlayed.map((note)=>{
                    return (
                      <h3>{note}</h3>
                    );
                  })}
                </div>
                <h2>Tab:</h2>
                <div className="tab-for-chord">
                  {this.state.currentFretState.map((fret)=>{
                    return (
                      <h3>{fret}</h3>
                    );
                  }).reverse()}
                </div>
              </div>   
            </div>
          </div>
        </div>
      )
    }

    getChordToneValues(fretState){      
      let tones = fretState.map((fretVal, i) => {
        if(typeof fretVal == 'number'){
          return NoteLookup.getToneForNoteName(this.state.stringTunings[i]) + fretVal
        }
      }).filter((toneVal)=>{
        if(toneVal){
          return toneVal;
        }
      })

      return tones;
    }

    getNotesInChord(chordTones){
      let notes = [];
      for(let tone of chordTones){
        notes.push(NoteLookup.getNoteName(tone,true));
      }
      return notes;
    }

    getIntervalStructures(chordTones){
      let intervalStructures = [];

      for(let tone of chordTones){
        let intervalStructure = {};
        intervalStructure.root = tone;
        intervalStructure.structure = [];

        for(let otherTone of chordTones){
          intervalStructure.structure.push((tone-otherTone)%12);
        }

        intervalStructures.push(intervalStructure);
      }

      return intervalStructures;
    }

    identifyChord(fretState){
      console.log(fretState);

      let tones = this.getChordToneValues(fretState);

      console.log(tones);

      let notes = this.getNotesInChord(tones);

      let intervalStructures = this.getIntervalStructures(tones);

      console.log(notes);

      console.log(intervalStructures);

      this.setState({currentNotesPlayed : notes, currentTonesPlayed : tones, currentFretState : fretState});

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
