<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="sign">
      <div class="sign-message">
        <h-multiline-input
          v-model="message"
          auto-select
          :title="t('sign.title.message')"
          :save-options="{ autoSave: true, key: 'message' }"
        />
      </div>

      <div class="sign-private-key">
        <h-multiline-input
          v-model="privateKey"
          :title="t('sign.title.private')"
          :save-options="{ autoSave: true, key: 'privateKey' }"
        />
      </div>

      <div class="option">
        <a-space>
          {{ t('sign.title.passphrase') }}
          <h-input-password
            v-model:value="passphrase"
            type="password"
            class="passphrase-input"
            :save-options="{ autoSave: true, key: 'password' }"
          />
          <a-button type="primary" @click="handleSign">
            {{ t('sign.button') }}
          </a-button>
        </a-space>
      </div>
      <div>
        <h-multiline :title="t('sign.title.result')" :value="signedMessage" />
      </div>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createMessage, decryptKey, readPrivateKey, sign } from 'openpgp';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_PRIVATE_KEY = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
6MDORLGs
=7sgp
-----END PGP PRIVATE KEY BLOCK-----
`;
const EXAMPLE_PASSPHRASE = `passphrase`;
const EXAMPLE_MESSAGE = 'A Free, Modern Toolbox, Built for Developers.';

const privateKey = ref(EXAMPLE_PRIVATE_KEY);
const passphrase = ref(EXAMPLE_PASSPHRASE);
const message = ref(EXAMPLE_MESSAGE);
const signedMessage = ref('');

onMounted(() => {
  handleSign();
});

async function handleSign() {
  const dPrivateKey = await decryptKey({
    privateKey: await readPrivateKey({
      armoredKey: privateKey.value,
    }),
    passphrase: passphrase.value,
  });
  // Use this method to get the result with the clear original text
  //   const unsignedMessage = await createCleartextMessage({
  //     text: message.value,
  //   })
  const unsignedMessage = await createMessage({
    text: message.value,
  });
  const cleartextMessage = await sign({
    message: unsignedMessage,
    signingKeys: dPrivateKey,
  });

  signedMessage.value = cleartextMessage as string;
}
</script>

<style scoped lang="less">
.sign {
  .option {
    margin-top: 20px;
  }

  .sign-message {
    margin-bottom: 10px;
  }
  .passphrase-input {
    width: 150px;
  }
}
</style>
