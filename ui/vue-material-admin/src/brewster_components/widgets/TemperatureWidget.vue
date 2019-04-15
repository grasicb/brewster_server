<template>


    <v-card >
      <v-card-text class="pa-0">
        <v-container class="pa-0">
          
          <!--
          <div class="layout column ma-0">
            <div class="sm3 xs3 flex">
              <div class="layout row ma-0 justify-left align-center">
                <v-icon size="45px" :color="color">fa fa-thermometer-full</v-icon>
                <v-spacer></v-spacer>
                <span style="font-size: 18px">{{ location }}</span>
                <v-spacer></v-spacer>
              </div>
            </div>
            <div class="sm3 xs3 flex text-sm-center py-3 white--text justify-center align-center" :class="color">
              <div class="headline align-center justify-center">{{ temperature }} °C</div>
            </div>
          </div>
          -->

          <div class="layout row pa-0 ml-0">
            <v-icon class="ml-3" large :color="color">fa-thermometer-full</v-icon>
            <div class="flex">
              <div class="layout column ma-0 justify-left align-center">
                
                <span style="font-size: 18px">{{ location }}</span>
                <v-spacer></v-spacer>
                <div class="headline align-center justify-center">{{ temperature }} °C</div>
              </div>
            </div>
          </div>
          
        </v-container>
      </v-card-text>
    </v-card>    
  
</template>

<script>
export default {
  props: {
    temperature: String,
    location: String,
    color: String
  }
};
</script>
