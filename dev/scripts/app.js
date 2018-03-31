import React from 'react';
import ReactDOM from 'react-dom';
import {GuitarInput} from './guitar-input';
import {KeySpaceView} from './key-space-view';
import {NoteLookup} from './note-lookup';
import {ModeLookup} from './modes-and-keys';
import {ChordLookup} from './chord-lookup';


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
        currentNotesPlayed : ['x','x','x','x','x','x'],
        currentFretState : ['x','x','x','x','x','x'],
        validChords : [],
        play : false
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
      this.playChord = this.playChord.bind(this);
    }

    playChord(){
      if(this.state.play){
        this.setState({play : false});
      }
      else{
        this.setState({play : true});
      }
    }

    render() {
      return (
        <div className = "wrapper">
          <button 
            onClick = {this.playChord} 
            className="sound-button">{this.state.play 
              ? 'Stop' 
              : 'Play' }
          </button>
          <h1 className = "app-title">Chord Explorer</h1>
          <h6 className = "credits">Created By: <a href="http://jfejtek.com">Jonathan Fejtek</a> </h6>
          

          <div className="app-container"> 
            <div className="fretboard-container">
              <GuitarInput notify = {this.identifyChord} stringTunings = {this.state.stringTunings}/>
            </div>
            <div className="chord-info-container">
              <div className="keyspace-container">

                <div className="chord-space-legend">
                  <div className="l-space-color note-space-color">
                  </div>
                  <h4 className = "legend-label">Note-space</h4>
                </div>

                <div className="chord-space-legend">
                  <div className="l-space-color key-space-color">
                  </div>
                  <h4 className = "legend-label">Key-space</h4>
                </div>

                <KeySpaceView parentKeys = {this.state.parentKeyTones} keyIndices = {this.state.keyIndices} />
              </div>
              <div className="chord-details">
                <div className="chord-info-block">
                  <h2>Notes in Chord</h2>
                  <div className="chord-info-list">
                    {this.state.currentNotesPlayed.map((note)=>{
                      return (
                        <h4>{note}</h4>
                      );
                    }).reverse()}
                  </div>              
                </div>
                <div className="chord-info-block">
                  <h2>Tab</h2>
                  <div className="chord-info-list">
                    {this.state.currentFretState.map((fret)=>{
                      return (
                        <h4>{fret}</h4>
                      );
                    }).reverse()}
                  </div>             
                </div>
                <div className="chord-info-block">
                  <h2>Chord Names</h2>
                  <ol className = "chord-info-list">{this.state.validChords.map((chord)=>{
                    return (
                      <li>{chord}</li>
                    )
                  })}</ol>                
                </div>
              </div>   
            </div>
          </div>
        </div>
      )
    }

    getChordToneValues(fretState,tonesOnly=true){      
      console.log(fretState);
      let tones = fretState.map((fretVal, i) => {
        if(typeof fretVal == 'number'){
          return NoteLookup.getToneForNoteName(this.state.stringTunings[i]) + fretVal
        }
        else if(!tonesOnly){
          return fretVal;
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
        if(tone !== 'x'){
          notes.push(NoteLookup.getNoteName(tone,true));

        }
        else{
          notes.push(tone);
        }
        
      }
      return notes;
    }

    getIntervalStructures(chordTones){
      let intervalStructures = [];

      for(let tone of chordTones){
        let intervalStructure = {};
        intervalStructure.root = NoteLookup.getNoteName(tone);
        intervalStructure.structure = [];

        for(let otherTone of chordTones){

          intervalStructure.structure.push((((otherTone-tone)%12)+12)%12);
        }
        intervalStructure.structure = [...new Set(intervalStructure.structure)].sort();
        intervalStructures.push(intervalStructure);
      }

      return intervalStructures;
    }

    identifyChord(fretState){
      let tonesV = this.getChordToneValues(fretState);
      let tones = this.getChordToneValues(fretState,false);
      let notes = this.getNotesInChord(tones);
      let intervalStructures = this.getIntervalStructures(tonesV);

      let validChords = [...
        new Set(intervalStructures.filter(is => {return ChordLookup[is.structure]})
          .map((is) => {
          let chordClass = ChordLookup[is.structure];
          return `${is.root} ${ChordLookup[is.structure]}`;
      }))];

      this.setState({
        currentNotesPlayed : notes, 
        currentTonesPlayed : tonesV, 
        currentFretState : fretState,
        validChords : validChords
        });

      let normalizedTones = [... new Set(tonesV.map((toneVal)=>{
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
