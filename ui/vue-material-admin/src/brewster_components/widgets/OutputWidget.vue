<template>


    <v-card class="mx-auto">
      
        <v-toolbar class="pa-0" card dense >
            <v-toolbar-side-icon @click="is_hidden=!is_hidden" ></v-toolbar-side-icon>
            <div class="title" >{{ title }}</div>
            <v-spacer></v-spacer>
            <div class="title" >{{ getOutputState(outputId).isPID?getTemperature(getOutputState(outputId).pidTargetSensor)+'°':getOutputState(outputId).output+' %' }}</div>
            <div class="subheading" v-if="getOutputState(outputId).isPID">&nbsp;({{ getOutputState(outputId).pidTargetValue }}°)</div>

            
            <v-spacer></v-spacer>
            <v-toolbar-items >
              <v-btn icon @click="open_dialog"><v-icon>settings</v-icon></v-btn>              

              <v-btn class="pa-0 ma-0 powerbtn" flat @click="togglePower" :color="getOutputState(outputId).isActive?'success':''"><span class="title">{{ getOutputState(outputId).isActive?'ON':'OFF' }}</span></v-btn>
              
            </v-toolbar-items>
        </v-toolbar>
      
      
      <v-card-text class="pl-3 pr-3 pt-0 pb-0" v-if="getOutputState(outputId).isPID && !is_hidden">
        <v-container class="pa-0">
          
          <v-slider
            v-model="getOutputState(outputId).pidTargetValue" :color="color" always-dirty min="0" max="100" @change="outputChanged">
            <v-icon slot="prepend" :color="color" @click="pidDecrease">
              keyboard_arrow_down
            </v-icon>
            <v-icon slot="append" :color="color" @click="pidIncrease">
              keyboard_arrow_up
            </v-icon>
          </v-slider>
          
        </v-container>
      </v-card-text>

      <v-card-text class="pl-3 pr-3 pt-0 pb-0" v-else-if="!is_hidden">
        <v-container class="pa-0">
          <v-slider
            v-model="getOutputState(outputId).output" :color="color" always-dirty min="0" max="100" @change="outputChanged">
            <v-icon slot="prepend" :color="color" @click="outputDecrease();">
              keyboard_arrow_down
            </v-icon>
            <v-icon slot="append" :color="color" @click="outputIncrease();">
              keyboard_arrow_up
            </v-icon>
          </v-slider>
          
        </v-container>
      </v-card-text>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            {{ title }} Output Settings
          </v-card-title>

          <v-card-text>
            <v-switch v-model="is_pwm_enabled_dialog" label="Auto mode"></v-switch>
            <v-select
              v-model="target_sensor_dialog"
              :items="items"
              label="Target sensor"
              item-text="title"
              item-value="key"
              single-line
              v-if="is_pwm_enabled_dialog"
            ></v-select>
          </v-card-text>

          <v-card-actions>
            <v-btn flat @click="dialog=false">Close</v-btn>
            <v-btn color="primary" flat @click="dialog_save_changes">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card>    
  
</template>

<script>
import axios from 'axios';
import { mapState, mapGetters } from 'vuex';
import { stringify } from 'querystring';

export default {
  props: {
    title: String,
    color: String,
    outputId: String

    /*
    is_turned_on: Boolean,
    pwm_enabled: Boolean,
    power: Number,
    target_value: Number,
    target_sensor: String
    */
  },
  data () {
    return {
      is_turned_on: false,
      is_pwm_enabled_dialog: false,
      target_sensor_dialog: '',
      dialog: false,
      items: [
        { title: 'Hot Liquor Tun', key: 'HLT' },
        { title: 'Mash Tun', key: 'MT' },
        { title: 'Boil Kettle', key: 'BK' },
        { title: 'Flow Sensor', key: 'C-OUT' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      getTemperature: 'sensors/getTemperature'
    }),
    ...mapGetters({
      getOutputState: 'outputs/getOutputState'
    })
  },
  methods: {
    dialog_save_changes () {
      this.dialog = false;

      if (this.is_pwm_enabled_dialog) {
        this.outputSetPidMode(this.target_sensor_dialog);
      } else {
        this.outputSetManualMode();
      }
    },

    open_dialog () {
      this.target_sensor_dialog = this.getOutputState(this.outputId).pidTargetSensor;
      this.is_pwm_enabled_dialog = this.getOutputState(this.outputId).isPID;
      this.dialog = true;
    },

    togglePower () {
      if (this.getOutputState(this.outputId).isActive) {
        this.outputSetPower(false);
      } else {
        this.outputSetPower(true);
      }
    },

    outputChanged () {
      if (!this.getOutputState(this.outputId).isPID) {
        this.outputSetValue(this.getOutputState(this.outputId).output);
      } else {
        this.outputSetTargetTemperature(this.getOutputState(this.outputId).pidTargetValue);
      }
    },

    outputIncrease () {
      let power = this.getOutputState(this.outputId).output;

      if (power < 95) {
        this.getOutputState(this.outputId).output = power - (power % 5) + 5;
      } else {
        this.getOutputState(this.outputId).output = 100;
      }
      this.outputChanged();
    },

    outputDecrease () {
      let power = this.getOutputState(this.outputId).output;

      if (power > 5) {
        this.getOutputState(this.outputId).output = power + (5 - (power % 5 === 0 ? 5 : power % 5)) - 5;
      } else {
        this.getOutputState(this.outputId).output = 0;
      }
      this.outputChanged();
    },

    pidIncrease () {
      let power = this.getOutputState(this.outputId).pidTargetValue;

      if (power < 100) {
        this.getOutputState(this.outputId).pidTargetValue = power + 1;
      } else {
        this.getOutputState(this.outputId).pidTargetValue = 100;
      }
      this.outputChanged();
    },

    pidDecrease () {
      let power = this.getOutputState(this.outputId).pidTargetValue;

      if (power > 0) {
        this.getOutputState(this.outputId).pidTargetValue = power - 1;
      } else {
        this.getOutputState(this.outputId).pidTargetValue = 0;
      }
      this.outputChanged();
    },

    outputSetPower (val) {
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/brewster/output/' + this.outputId + '/power', 'data': { 'value': val }}).then(data => {
        // this.api_info = data;
      }, error => {
        console.error(error);
      });
    },

    outputSetValue (val) {
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/brewster/output/' + this.outputId, 'data': { 'output_value': val }}).then(data => {
        // this.api_info = data;
      }, error => {
        console.error(error);
      }); 
    },

    outputSetTargetTemperature (val) {
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/brewster/output/' + this.outputId, 'data': { 'target_temperature': val }}).then(data => {
        // this.api_info = data;
      }, error => {
        console.error(error);
      });
    },

    outputSetPidMode (targetSensor) {
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/brewster/output/' + this.outputId + '/mode', 'data': { 'mode': 'pid', 'target_sensor': targetSensor }}).then(data => {
        // this.api_info = data;
      }, error => {
        console.error(error);
      });
    },

    outputSetManualMode (targetSensor) {
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/brewster/output/' + this.outputId + '/mode', 'data': { 'mode': 'manual' }}).then(data => {
        // this.api_info = data;
      }, error => {
        console.error(error);
      });
    },
  }
};
</script>

<style >
.powerbtn {
  width: 20px;
  max-width: 20px;
  height: 20px;
  margin-top: -50px;
};

.v-toolbar__content {
  height: 35px;
}
</style>

