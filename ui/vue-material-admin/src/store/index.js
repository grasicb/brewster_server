import Vue from 'vue';
import Vuex from 'vuex';
import sensors from './modules/sensors';
import outputs from './modules/outputs';
// import createLogger from '../../../src/plugins/logger';

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    sensors,
    outputs
  },
//  plugins: debug ? [createLogger()] : []
});