<template>
  <div id="page-progress">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg6>

          <v-card class="mx-auto" max-width="600">
            <v-toolbar
              card
              dense
            >
              <v-toolbar-title>
                <span class="subheading">WebSocket Status</span>
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <span v-if="ws_isConnected">We're connected to the server!</span>
                <p>Message from server: "{{ws_socketMessage}}"</p>
                <p>Temperature: {{temp}}°C<br/>
                    Humidity: {{hum}}%</p>
                <v-spacer></v-spacer>
                <v-btn @click="pingServer()">Ping Server</v-btn>
            </v-card-text>

          </v-card>

  // ///////////////////////////////////
          <v-card
              class="mx-auto"
              max-width="600"
            >
              <v-toolbar
                card
                dense
              >
                <v-toolbar-title>
                  <span class="subheading">METRONOME</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card-text>
                <v-layout
                  justify-space-between
                  mb-3
                >
                  <v-flex text-xs-left>
                    <span
                      class="display-3 font-weight-light"
                      v-text="bpm"
                    ></span>
                    <span class="subheading font-weight-light mr-1">BPM</span>
                    <v-fade-transition>
                      <v-avatar
                        v-if="isPlaying"
                        :color="color"
                        :style="{
                          animationDuration: animationDuration
                        }"
                        class="mb-1 v-avatar--metronome"
                        size="12"
                      ></v-avatar>
                    </v-fade-transition>
                  </v-flex>
                  <v-flex text-xs-right>
                    <v-btn
                      :color="color"
                      dark
                      depressed
                      fab
                      @click="toggle"
                    >
                      <v-icon large>
                        {{ isPlaying ? 'pause' : 'play_arrow' }}
                      </v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>

                <v-slider
                  v-model="bpm"
                  :color="color"
                  always-dirty
                  min="40"
                  max="218"
                >
                  <v-icon
                    slot="prepend"
                    :color="color"
                    @click="decrement"
                  >
                    keyboard_arrow_up
                  </v-icon>

                  <v-icon
                    slot="append"
                    :color="color"
                    @click="increment"
                  >
                    keyboard_arrow_down
                  </v-icon>
                </v-slider>
              </v-card-text>
            </v-card>

  // /////////////////////////////////////

          <v-card>
            <v-toolbar card dense>
              <v-toolbar-title>
                <span class="subheading">Brightness</span>
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-layout
                justify-space-between
                mb-3
              >
                <v-flex text-xs-left>
                  <span
                    class="display-3 font-weight-light"
                    v-text="brt"
                  >%</span>
                  <span class="subheading font-weight-light mr-1">%</span>
                </v-flex>
              </v-layout>

              <v-slider
                v-model="brt"
                min="0"
                max="100">
              </v-slider>
            </v-card-text>
          </v-card>


          <v-progress-circular
            :size="100"
            :width="15"
            :rotate="-90"
            :value="value1"
            color="primary"
          >
            {{ value1 }}
          </v-progress-circular>

          <v-slider v-model="value1" step="1" max="100" thumb-label="always">

          </v-slider>

        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import VWidget from '@/components/VWidget';
export default {
  components: {
    VWidget
  },
  data () {
    return {
      // interval: {},
      value: 0,
      value1: 70,
      bpm: 40,
      interval: null,
      isPlaying: false,
      brt: 50,
      ws_isConnected: false,
      ws_socketMessage: '/',
      temp: '',
      hum: ''
    };
  },
  computed: {
    color () {
      if (this.bpm < 100) return 'indigo';
      if (this.bpm < 125) return 'teal';
      if (this.bpm < 140) return 'green';
      if (this.bpm < 175) return 'orange';
      return 'red';
    },
    animationDuration () {
      return `${60 / this.bpm}s`;
    }
  },
  beforeDestroy () {
    clearInterval(this.interval);
  },
  mounted () {
    this.interval = setInterval(() => {
      if (this.value === 100) {
        return (this.value === 0);
      }
      this.value += 2;
    }, 500);
  },
  sockets: {
    connect: function () {
      console.log('socket connected');
    },
    new_event: function (data) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)');
      this.ws_socketMessage = data;
    },
    temperatureChange: function (data) {
      this.temp = data.payload.value.toFixed(2);
      console.log('TemperatureChange Event (temp: ' + this.temp + ')');

    },
    temperature: function (data) {
      this.temp = data.payload.temperature.toFixed(1);
      this.hum = data.payload.humidity.toFixed(1);
      console.log('Temperature Event (temp: ' + this.temp + ', hum: ' + this.hum + ')');
    }
    /*
    connect () {
      this.ws_isConnected = true;
    },

    disconnect () {
      this.ws_isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel (data) {
      this.ws_socketMessage = data;
    }
    */
  },
  methods: {
    decrement () {
      this.bpm--;
    },
    increment () {
      this.bpm++;
    },
    toggle () {
      this.isPlaying = !this.isPlaying;
    },
    pingServer () {
      console.log('Emit ws event');
      this.$socket.emit('pingServer', 'PING!');
    }
  },

};

</script>


<style>
  @keyframes metronome-example {
    from {
      transform: scale(.5);
    }

    to {
      transform: scale(1);
    }
  }

  .v-avatar--metronome {
    animation-name: metronome-example;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  .v-slider__thumb {
    width: 36px;
    height: 36px;
  }
</style>
