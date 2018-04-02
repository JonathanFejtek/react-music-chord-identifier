import React from 'react';

export class GuitarInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            strings : []
        }

        for(let i = 0; i < this.props.stringTunings.length; i++){
            this.state.strings[i] = 'x';
        }

        this.setCurrentlySelectedFret = this.setCurrentlySelectedFret.bind(this);
    }

    render(){
        return (
            <div className = "guitar-input-container">
                <div className="tab-input-container">
                </div>
                <div className = "guitar-container">
                    {this.renderStrings()}
                </div>
            </div>
        )
    }

    renderStrings(){
        let strings = [];
        for(let i = 0; i < this.props.stringTunings.length; i++){
            strings.push(
                <GuitarString 
                    numFrets = {24}
                    stringId = {i}
                    key = {i}
                    stringTuning = {this.props.stringTunings[i]}
                    currentlySelectedFret = {this.state.strings[i]}
                    setCurrentlySelectedFret = {this.setCurrentlySelectedFret}
                />
            )
        }
        return strings;
    }

    renderTabInput(){
        let tabInputs = [];
        for(let i = 0; i < this.props.stringTunings.length; i++){
            tabInputs.push(
                <input value = {this.state.strings[i]} size = {2} maxLength = {2} type = "text"/>
            );
        } 
        return tabInputs;
    }

    setCurrentlySelectedFret(stringId,fret){
        let currentStrings = this.state.strings.slice();
        currentStrings[stringId] = fret;
        this.setState({strings : currentStrings},()=>{
            this.props.notify(this.state.strings);
        });     
    }
}

export class GuitarString extends React.Component{
    constructor(props){
        super(props);
        this.setCurrentlySelectedFret = this.setCurrentlySelectedFret.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.handleTabInput = this.handleTabInput.bind(this);
    }

    shouldComponentUpdate(nextProps,nextState){
        return this.props.currentlySelectedFret !== nextProps.currentlySelectedFret;
    }

    render(){
        return (
            <div className = "string-container">
            <input onChange = {this.handleTabInput} value = {this.props.currentlySelectedFret} size = {2} maxLength = {2} type = "text"/>
            <button 
                className = "mute-toggle-button"
                onClick = {this.handleButton}
            >
                {this.displayToggleButtonText()}
            </button>
                {this.renderFrets()}
            </div>
        )
    }

    renderFrets(){
        let frets = [];
        for(let i = 1; i <= this.props.numFrets; i++){
            frets.push(
                <Fret 
                    fretNumber = {i} 
                    key = {i}
                    stringTuning = {this.props.stringTuning} 
                    isSelected = {this.props.currentlySelectedFret === i}
                    notifyString = {() => {this.props.setCurrentlySelectedFret(this.props.stringId,i)}}
                />
            )
        }
        return frets;
    }

    setCurrentlySelectedFret(f){
        this.setState({currentlySelectedFret : f});
    }

    handleTabInput(e){
        let val = e.target.value;

        if(val.toLowerCase() === "x"){
            this.props.setCurrentlySelectedFret(this.props.stringId, "x");
        }
        else if (val.toLowerCase() === "o" || parseInt(val) === 0){
            this.props.setCurrentlySelectedFret(this.props.stringId, 0);
        }

        else if(typeof parseInt(val) === 'number'){

            if(isNaN(parseInt(val))){
                this.props.setCurrentlySelectedFret(this.props.stringId, null);
            }
            else{
                let mval = parseInt(val);
                if(mval < 1){
                    mval = 1;
                }
                else if(mval > 24){
                    mval = 24;
                }
                this.props.setCurrentlySelectedFret(this.props.stringId, mval);
            }
        }

        else{
            this.props.setCurrentlySelectedFret(this.props.stringId, 'x');
        }
    }

    displayToggleButtonText(){
        switch(this.props.currentlySelectedFret){
            case 0:
                return 'o';
            break;

            case 'x' :
                return 'x';
            break;

            default:
                return '--';
            break;
        }
    }

    handleButton(){
        switch(this.props.currentlySelectedFret){
            case 0:
               this.props.setCurrentlySelectedFret(this.props.stringId,'x');
            break;

            case 'x':
               this.props.setCurrentlySelectedFret(this.props.stringId,0);
            break;

            default :
              this.props.setCurrentlySelectedFret(this.props.stringId,0);
            break;

        }
    }
}

export class Fret extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isMousedOver : false
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    render(){
        return (
            <div 
                onMouseEnter = {this.handleMouseEnter}
                onMouseLeave = {this.handleMouseLeave}
                onClick = {this.props.notifyString}
                className = "fret-container"
            >
                <div className = {`fret-note ${this.props.isSelected ? 'fret-selected' : this.state.isMousedOver ? "fret-focused" : null}`}></div>
            </div>
        );
    }

    handleMouseEnter(){
        this.setState({isMousedOver : true})
    }

    handleMouseLeave(){
        this.setState({isMousedOver : false})
    }

    handleClick(e){
        this.setState({isSelected : true});
    }

}


