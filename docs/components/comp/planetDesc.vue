<template>
  <div style="background-color: rgba(255,255,255,0.1);">
    <div class="parameter-div">
      <div class="name" style="font-weight: 700;">{{ props.name }}</div>
      <div>
        距离太阳：<span>{{ props.data.sunDistance }}</span>
      </div>
      <div>
        质量：<span>{{props.data.weight }}</span>
      </div>
      <div>
        直径：<span>{{ props.data.diameter }}</span>
      </div>
      <div>
        自转：<span>{{ props.data.rotation }}</span>
      </div>
      <div>
        公转：<span>{{ props.data.revolution }}</span>
      </div>
      <div>
        表面温度：<span>{{ props.data.temp }}</span>
      </div>
      <div>
        大气成分：<span>{{ props.data.atmosphere }}</span>
      </div>
    </div>
    <div class="description">
      {{ props.data.msg }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({
      sunDistance: '',
      weight: '',
      diameter: '',
      rotation: '',
      revolution: '',
      temp: '',
      atmosphere: '',
      msg: ''
    })
  }
})
</script>

<style scoped>
.parameter-div div span{
  font-weight: 700;
}
</style>