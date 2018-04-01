import {NoteLookup} from './note-lookup';

class StringOscillator {
    constructor(context) {
      this.context = context;
      this.init();
    }
  
    init() {
      this.oscillator = this.context.createOscillator();
      this.gainNode = this.context.createGain();
  
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
      this.oscillator.type = 'sine';
    }
  
    play(value, time) {
      this.init();
  
      this.oscillator.frequency.value = value;
      this.gainNode.gain.setValueAtTime(1, this.context.currentTime);             
      this.oscillator.start(time);
    }

    setFrequency(f){
        this.oscillator.frequency.value = f;
    }
  
    stop(time) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1);
      this.oscillator.stop(time + 1);
    } 
}

export class GuitarSynth{
    constructor(context,numStrings){
        this.context = context;
        this.oscillators = [];

        for(let i = 0; i < numStrings; i++){
            let so = new StringOscillator(this.context);
            so.init();
            this.oscillators.push(so);
        }
    }

    play(tab){
        let c = 0;
        for(let t of tab){
            console.log(t);
            if(typeof t == 'number'){
                this.oscillators[c].play(NoteLookup.getFrequencyForTone(t),this.context.currentTime+0.5);
            }
            else{
                console.log('paly');
                this.oscillators[c].play(null,this.context.currentTime+0.5);
            }
            c++;
        }
    }

    set(tab){
        let c = 0;
        for(let t of tab){
            if(typeof t == 'number'){
                this.oscillators[c].setFrequency(NoteLookup.getFrequencyForTone(t),0);
            }         
            c++;
        }        
    }

    stop(){        
        for(let osc of this.oscillators){
            osc.stop(this.context.currentTime+1);
        }
    }
}