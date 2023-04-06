<template>
  <h-text-transform
    :transform="simpleToTradition"
    :sample-data="text"
    :reverse-transform="traditionToSimple"
    :enable-reverse="true"
  />
</template>
<script setup lang="ts">
import { simpleToTradition, traditionToSimple } from 'chinese-simple2traditional';
const text = '这是简体中文。';
</script>
<style scoped lang="less"></style>
