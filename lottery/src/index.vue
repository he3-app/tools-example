<template>
  <h-single-layout mode="middle" :width="1280">
    <div>
      <h-multiline-input v-model="input" auto-select :save-options="{autoSave: true, key: 'lottery-h-multiline-input'}" :title="t(`input`)" />
      <p>{{ t('select') }}</p>
      <a-space>
        <h-number-input v-model:value="count" min="1" :save-options="{autoSave:true,key:'count'}"/>
        <a-button type="primary" @click="lottery()">{{ t(`lottery`) }}</a-button>
      </a-space>
      <h-multiline :value="result" :title="t(`resultText`)" />
    </div>
  </h-single-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const input = ref('peace\nlove\nhappiness\nhealth');
const count = ref(1);
const result = ref('');
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
function lottery() {
  let inputArr = input.value.split('\n');
  inputArr = inputArr.filter((item) => {
    return item.length > 0;
  });
  const resultArr = [];
  for (let i = 0; i < count.value; i++) {
    const c = Math.floor(Math.random() * inputArr.length);
    resultArr.push(inputArr[c]);
    inputArr.splice(c, 1);
  }
  result.value = resultArr.join('\n');
}
</script>
