<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="verify">
      <div class="verify-signed-message">
        <h-multiline-input
          v-model="signedMessage"
          autoSelect
          autofocus
          :title="t('verify.title.message')"
          :save-options="{ autoSave: true, key: 'signedMessage' }"
        />
      </div>
      <div class="verify-public-key">
        <h-multiline-input
          v-model="publicKey"
          :title="t('verify.title.public')"
          :save-options="{ autoSave: true, key: 'publicKey' }"
        />
      </div>

      <div class="verify-button">
        <a-button type="primary" @click="handleVerify">
          {{ t('verify.button') }}
        </a-button>
      </div>
      <div>
        <a-alert v-show="showMsg" :message="alertMessage" :type="alertType" />
        <h-multiline :title="t('verify.title.result')" :value="originalMessage" />
      </div>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { readKey, readMessage, verify } from 'openpgp';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=+Gil
-----END PGP PUBLIC KEY BLOCK-----
`;
const EXAMPLE_SIGNED_MESSAGE = `-----BEGIN PGP MESSAGE-----

xA0DAQgB0PNX6qpVi5UByzN1AGNh1/NBIEZyZWUsIE1vZGVybiBUb29sYm94
LCBCdWlsdCBmb3IgRGV2ZWxvcGVycy7CwXMEAQEIACcFAmNh1/MJENDzV+qq
VYuVFiEE8BE9rBX/PWoUqkEo0PNX6qpVi5UAAKkrD/0VplQMsVotYa1soa3P
Pm55KKs4S8l05JleBIu04yi4u0wvjeyG8Fcw7jru2arKx3u7reBHA+sza5sr
mviTlCeO5FnMxaV+5v3/oaFazAhPXd+fnd2gbiD+alNPVl4baMMfTKNRwmAi
RDL5VcYR+yfO45LjUJnXw3OkFVuomBCt4yBJ5BSu38A7rUbw8FKKDK5hD9S+
T1RnvhjF6S8oAPHf3E9HTZ7MFb1VY3lsczNaZeImg7Fip1xytm0VeAhD+tL5
XoPqRGE7zqh5iU2kuKLuR1Of8G+3X3PgUsfUpBJy6Zu74NUyQuP3ote+Jp8f
a5PfeiUgrkghd6kiBrSKjGckx/TVlw8aPMVUe6w+QFV0euzpIqU14RvFMaSN
40pYcx+jt5H1s+EFw41SFBhBvybNv7r3HqmXfjcSfT8wynkfpdA/kU7YULD9
oM+XgDNPjwZdkI398cAdBqvrXRKszJs9TkPH82S3M+OWj/UEHpYGo8G0ppk0
3Ag1pCz/VjQ7uJymGRs2x9iHF5sO/bXiutVhIUmvtTsSDnQw4NSHpicUvfsg
DdKJC8wFe0H/JhQTFSOZRbLaub1jR4kGD88qhlGLwQ8STiNYBE5jXOrFN+nV
lWOqZc7aXrSwfyXnGBbGgApptLUKCQbem7iPR+jEMVUgxAeYnW96SdAbJUh9
JSj7Og==
=Avpk
-----END PGP MESSAGE-----
`;

const publicKey = ref(EXAMPLE_PUBLIC_KEY);
const signedMessage = ref(EXAMPLE_SIGNED_MESSAGE);
const originalMessage = ref('');
const alertMessage = ref('');
const alertType = ref<'success' | 'error'>('success');
const showMsg = ref(false);

onMounted(() => {
  handleVerify();
});

function handleVerify() {
  verifySignature(publicKey.value, signedMessage.value)
    .then((oMsg) => {
      showMsg.value = true;
      if (oMsg === '') {
        alertType.value = 'error';
        alertMessage.value = t('verify.message.fail');
      } else {
        alertType.value = 'success';
        alertMessage.value = t('verify.message.success');
      }
      originalMessage.value = oMsg;
    })
    .catch(() => {
      alertType.value = 'error';
      alertMessage.value = t('verify.message.fail');
    });
}

async function verifySignature(publickKeyArmored: string, signedMessage: string): Promise<string> {
  const publickKey = await readKey({
    armoredKey: publickKeyArmored,
  });
  const theMessage = await readMessage({
    armoredMessage: signedMessage,
  });
  const verificationResult = await verify({
    message: theMessage,
    verificationKeys: publickKey,
  });
  const { verified, keyID } = verificationResult.signatures[0];

  try {
    await verified;
    return verificationResult.data as string;
  } catch (e) {
    return '';
  }
}
</script>
<style scoped lang="less">
.verify {
  .verify-signed-message {
    margin-bottom: 10px;
  }
  .verify-button {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
