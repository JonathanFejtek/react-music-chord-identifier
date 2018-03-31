import React from 'react';

export class KeySpaceView extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            height : null,
            width : null
        }

        this.handleResize = this.handleResize.bind(this);
        this.renderKeySpace = this.renderKeySpace.bind(this);
        this.renderParentKeys = this.renderParentKeys.bind(this);
    }

    render(){
        return (
            <svg 
                width = {"100%"} 
                height = {this.state.height} 
                className = "svg-canvas" 
                ref = {(svg) => {this.canvas = svg}} 
            >   
                {this.renderParentKeys()}
                {this.renderKeySpace()}
                {this.renderCircle()}
            </svg>
        );
    }

    renderCircle(){
        let points = '';
        let keyNames = ["C","G","D","A","E","B","Gb","Db","Ab","Eb","Bb","F"];
        let keyLabels = []
        let c = 0;
        for(let i = 0; i < Math.PI*2; i+=(Math.PI*2)/12){
            let pX = (this.state.height/2-this.state.height/6)*Math.cos(i)+this.state.width/2;
            let pY = (this.state.height/2-this.state.height/6)*Math.sin(i)+this.state.height/2;

            let pXb = (this.state.height/2-this.state.height/12)*Math.cos(i-(3*((Math.PI*2)/12)))+this.state.width/2 - 10;
            let pYb = (this.state.height/2-this.state.height/12)*Math.sin(i-(3*((Math.PI*2)/12)))+this.state.height/2 + 6;
            points += `${pX}, ${pY} `;
            keyLabels.push(
                <text x = {pXb} y = {pYb}>{keyNames[c]}</text>
            )
            c++;
        }
        console.log(points);
        return (
            <svg>
                <polygon stroke = {'lightgrey'} fill = {'none'} points = {points}/>
                <svg>
                    {keyLabels}
                </svg>
            </svg>
        )
    }

    renderKeySpace(){
        if(this.props.keyIndices.length > 0){
            
            let coordinates = this.props.keyIndices.map((index) => {
                let i = ((index*7)-3)*(Math.PI*2)/12;
                return `${(this.state.height/2-this.state.height/6)*Math.cos(i)+this.state.width/2}, ${(this.state.height/2-this.state.height/6)*Math.sin(i)+this.state.height/2} `
            })

            let circles = coordinates.map((co)=>{
                return <circle className = "note-space-circle"  cx = {co.split(',')[0]} cy = {co.split(',')[1]} r = "6"/>
            })
    
            let coordinateString = coordinates.reduce((previousValue,currentValue) => {
                return previousValue + currentValue;
            })
    
            return (
                <svg>{circles}
                <polygon className = "key-space" points = {coordinateString}/>
                </svg>
                
            )
        }
    }

    renderParentKeys(){
        if(this.props.parentKeys.length > 0){
            let coordinates = this.props.parentKeys.map((index) => {
                let i = ((index*7)-3)*(Math.PI*2)/12;
                return `${(this.state.height/2-this.state.height/6)*Math.cos(i)+this.state.width/2}, ${(this.state.height/2-this.state.height/6)*Math.sin(i)+this.state.height/2} `
            })

            let circles = coordinates.map((co)=>{
                return <circle className = "key-space-circle"  cx = {co.split(',')[0]} cy = {co.split(',')[1]} r = "10"/>
            })
    
            let coordinateString = coordinates.reduce((previousValue,currentValue) => {
                return previousValue + currentValue;
            })
    
            return (
                <svg>{circles}
                <polygon class = "parent-keys" points = {coordinateString}/>
                </svg>
            )
        }        
    }

    handleResize(){
        let computedWidth = this.canvas.getBoundingClientRect().width;

        this.setState({
            height : 1*computedWidth,
            width : computedWidth
        })

        this.renderKeySpace();
    }

    componentDidMount(){
        window.addEventListener("resize",this.handleResize);
        window.addEventListener("mousedown",this.handleMouseDown);
        window.addEventListener("mouseup",this.handleMouseUp);
        this.handleResize();
    }
}