<template>


    <v-card class="mx-auto">
      
        <v-toolbar class="pa-0" card dense >
            <v-toolbar-side-icon @click="is_hidden=!is_hidden" ></v-toolbar-side-icon>
            <div class="title" >{{ title }}</div>
            <v-spacer></v-spacer>
            <div class="title" >{{ is_pwm_enabled?current_sensor_value+'°':power+' %' }}</div>
            <div class="subheading" v-if="is_pwm_enabled">&nbsp;({{ target_value }}°)</div>

            
            <v-spacer></v-spacer>
            <v-toolbar-items >
              <v-btn icon @click="open_dialog"><v-icon>settings</v-icon></v-btn>              

              <v-btn class="pa-0 ma-0 powerbtn" flat @click="togglePower" :color="is_turned_on?'success':''"><span class="title">{{ is_turned_on?'ON':'OFF' }}</span></v-btn>
              
            </v-toolbar-items>
        </v-toolbar>
      
      
      <v-card-text class="pl-3 pr-3 pt-0 pb-0" v-if="is_pwm_enabled && !is_hidden">
        <v-container class="pa-0">
          
          <v-slider
            v-model="target_value" :color="color" always-dirty min="0" max="100" @change="outputChanged">
            <v-icon slot="prepend" :color="color" @click="(target_value > 1)?target_value = target_value - 1:target_value = 0; outputChanged();">
              keyboard_arrow_down
            </v-icon>
            <v-icon slot="append" :color="color" @click="(target_value < 99)?target_value = target_value + 1:target_value = 100; outputChanged();">
              keyboard_arrow_up
            </v-icon>
          </v-slider>
          
        </v-container>
      </v-card-text>

      <v-card-text class="pl-3 pr-3 pt-0 pb-0" v-else-if="!is_hidden">
        <v-container class="pa-0">
          <v-slider
            v-model="power" :color="color" always-dirty min="0" max="100" @change="outputChanged">
            <v-icon slot="prepend" :color="color" @click="if (power > 5) { power = power + (5-(power%5==0?5:power%5)) - 5;} else {power = 0;} outputChanged();">
              keyboard_arrow_down
            </v-icon>
            <v-icon slot="append" :color="color" @click="if (power < 95) { power = power - (power%5) + 5;} else {power = 100;} outputChanged();">
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
      power: '0',
      last_power: 0,
      is_pwm_enabled: false,
      is_pwm_enabled_dialog: false,
      current_sensor_value: 64,
      target_value: 65.4,
      last_target_value: 0,
      target_sensor: 'HLT',
      target_sensor_dialog: '',
      is_hidden: false,
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
  },
  sockets: {
    temperatureChange: function (data) {
      if (data.payload.id === 'C-OUT') {
        this.temp_c_out = data.payload.value.toFixed(1);
      }
      if (data.payload.id === 'HLT') {
        this.temp_hlt = data.payload.value.toFixed(1);
      }
      if (data.payload.id === 'MT') {
        this.temp_mt = data.payload.value.toFixed(1);
      }
      if (data.payload.id === 'BK') {
        this.temp_bk = data.payload.value.toFixed(1);
      }
    },
    outputChange: function (data) {
      console.log('Output change: ' + stringify(data.payload));
    }
  },
  methods: {
    dialog_save_changes () {
      this.target_sensor = this.target_sensor_dialog;
      this.is_pwm_enabled = this.is_pwm_enabled_dialog;
      this.dialog = false;
      console.warn('Implementation missing - fulfillment');
    },

    open_dialog () {
      this.target_sensor_dialog = this.target_sensor;
      this.is_pwm_enabled_dialog = this.is_pwm_enabled;
      this.dialog = true;
    },

    togglePower () {
      if (this.is_turned_on) {
        this.last_power = this.power;
        this.last_target_value = this.target_value;
        this.power = 0;
        this.target_value = 0;
        this.is_turned_on = false;

      } else {
        if (this.power === 0) {
          this.power = this.last_power;
        }

        if (this.target_value === 0) {
          this.target_value = this.last_target_value;
        }

        this.is_turned_on = true;
      }

      this.outputChanged();
    },

    outputChanged () {
      console.warn('Implementation missing - fulfillment');
    }
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

