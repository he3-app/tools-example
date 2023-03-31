<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="generator">
      <div class="generator-input">
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" size="small">
          <a-form-item
            :label="t('generator.label.username')"
            name="username"
            :rules="[
              {
                required: true,
                message: t('generator.prompt.username'),
              },
            ]"
          >
            <a-input v-model:value="userName" :placeholder="t('generator.placeholder.username')" />
          </a-form-item>

          <a-form-item
            :label="t('generator.label.email')"
            name="email"
            :rules="[
              {
                required: true,
                message: t('generator.prompt.email'),
              },
            ]"
          >
            <a-input v-model:value="email" :placeholder="t('generator.placeholder.email')" />
          </a-form-item>

          <a-form-item
            :label="t('generator.label.comment')"
            name="comment"
            :rules="[
              {
                required: false,
              },
            ]"
          >
            <a-input v-model:value="comment" :placeholder="t('generator.placeholder.comment')" />
          </a-form-item>
          <a-form-item :label="t('generator.label.algorithm')">
            <h-radio
              v-model:value="algorithm"
              :options="algorithmOptions"
              option-type="button"
              :save-options="{autoSave: true,key:'pgp-key-pair-generator-algorithm'}"
            />
          </a-form-item>
          <a-form-item v-if="algorithm === 'rsa'" :label="t('generator.label.bits')">
            <h-radio v-model:value="keySize" :options="keySizeOptions" :save-options="{autoSave: true,key:'keySize'}"/>
          </a-form-item>

          <a-form-item :label="t('generator.label.expiration')">
            <h-radio v-model:value="expirationTime" :options="expirationTimeOptions" :save-options="{autoSave: true,key:'expirationTime'}"/>
          </a-form-item>
          <a-form-item
            :label="t('generator.label.passphrase')"
            name="passphrase"
            :rules="[
              {
                required: true,
                message: t('generator.prompt.passphrase'),
              },
            ]"
          >
            <a-input-password
              v-model:value="passphrase"
              :placeholder="t('generator.placeholder.passphrase')"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
            <a-button type="primary" @click="handleGenerate">
              {{ t('generator.generate') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-row class="generator-output" :gutter="16">
        <a-col :span="12">
          <a-spin :spinning="resultSpinning">
            <h-multiline
              :title="t('generator.output.private')"
              :value="privateKey"
              class="output"
            />
          </a-spin>
        </a-col>
        <a-col :span="12">
          <a-spin :spinning="resultSpinning">
            <h-multiline :title="t('generator.output.public')" :value="publicKey" class="output" />
          </a-spin>
        </a-col>
      </a-row>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { generateKey } from 'openpgp';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import type { EllipticCurveName } from 'openpgp';

const $he3 = window.$he3;

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const resultSpinning = ref<boolean>(false);

const ALGORITHMS_OPTIONS = [
  {
    value: 'rsa',
    label: t('generator.alg.rsa'),
  },
  {
    value: 'ecc',
    label: t('generator.alg.ecc'),
  },
];
const RSA_KEY_SIZE_OPTIONS = [
  {
    value: 2048,
    label: t('generator.bits.b2k'),
  },
  {
    value: 4096,
    label: t('generator.bits.b4k'),
  },
  {
    value: 8192,
    label: t('generator.bits.b8k'),
  },
];
const EXPIRATION_TIME_OPTIONS = [
  {
    value: 0,
    label: t('generator.expiration.never'),
  },
  {
    value: 1,
    label: t('generator.expiration.y1'),
  },
  {
    value: 2,
    label: t('generator.expiration.y2'),
  },
  {
    value: 4,
    label: t('generator.expiration.y4'),
  },
  {
    value: 8,
    label: t('generator.expiration.y8'),
  },
];
const DEFAULT_CURVE = 'curve25519';
const SECONDS_OF_A_YEAR = 60 * 60 * 24 * 365;

// Initialize example data
onMounted(() => {
  userName.value = 'he3';
  email.value = 'he3@example.com';
  algorithmOptions.value = ALGORITHMS_OPTIONS;
  algorithm.value = 'rsa';
  keySizeOptions.value = RSA_KEY_SIZE_OPTIONS;
  keySize.value = 4096;
  expirationTimeOptions.value = EXPIRATION_TIME_OPTIONS;
  expirationTime.value = 0;
  passphrase.value = 'passphrase';
  handleGenerate();
});

// Input values
const userName = ref('');
const email = ref('');
const comment = ref('');
const algorithm = ref<'ecc' | 'rsa'>('rsa');
const algorithmOptions = ref<{ value: string; label: string }[]>([]);
const keySize = ref(0);
const keySizeOptions = ref<{ value: number; label: string }[]>([]);
const expirationTime = ref(0);
const expirationTimeOptions = ref<{ value: number; label: string }[]>([]);
const passphrase = ref('');
// Output values
const publicKey = ref('');
const privateKey = ref('');

function handleGenerate() {
  resultSpinning.value = true;
  publicKey.value = '';
  privateKey.value = '';

  generateKeyPair(
    algorithm.value,
    DEFAULT_CURVE,
    userName.value,
    email.value,
    comment.value,
    passphrase.value,
    keySize.value,
    expirationTime.value * SECONDS_OF_A_YEAR
  ).then((keyObj) => {
    publicKey.value = keyObj.armoredPublicKey;
    privateKey.value = keyObj.armoredPrivateKey;
    resultSpinning.value = false;
  });
}

async function generateKeyPair(
  algorithm: 'ecc' | 'rsa',
  curve: EllipticCurveName,
  username: string,
  email: string,
  comment: string,
  passphrase: string,
  rsaBits: number,
  expirationTime: number
): Promise<{
  armoredPrivateKey: string;
  armoredPublicKey: string;
  revocationCertificate: string;
}> {
  const { privateKey, publicKey, revocationCertificate } = await generateKey({
    type: algorithm,
    curve,
    userIDs: [{ name: username, email, comment }],
    passphrase,
    rsaBits,
    keyExpirationTime: expirationTime,
    format: 'armored',
  });

  return {
    armoredPrivateKey: privateKey,
    armoredPublicKey: publicKey,
    revocationCertificate,
  };
}
</script>

<style scoped lang="less">
.generator {
  .output {
    margin-top: 0;
  }

  .ant-form-item {
    margin-bottom: 10px;
  }
}
</style>
