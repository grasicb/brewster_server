import Vue from 'vue';
import Vuex from 'vuex';
import sensors from './modules/sensors';
// import createLogger from '../../../src/plugins/logger';

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    sensors
  },
//  plugins: debug ? [createLogger()] : []
});