import React from 'react';

export class GuitarInput extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <div className="tab-input-container">
                    {this.renderTabInput()}            
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
                    stringTuning = {this.props.stringTunings[i]}
                />
            )
        }
        return strings;
    }

    renderTabInput(){
        let tabInputs = [];
        for(let i = 0; i < this.props.stringTunings.length; i++){
            tabInputs.push();
        }
        
    }
}

export class GuitarString extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentlySelectedFret : null
        }
        this.setCurrentlySelectedFret = this.setCurrentlySelectedFret.bind(this);
        this.handleButton = this.handleButton.bind(this);
    }

    render(){
        return (
            <div className = "string-container">
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
        for(let i = 0; i < this.props.numFrets; i++){
            //let d = 1 - (1 / (Math.pow(2, (n / 12))));
            frets.push(
                <Fret 
                    fretNumber = {i} 
                    stringTuning = {this.props.stringTuning} 
                    isSelected = {this.state.currentlySelectedFret === i}
                    notifyString = {() => {this.setCurrentlySelectedFret(i)}}
                />
            )
        }
        return frets;
    }

    setCurrentlySelectedFret(f){
        console.log(f);
        this.setState({currentlySelectedFret : f});
    }

    displayToggleButtonText(){
        switch(this.state.currentlySelectedFret){
            case 'open':
                return 'O';
            break;

            case 'muted' :
                return 'X';
            break;

            default:
                return '--';
            break;
        }
    }

    handleButton(){
        switch(this.state.currentlySelectedFret){
            case 'open':
                this.setState({currentlySelectedFret : 'muted'});
            break;

            case 'muted':
                this.setState({currentlySelectedFret : 'open'});
            break;

            default :
                this.setState({currentlySelectedFret : 'open'});
            break;

        }

    }
}

export class Fret extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isSelected : false,
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
        console.log("mouseOver");
        this.setState({isMousedOver : true})
    }

    handleMouseLeave(){
        this.setState({isMousedOver : false})
    }

    handleClick(e){
        this.setState({isSelected : true});
    }


}


