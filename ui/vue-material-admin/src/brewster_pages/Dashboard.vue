<template>     

  <div id="page-progress">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        
          <v-flex lg2 sm3 xs6>
            <temperature-widget
              :temperature="temp_hlt"
              location="HLT"
              color="light-blue" 
            >
            </temperature-widget>
          </v-flex>

          <v-flex lg2 sm3 xs6>
            <temperature-widget
              :temperature="temp_mt"
              location="Mash tun"
              color="light-blue" 
            >
            </temperature-widget>
          </v-flex>

          <v-flex lg2 sm3 xs6>
            <temperature-widget
              :temperature="temp_bk"
              location="Boil Kettle"
              color="light-blue" 
            >
            </temperature-widget>
          </v-flex>

          <v-flex lg2 sm3 xs6>
            <temperature-widget
              :temperature="temp_c_out"
              location="Cooler"
              color="light-blue" 
            >
            </temperature-widget>
          </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex lg6 sm6 xs12>
          <output-widget
            outputId="AC1"
            title="AC1"
            color="light-blue" 
          >
          </output-widget>
        </v-flex>

        <v-flex lg6 sm6 xs12>
          <output-widget
            outputId="AC2"
            title="AC2"
            color="light-blue" 
          >
          </output-widget>
        </v-flex>

        <v-flex lg6 sm6 xs12>
          <output-widget
            outputId="DC1"
            title="DC1"
            color="light-blue" 
          >
          </output-widget>
        </v-flex>

        <v-flex lg6 sm6 xs12>
          <output-widget
            outputId="DC2"
            title="DC2"
            color="light-blue" 
          >
          </output-widget>
        </v-flex>


      </v-layout>

    </v-container>
  </div>

</template>

<script>
import axios from 'axios';
import TemperatureWidget from '@/brewster_components/widgets/TemperatureWidget';
import OutputWidget from '@/brewster_components/widgets/OutputWidget';
import { stringify } from 'querystring';

export default {
  components: {
    // VWidget,
    TemperatureWidget,
    OutputWidget
  },
  data () {
    return {
      // interval: {},
      temp_c_out: '',
      temp_bk: '',
      temp_mt: '',
      temp_hlt: '',
      api_info: '.'
    };
  },
  computed: {
  },
  created () {
    window.getApp.$on('COMPONENT_REFRESH', () => {
      this.refreshData();
    });
  },
  mounted () {
    this.refreshData();

    /*
    axios({ method: 'GET', 'url': 'http://192.168.1.27:3000/brewster' }).then(res => {
      this.api_info = res.data;
      console.log('Mounted: ' + res.data);
    }, error => {
      console.error(error);
    });
    */
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
    /*
    sendData () {
      // , "headers": { "content-type": "application/text"}
      const querystring = require('querystring');
      axios({ method: 'POST', 'url': 'http://192.168.1.27:3000/led/update', 'data': querystring.stringify({ value: this.led_intensity }) }).then(data => {
        // this.api_info = data;
      }, error => {
        console.error(error);
      });
    },
    */

    refreshData () {
      axios({ method: 'GET', 'url': 'http://192.168.1.27:3000/brewster/refreshSensors' }).then(res => {
      }, error => {
        console.error(error);
      });

      axios({ method: 'GET', 'url': 'http://192.168.1.27:3000/brewster/refreshOutputs' }).then(res => {
      }, error => {
        console.error(error);
      });
      
    },
    onScroll () {
      alert('scroll');
    }
  },

  

};
</script>


<style>
</style>
