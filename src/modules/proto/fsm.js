/**
 * 
 * @param {object} options - Configuration Logic
 * @example 
 * const trafficLight = new FSM({
    entrySTATE: "RED", // Starts at RED
    states: {
      RED: { 
        next: "GREEN", // Transitions to GREEN on input "next"
        accepts: true  // Optional: Mark RED as an accepting state
      },
      GREEN: { next: "YELLOW" },
      YELLOW: { next: "RED" }
    }
  });
 */
  export function FSM(options = {}) {
    //State Storage
    //Inherits options configuration
    this.STATES = options.states || {
      STATE_A: {
        0: "STATE_B",
        1: "STATE_A",
      },
  
      STATE_B: {
        0: "STATE_A",
        1: "STATE_B",
        accepts: true,
      },
    }
    /**
     * @description - The inital state of the finite state machine
     */
    this.entrySTATE = options.entrySTATE ? options.entrySTATE : "STATE_A";
    /**
     * @description The current state of the finite state machine
     */
    this.currentSTATE = this.entrySTATE;
      /**
     * @description The current transition input of the finite state machine
     */
    this.currentINPUT = "";
  
    /**
     * 
     * @param {string|number|boolean} input 
     */
    this.transition = function (input) {
      try {
        this.currentINPUT = `${input}`;
        this.currentSTATE = this.STATES[this.currentSTATE][input]
      }
      catch (e) {
        throw new Error(`Invalid input ${this.currentINPUT}: or state does not exist: ${this.currentSTATE}`);
      }
    }
    /**
     * @description This function checks if the current 
     * state of the state machine is an accepting state, 
     * if so it returns true, if there no sepcified accepting in the given state 
     * or its specified as false it will return false
     * 
     * @returns {boolean}
     */
    this.isAccepting = function () {
      let accepting = !!this.STATES[this.currentSTATE]?.accepts;
      return accepting
    }
      /**
     * @description This function resets the currentSTATE property to the initial state
     */
    this.reset = function (){
      this.currentSTATE = this.entrySTATE;
    }
  }