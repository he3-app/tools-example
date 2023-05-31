<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="jwt-generate">
      <div class="top">
        <div class="left">
          <div class="header">{{ t('InputPayload') }}</div>
          <div class="content">
            <h-kv-input :model-value="payload" mode="list" @change="handleChange" />
          </div>
        </div>
        <div class="right">
          <div class="header">
            {{ t('preview') }}
          </div>
          <div class="content">
            <a-textarea :value="payload" />
          </div>
        </div>
      </div>
      <a-divider />
      <div>
        <a-space>
          <div>{{ t('Algorithm') }}:</div>
          <h-radio v-model:value="algorithm" :save-options="{key:'algorithm', autoSave: true}">
            <a-radio-button v-for="item in symOptions" :key="item" :value="item">
              {{ item }}
            </a-radio-button>
          </h-radio>
          {{ t('more') }}:
          <h-select style="width: 200px" @change="handleSelectChange" :save-options="{key:'asymOptions', autoSave: true}">
            <a-select-option v-for="item in asymOptions" :key="item" :value="item" />
          </h-select>
        </a-space>
      </div>
      <div v-show="isSym" class="secretKey symSecret">
        <a-space>
          <div>{{ t('SecretKey') }}:</div>
          <a-input-password v-model:value="secretKey" placeholder="please input secret Key" />
        </a-space>
      </div>

      <div v-show="!isSym" class="asymSecret">
        <div class="secretKey">
          <h-multiline-input v-model="secretKey" autofocus :title="t('privateKey')" />
        </div>
        <div class="secretKey">
          <h-multiline-input v-model="publicSecretKey" autofocus :title="t('publicKey')" />
        </div>
      </div>
      <h-multiline :value="jwtResult" :title="t('result_tip')" />
    </div>
  </h-single-layout>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Algorithms, defaultTokens } from './const';

import messages from './lang.json';

const $he3 = window.$he3;

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const payload = ref('');
const secretKey = ref(`text secretKey`);
const publicSecretKey = ref('');
const asymSelect = ref();
const algorithm = ref(Algorithms.HS256);
const isSym = ref<boolean>(true);
const jwtResult = ref("");

const symOptions = computed(() => {
  const res = [];
  for (const key in defaultTokens) {
    if (!key.includes('HS')) continue;
    res.push(key);
  }
  return res;
});

const asymOptions = computed(() => {
  const res = [];
  for (const key in defaultTokens) {
    if (key.includes('HS')) continue;
    res.push(key);
  }
  return res;
});

watch([payload, secretKey, algorithm] ,  _.debounce(async () => {
    const res = await $he3.cloudFun('getJwtToken', {
        payload: payload.value,
        secretOrPrivateKey: secretKey.value,
        options: {
            algorithm: algorithm.value,
        }
    })
    jwtResult.value = res;
}, 500))

watch(algorithm, (value) => {
  if (value.includes('HS')) {
    isSym.value = true;
    secretKey.value = defaultTokens[value].secret as string;
  } else {
    isSym.value = false;
    secretKey.value = defaultTokens[value].privateKey as string;
    publicSecretKey.value = defaultTokens[value].publicKey as string;
  }
});

// 处理非对称加密
function handleSelectChange(x: Algorithms) {
  algorithm.value = x;
}

function handleChange(obj: Record<string, string>[]) {
  const mergeResult = obj.reduce((total, cur, index) => {
    if (cur.key === '') {
      return total;
    }

    return Object.assign(total, {
      [cur.key]: isNaN(cur.value) ? cur.value : Number.parseInt(cur.value),
    });
  }, {});
  payload.value = JSON.stringify(mergeResult, null, 4);
}
</script>

<style lang="less" scoped>
@label-font-weight: 700;
@header-height: 36px;
.jwt-generate {
  .top {
    display: flex;
    height: 60%;

    .right,
    .left {
      flex: 1;

      .header {
        font-weight: @label-font-weight;
        margin-bottom: 10px;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      margin-left: 10px;

      .content {
        height: 100% - 40px;
        box-sizing: border-box;
        flex: 1;

        textarea {
          height: 100%;
        }
      }
    }
  }

  .option {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

.secretKey {
  margin-top: 10px;
}

.symSecret {
  display: flex;
}

.asymSecret {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 10px;
}
</style>
