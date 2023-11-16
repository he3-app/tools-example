<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="generator">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" size="small" compact>
        <a-form-item
          v-if="
            privateKeyFormat === 'OpenSSH' ||
            privateKeyFormat === 'Putty' ||
            privateKeyFormat === 'Pem'
          "
          :label="t('private.passphrase')"
        >
          <h-input-password
            v-model:value="passphrase"
            @change="debouncedGenerate"
            :save-options="{ autoSave: true, key: 'password' }"
          />
        </a-form-item>

        <a-collapse ghost class="collapse">
          <a-collapse-panel :header="t('advance')">
            <a-form-item :label="t('keyLength')">
              <h-radio
                v-model:value="bits"
                :options="bitsOptions"
                @change="handleGenerate"
                :save-options="{ autoSave: true, key: 'bits' }"
              />
            </a-form-item>

            <a-form-item :label="t('private.format')">
              <h-radio
                v-model:value="privateKeyFormat"
                :options="privateKeyFormatOptions"
                @change="handleGenerate"
                :save-options="{ autoSave: true, key: 'privateKeyFormat' }"
              />
            </a-form-item>

            <a-form-item v-if="privateKeyFormat === 'Putty'" :label="t('private.comment')">
              <a-input v-model:value="privateKeyComment" @change="debouncedGenerate" />
            </a-form-item>

            <a-form-item :label="t('public.format')">
              <h-radio
                v-model:value="publicKeyFormat"
                :options="publicKeyFormatOptions"
                @change="handleGenerate"
                :save-options="{ autoSave: true, key: 'publicKeyFormat' }"
              />
            </a-form-item>

            <a-form-item v-if="publicKeyFormat === 'OpenSSH'" :label="t('public.comment')">
              <a-input v-model:value="publicKeyComment" @change="debouncedGenerate" />
            </a-form-item>
          </a-collapse-panel>
        </a-collapse>

        <a-form-item :wrapper-col="{ offset: 8, span: 12 }">
          <a-button type="primary" @click="handleGenerate">
            {{ t('generate') }}
          </a-button>
        </a-form-item>
      </a-form>

      <h-multiline :value="publicKey" :title="t('public.result')" />
      <h-multiline :value="privateKey" :title="t('private.result')" />
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateRSAKeyPair } from './rsa';

import messages from './lang.json';
const $he3 = window.$he3;
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const PEM_LENGTH_PER_LINE = 72;
const privateKey = ref('');
const publicKey = ref('');
// const alg = ref('rsa')
// const algOptions = ref<RadioGroupProps['options']>([
//   {
//     label: 'RSA',
//     value: 'rsa',
//   },
// ])
const bits = ref(2048);
const bitsOptions = ref([
  { label: '1024', value: 1024 },
  { label: '2048', value: 2048 },
  { label: '4096', value: 4096 },
]);
const privateKeyFormat = ref('OpenSSH');
const privateKeyFormatOptions = ref([
  {
    label: 'OpenSSH',
    value: 'OpenSSH',
  },
  {
    label: 'Putty',
    value: 'Putty',
  },
  {
    label: 'PEM',
    value: 'Pem',
  },
]);
const passphrase = ref('');
const privateKeyComment = ref('');
const publicKeyFormat = ref('OpenSSH');
const publicKeyFormatOptions = ref([
  {
    label: 'OpenSSH',
    value: 'OpenSSH',
  },
  {
    label: 'PEM',
    value: 'Pem',
  },
]);
const publicKeyComment = ref('');

const debouncedGenerate = _.debounce(() => {
  handleGenerate();
}, 500);

function handleGenerate() {
  generateRSAKeyPair({
    keySize: bits.value,
    privateKeyFormat: privateKeyFormat.value,
    publicKeyFormat: publicKeyFormat.value,
    passphrase: passphrase.value,
    privateKeyComment: privateKeyComment.value,
    publicKeyComment: publicKeyComment.value,
    pemCharPerLine: PEM_LENGTH_PER_LINE,
  }).then((res: any) => {
    privateKey.value = res.privateKey;
    publicKey.value = res.publicKey;
  });
}

handleGenerate();
</script>

<style scoped lang="less">
.generator {
  label {
    margin-left: 10px;
    margin-right: 10px;
  }

  :deep(.ant-collapse-header) {
    margin: 0 0 0 25%;
    padding: 0;
  }

  :deep(.ant-collapse-content-box) {
    padding: 0;
  }
}
</style>
