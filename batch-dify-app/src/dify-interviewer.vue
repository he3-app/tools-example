<template>
  <h-single-layout mode="middle">
    <a-form >
      <a-form-item>
    <h2>{{ t("welcome") }}</h2>
      </a-form-item>
      <a-form-item label="岗位：" style="width: auto;">
        <h-select v-model:value="position" :save-options="{ autoSave: true, key: 'position' }" style="width: 100px;">
          <a-select-option value="前端">前端</a-select-option>
          <a-select-option value="后端">后端</a-select-option>
          <a-select-option value="运维">运维</a-select-option>
          <a-select-option value="运营">运营</a-select-option>
          <a-select-option value="产品经理">产品经理</a-select-option>
          <a-select-option value="测试">测试</a-select-option>
        </h-select>
        <span style="width: 20px; display: inline-block;"></span>
        <a-button @click="reset" type="primary">开始面试</a-button>
      </a-form-item>
    </a-form>
    <h-multiline-input v-model="text" :placeholder="placeholder" autofocus autoComplete style="height:auto" />
    <a-button @click="getAnswer" type="primary">
      {{ t("run") }}
    </a-button>
    <br>
    <br>
    <h2>{{ t("output") }}</h2>
    <h-multiline :value="res" :title="outputTitle" height="500px"/>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import messages from './dify-interviewer-lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const he3 = window.$he3;

const input = ref(t("input"));
const output = ref(t("output"));

const position = ref('前端');
const text = ref('');
const placeholder = ref(t("pleaseInput"));
const outputTitle = ref(t("outputTitle"))
const res = ref('');
const isMakingAnswer = ref<number>(0);
const conversation_id = ref('');

function reset() {
  conversation_id.value='';
  res.value =`面试官：\n您好！我是您的面试官，我将向您提出一些关于${position.value}职位的问题，以帮助您更好地了解自己。我会尊重您的时间，并尽可能地提出有意义的问题，以帮助您更好地了解自己。请放心，我们会尊重您的答案，并且不会有任何偏见。让我们开始吧！\n\n`; 
}

async function getAnswer() {
  if (isMakingAnswer.value === 1) {
    return;
  }
  isMakingAnswer.value = 1;
  try {
    let index = 1;
    // res.value = '';
    const xhr = new XMLHttpRequest();
    const url = 'https://api.test.he3.app/v1/langgenius/chat/interviewer';
    // xhr.responseType = "text";
    xhr.open('POST', url, true);
    const uid = await he3.getUserId();
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


    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.LOADING) {
        const res_str = this.responseText.trim()
        const res_arr = res_str.split(/\s*data:\s*/);
        if (conversation_id.value === '') {
          conversation_id.value = JSON.parse(res_arr[index])['conversation_id'];
        }
        // var start = false;
        while (index < res_arr.length) {
          var char = JSON.parse(res_arr[index])['answer'];
          if (char != '\n')
            res.value += char;
          index += 1;
        }
      }
      if (xhr.readyState === XMLHttpRequest.DONE) {
        isMakingAnswer.value = 0;
        res.value += '\n\n';
      }
    };


    const form = {
      "inputs": { "position": "前端" },
      "query": text.value,
      "response_mode": "streaming",
      "conversation_id": conversation_id.value,
      "user": "abc-123"
    }
    res.value += '你：\n' + text.value + '\n\n面试官：\n';
    xhr.send(JSON.stringify(form));

  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }
}

</script>
<style scoped></style>