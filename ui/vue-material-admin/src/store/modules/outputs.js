// initial state
const state = {
  state_AC1: {
    isActive: false,
    isPID: false,
    pidTargetValue: '-',
    pidTargetSensor: '-',
    output: '1'
  },
  state_AC2: {
    isActive: false,
    isPID: false,
    pidTargetValue: '-',
    pidTargetSensor: '-',
    output: '2'
  },
  state_DC1: {
    isActive: false,
    isPID: false,
    pidTargetValue: '-',
    pidTargetSensor: '-',
    output: '3'
  },
  state_DC2: {
    isActive: false,
    isPID: false,
    pidTargetValue: '-',
    pidTargetSensor: '-',
    output: '4'
  }
};

// getters
const getters = {
  getOutputState: state => (key) => {
    if (key === 'AC1') {
      return state.state_AC1;
    } else if (key === 'AC2') {
      return state.state_AC2;
    } else if (key === 'DC1') {
      return state.state_DC1;
    } else if (key === 'DC2') {
      return state.state_DC2;
    } else {
      return null;
    }
  }
};

// actions
const actions = {

};

// mutations
const mutations = {
  updateOutputs (state, outputChangeEvent) {
    if (outputChangeEvent.payload.id === 'AC1') {
      state.state_AC1.isActive = outputChangeEvent.payload.isActive;
      state.state_AC1.isPID = outputChangeEvent.payload.isPID;
      state.state_AC1.pidTargetValue = outputChangeEvent.payload.pidTargetValue.toFixed(1);
      state.state_AC1.pidTargetSensor = outputChangeEvent.payload.pidTargetSensor;
      state.state_AC1.output = outputChangeEvent.payload.output;
    } else if (outputChangeEvent.payload.id === 'AC2') {
      state.state_AC2.isActive = outputChangeEvent.payload.isActive;
      state.state_AC2.isPID = outputChangeEvent.payload.isPID;
      state.state_AC2.pidTargetValue = outputChangeEvent.payload.pidTargetValue.toFixed(1);
      state.state_AC2.pidTargetSensor = outputChangeEvent.payload.pidTargetSensor;
      state.state_AC2.output = outputChangeEvent.payload.output;
    } else if (outputChangeEvent.payload.id === 'DC1') {
      state.state_DC1.isActive = outputChangeEvent.payload.isActive;
      state.state_DC1.isPID = outputChangeEvent.payload.isPID;
      state.state_DC1.pidTargetValue = outputChangeEvent.payload.pidTargetValue.toFixed(1);
      state.state_DC1.pidTargetSensor = outputChangeEvent.payload.pidTargetSensor;
      state.state_DC1.output = outputChangeEvent.payload.output;
    } else if (outputChangeEvent.payload.id === 'DC2') {
      state.state_DC2.isActive = outputChangeEvent.payload.isActive;
      state.state_DC2.isPID = outputChangeEvent.payload.isPID;
      state.state_DC2.pidTargetValue = outputChangeEvent.payload.pidTargetValue.toFixed(1);
      state.state_DC2.pidTargetSensor = outputChangeEvent.payload.pidTargetSensor;
      state.state_DC2.output = outputChangeEvent.payload.output;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};