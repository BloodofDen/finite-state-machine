class FSM {

    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config) throw new Error("Error! Config is empty!");
        this.allStates = config.states;
        this.currentState = config.initial;
        this.historyStates = [];
        this.specialRedoArray = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {return(this.currentState);}

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!state) throw new Error("Error! State is empty!");
        if(state in this.allStates) {
            this.historyStates.push(this.currentState);
            this.currentState = state;
            this.specialRedoArray = [];
        }
        else throw new Error("Error! Wrong state!");
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(!this.allStates[this.currentState].transitions[event])
            throw new Error("Error! Wrong Event!");

        this.historyStates.push(this.currentState);
        this.currentState = this.allStates[this.historyStates[this.historyStates.length-1]].transitions[event];
        this.specialRedoArray = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.historyStates.push(this.currentState);
        this.currentState = this.historyStates[0];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event)
    {
        if(!event) return(Object.getOwnPropertyNames(this.allStates));

        var arrayTemp = [];
        for(var state in this.allStates)
        {
            if(this.allStates[state].transitions[event] !== undefined)
                arrayTemp.push(state);
        }
        return arrayTemp;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(!this.historyStates[0])
            return false;
        this.specialRedoArray.push(this.currentState);
        this.currentState = this.historyStates[this.historyStates.length-1];
        this.historyStates.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(!this.specialRedoArray[0])
            return false;
        this.currentState = this.specialRedoArray[this.specialRedoArray.length-1];
        this.specialRedoArray.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {this.historyStates = [];}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
