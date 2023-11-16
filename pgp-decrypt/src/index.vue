<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="decrypt">
      <div>
        <h-multiline-input
          v-model="message"
          auto-select
          :title="t('decrypt.title.message')"
          class="message-input"
          :save-options="{ autoSave: true, key: 'message' }"
        />
        <h-multiline-input
          v-model="privateKey"
          :title="t('decrypt.title.private')"
          :save-options="{ autoSave: true, key: 'privateKey' }"
        />
      </div>
      <p class="decrypt-button">
        <a-space>
          {{ t('decrypt.title.passphrase') }}
          <h-input-password
            v-model:value="passphrase"
            type="password"
            class="passphrase-input"
            :save-options="{ autoSave: true, key: 'password' }"
          />
          <a-button type="primary" @click="handleDecrypt">
            {{ t('decrypt.button') }}
          </a-button>
        </a-space>
      </p>

      <h-multiline :title="t('decrypt.title.result')" :value="decryptedMessage" />
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { decrypt, decryptKey, readMessage, readPrivateKey } from 'openpgp';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_MESSAGE = `-----BEGIN PGP MESSAGE-----

wcFMA/dZnFcQvnSIARAAn+DmLHS/db0dz0HvJSUPIArt0PsqQxmVehUrJ/pV
8OLkeg4v6Mgbzgt+ydb7NS24eEzt8UaWvwQmUu2kPDPpq+IeaNFCFvD/Km/T
hOdUnNRB93kRiWseVOLxEJbwx4/7RBGZYIdRy1mOAcWiQ8E2R8kgo+/nizv0
RIpFI1Zp593RFT2LmOxT69GZu+WLusuRmz576O7tprBaqSrpk5XAgVx0FprW
w44VyP88nf5xy8NvVr7h+WhY6XjLdafpr54Luy1NTmi54088MHdkS5bAIEcP
zwU9b6oEPsg+o1A8xVWLxBvDQzn3ngZQIfU/Z4rRMiz2uxIEz3j1k+0VHyq7
yjAIEXmWij/mT+zbAlVKlcV3FCaBOXbcJrLLZnbBzO0K3dDbxqQaBKAZ1F0n
ew5+DvbZfNCdqA2s8UgVYu/P09WnYI/13dPEtDHb2K1GI7m0BLOVeE2z7il9
WiRTBmL46dJw/VUFfT8Io3K3Xxtrqjh+ROpBg3bSK5mIIIgzZrIMaJzi38l4
Wnj2D/XvbbPO5g9qTOU/l5bv/K6lF0jJNnOfoEo9JEQlQ6VjSuSRJ2YEzSh2
VRv8ELIwLrPtRBIiqUkHo7iKIGevJ/b1zxiNP8tVqhZD3vrSPg0G3TjuZX2S
ubEWhuO7tDWasOXyVoCgSFsbQL4uXB67XP65GBGPxEXSXgFIUcvXu5YnEUgc
vTVQB969OLCOYohhSfoQu1BS/TjMWqbylwHqG6B5n6jRgDeXUE81xf9L3aLX
WlDS/4ivLwSWDEfR06QO5a6v85ZSLDY9aljl9+cw+QTEdxuxkVQ=
=TGz9
-----END PGP MESSAGE-----
`;

const EXAMPLE_PRIVATE_KEY = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
6N83OVa8
=UZtZ
-----END PGP PRIVATE KEY BLOCK-----
`;
const EXAMPLE_PASSPHRASE = 'passphrase';

// Initialize example data
onMounted(() => {
  handleDecrypt();
});

const message = ref(EXAMPLE_MESSAGE);
const privateKey = ref(EXAMPLE_PRIVATE_KEY);
const passphrase = ref(EXAMPLE_PASSPHRASE);
const decryptedMessage = ref('');

function handleDecrypt() {
  decryptMessage(message.value, privateKey.value, passphrase.value).then((message) => {
    decryptedMessage.value = message as string;
  });
}

async function decryptMessage(message: string, privateKey: string, passphrase: string) {
  let pKey;
  try {
    if (passphrase !== '') {
      pKey = await decryptKey({
        privateKey: await readPrivateKey({ armoredKey: privateKey }),
        passphrase,
      });
    } else {
      pKey = await readPrivateKey({ armoredKey: privateKey });
    }
    const decrypted = await decrypt({
      message: await readMessage({ armoredMessage: message }),
      decryptionKeys: pKey,
    });
    return decrypted.data;
  } catch {
    return 'Decryption failed';
  }
}
</script>

<style scoped lang="less">
.decrypt {
  .message-input {
    margin-bottom: 20px;
  }

  .decrypt-button {
    margin-top: 10px;
    margin-bottom: 10px;

    .passphrase-input {
      width: 150px;
    }
  }
}
</style>
