<template>
  <div id="page-progress">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg6>

          <v-card class="mx-auto">
              <v-toolbar card dense>
                <v-toolbar-title>
                  <span class="subheading">Led intensity</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-flex text-xs-right>
                  <span
                    class="subheading font-weight-light"
                    v-text="led_intensity"
                  ></span>
                  <span class="subheading font-weight-light">%</span>
                </v-flex>
              </v-toolbar>

              <v-card-text>
                <v-slider
                  v-model="led_intensity" :color="color" always-dirty min="0" max="100" @change="sendData">
                  <v-icon slot="prepend" :color="color" @click="decrement">
                    keyboard_arrow_down
                  </v-icon>
                  <v-icon slot="append" :color="color" @click="increment">
                    keyboard_arrow_up
                  </v-icon>
                </v-slider>
              </v-card-text>
            </v-card>
        </v-flex>

        <v-flex lg3 >
          <circle-widget
            title="Humidity"
            icon="fa fa-thermometer-full"
            color="primary"
            :value="humidity"
          >
          </circle-widget>
        </v-flex>

        <v-flex lg3 sm6 xs12>
          <v-layout column>
            <v-flex d-flex>
              <mini-statistic
                icon="fa fa-thermometer-full"
                :title="temperature"
                sub-title="Kabinet"
                color="light-blue"      
              >
              </mini-statistic>
            </v-flex>

            <v-flex d-flex>
              <temperature-widget
                :temperature="temp_c_out"
                location="Cooler"
                color="light-blue" 
              >
              </temperature-widget>
            </v-flex>

            <v-flex d-flex>
              <temperature-widget
                :temperature="temp_c_out"
                location="Mash tun"
                color="light-blue" 
              >
              </temperature-widget>
            </v-flex>
          </v-layout>
        </v-flex>


        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-thermometer-full"
            :title="temperature"
            sub-title="Kabinet"
            color="light-blue"      
          >
          </mini-statistic>
        </v-flex>
        
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-thermometer-full"
            :title="temp_c_out"
            sub-title="Chiller out"
            color="light-blue"      
          >
          </mini-statistic>
        </v-flex>

        <v-flex lg3 sm6 xs12>
          <temperature-widget
            :temperature="temp_c_out"
            location="Cooler"
            color="light-blue" 
          >
          </temperature-widget>
        </v-flex>
        

        <!--
        <v-flex lg3 >
          <linear-widget
            title="Ambient brightness"
            icon="brightness_low"
            color="primary"
            :value="value"
          >
          </linear-widget>
        </v-flex>
        -->

        <!--
        <v-flex lg3 >
          <span
          class="subheading font-weight-light"
          v-text="api_info"
        ></span>
        </v-flex>
        -->
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import VWidget from '@/components/VWidget';
import CircleWidget from '@/brewster_components/widgets/CircleWidget';
import LinearWidget from '@/brewster_components/widgets/LinearWidget';
import MiniStatistic from '@/brewster_components/widgets/MiniStatistic';
import TemperatureWidget from '@/brewster_components/widgets/TemperatureWidget';

export default {
  components: {
    VWidget,
    CircleWidget,
    LinearWidget,
    MiniStatistic,
    TemperatureWidget
  },
  data () {
    return {
      // interval: {},
      value: 80,
      led_intensity: 70,
      api_info: 'null',
      humidity: 0,
      tmperature: 0,
      temp_c_out: 0
    };
  },
  computed: {
    color () {
      if (this.led_intensity < 25) return 'teal';
      if (this.led_intensity < 50) return 'green';
      if (this.led_intensity < 75) return 'orange';
      return 'red';
    }
  },
  mounted () {
    this.api_info = 'Calling REST API';
    axios({ method: 'GET', 'url': 'http://192.168.1.27:3000/led' }).then(res => {
      this.api_info = res.data;
    }, error => {
      console.error(error);
    });
  },
  sockets: {
    temperature: function (data) {
      this.temperature = data.payload.temperature.toFixed(1);
      this.humidity = data.payload.humidity.toFixed(1);
      // console.log('Temperature Event-1 (temp: ' + this.temperature + ', hum: ' + this.humidity + ')');
    },
    temperatureChange: function (data) {
      if (data.payload.id === 'C-OUT') {
        this.temp_c_out = data.payload.value.toFixed(1);
      }
    }
  },
  methods: {
    sendData () {
      // , "headers": { "content-type": "application/text"}
      const querystring = require('querystring');
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/led/update', 'data': querystring.stringify({ value: this.led_intensity }) }).then(data => {
        this.api_info = data;
      }, error => {
        console.error(error);
      });
    },
    decrement () {
      this.led_intensity--;
      this.sendData();
    },
    increment () {
      this.led_intensity++;
      this.sendData();
    }
  },

};
</script>


<style>
  .v-slider__thumb {
    width: 36px;
    height: 36px;
  }
</style>
