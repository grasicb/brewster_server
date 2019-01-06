<template>
  <v-card>
    <v-card-title>
      <div class="layout row ma-0 justify-space-between pb-1">
        <div class="subheading">{{title}}</div>
        <div class="icon">
          <v-icon mini :color="color">{{icon}}</v-icon>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="pt-2">
      <v-progress-linear :value="value" height="16" :color="color"></v-progress-linear>
      <span class="caption">{{value}}</span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    value: Number,
    color: String
  },
  computed: {
  }
};
</script>

<style>

</style>
