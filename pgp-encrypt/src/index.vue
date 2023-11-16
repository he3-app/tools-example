<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="encrypt">
      <h-multiline-input
        v-model="message"
        auto-select
        :title="t('encrypt.title.message')"
        class="message-input"
        :save-options="{autoSave: true, key: 'message'}"
      />
      <h-multiline-input v-model="publicKey" :title="t('encrypt.title.public')" :save-options="{autoSave: true, key: 'publicKey'}"/>
      <p class="encrypt-button">
        <a-button type="primary" @click="handleEncrypt">{{ t('encrypt.button') }}</a-button>
      </p>
      <h-multiline :title="t('encrypt.title.encrypted')" :value="encryptedMessage" />
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createMessage, encrypt, readKey } from 'openpgp';

import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_MESSAGE = 'A Free, Modern Toolbox, Built for Developers.';
const EXAMPLE_PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=9Zrd
-----END PGP PUBLIC KEY BLOCK-----
`;

// Initialize example data
onMounted(() => {
  handleEncrypt();
});

const message = ref(EXAMPLE_MESSAGE);
const publicKey = ref(EXAMPLE_PUBLIC_KEY);
const encryptedMessage = ref('');

function handleEncrypt() {
  encryptMessage(message.value, publicKey.value).then((encrypted) => {
    encryptedMessage.value = encrypted as string;
  });
}

async function encryptMessage(message: string, publicKey: string) {
  const encrypted = await encrypt({
    message: await createMessage({ text: message }),
    encryptionKeys: await readKey({ armoredKey: publicKey }),
  });
  return encrypted;
}
</script>

<style scoped lang="less">
.encrypt {
  .message-input {
    margin-bottom: 20px;
  }

  .encrypt-button {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
