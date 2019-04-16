// initial state
const state = {
  t_HLT: '-',
  t_MT: '-',
  t_BK: '-',
  t_C_OUT: '-'
};

// getters
const getters = {
  getTemperature: state => (key) => {
    if (key === 'HLT') {
      return state.t_HLT;
    } else if (key === 'MT') {
      return state.t_MT;
    } else if (key === 'BK') {
      return state.t_BK;
    } else if (key === 'C-OUT') {
      return state.t_C_OUT;
    } else {
      return '/';
    }
  }
};

// actions
const actions = {
};

// mutations
const mutations = {
  updateTemperature (state, tempChangeEvent) {
    if (tempChangeEvent.payload.id === 'HLT') {
      state.t_HLT = tempChangeEvent.payload.value.toFixed(1);
    } else if (tempChangeEvent.payload.id === 'BK') {
      state.t_BK = tempChangeEvent.payload.value.toFixed(1);
    } else if (tempChangeEvent.payload.id === 'MT') {
      state.t_MT = tempChangeEvent.payload.value.toFixed(1);
    } else if (tempChangeEvent.payload.id === 'C-OUT') {
      state.t_C_OUT = String(tempChangeEvent.payload.value.toFixed(1));
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