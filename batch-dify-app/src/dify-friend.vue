<template>
  <h-single-layout mode="middle">
    <h2>{{ t("welcome") }}</h2>
    <h-multiline-input v-model="text" :placeholder="placeholder" autofocus style="height:auto"/>
    <a-button @click="getAnswer" type="primary">
      {{ t("run") }}
    </a-button>
    <br>
    <br>
    <h2>{{ t("output") }}</h2>
    <h-multiline :value="res" :title="outputTitle" style="height:auto"/>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import messages from './dify-friend-lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const he3 = window.$he3;

const input = ref(t("input"));
const output = ref(t("output"));

const text = ref('');
const placeholder = ref(t("pleaseInput"));
const outputTitle = ref(t("outputTitle"))
const res = ref('')
const isMakingAnswer = ref<number>(0);

async function getAnswer() {
  if (isMakingAnswer.value===1){
    return;
  }
  isMakingAnswer.value = 1;
  try {
    let index = 1;
    res.value = '';
    const xhr = new XMLHttpRequest();
    const url = 'https://api.test.he3.app/v1/langgenius/completion/friend';
    // const url = 'http://127.0.0.1:8080/v1/langgenius/completion/friend';
    const uid = await he3.getUserId();
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('UID', uid);

    xhr.onload = function () {
      console.log('Request completed...');
      if (xhr.status != 200) {
        if (xhr.status === 403) {
          window.alert("Error: Request time exceed limit");
        } else {
          window.alert("Error: " + xhr.statusText);
        }
      }
    };
    xhr.onerror = () => {
      console.error('Request error:', xhr.statusText);
    };

    var start = false;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.LOADING) {
        const res_str = this.responseText.trim()
        const res_arr = res_str.split(/\s*data:\s*/);
        while (index < res_arr.length) {
          var char = JSON.parse(res_arr[index])['answer'];
          if (char != '\n' || start) {
            res.value += char;
            start = true;
          }
          index += 1;
        }
      }
      if (xhr.readyState === XMLHttpRequest.DONE) {
        isMakingAnswer.value = 0;
      }
    };

    const form = JSON.stringify({ "inputs": {}, "query": text.value+"。", "response_mode": "streaming", "user": "abc_123" })
    console.log(form);
    xhr.send(form);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }
}

</script>
<style scoped></style>