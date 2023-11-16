<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="PrivateToPublic">
      <h-multiline-input
        v-model="input"
        auto-select
        :title="t('private')"
        :save-options="{ autoSave: true, key: 'input' }"
      />
      <p>{{ t('passphrase') }}</p>
      <h-input-password
        v-model:value="passphrase"
        :save-options="{ autoSave: true, key: 'password' }"
      />
      <a-button type="primary" @click="handleClick">
        {{ t('button') }}
      </a-button>
      <h-multiline :value="output" :title="t('public')" />
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_PRIVATE_KEY = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFHzBJBgkqhkiG9w0BBQ0wPDAbBgkqhkiG9w0BBQwwDgQIcPBKCg1e+L0CAggA
MB0GCWCGSAFlAwQBAgQQ+iab0MLadNZsGPRx5V4fogSCBNDR3iAFugFWE5aGigBs
eYi2F9b+4qpf+/O3RUICsP21VZM+wmUqohY60hHeozJ0uOKRPbq+Ou9S0Zf/EmoL
uHLv5vYZdWlmPDwztrU5c1PJ5KGFQJrF+/DZclOKoO0qsCyh0bIvyYKfFGyu0atT
PrjsMe3uU3BMFFuFBrJzdm1UGWr5vqOP0xfjHK/FN0rBEQhOyIAgXa2tJXOpDcxN
mtyUqgyxek0Ci7xWzbmbLXzc0mXNq46arJ8+wRISxNT6srTwvjYzNJWmNH63sqsu
nMrtpxnB1UJyxiMF9nXDs3NcqZVjBo/IyL6E7qx9pEpS3IoAMMXS1H3hP7aouYzn
8EtMjOBcg3PYPzKr8i6MBKhNVfNLHxkbABKMp8x3ot++fXfvQa0x29KwddBnrTaD
U+TQxq85PkzsSRXqU/fAf6Tw6xGpx4j/Exi/TnpN4vSDWzf8Me0aR5l1Zkq6KUYE
QUg+7bBUnUEWFAbe3+5KS0wWCziWpAdaF0RcsjcojwBq4mTHz5Q6FnypNFDxV3xs
3G/27m/niVXnEFLmHGDz2UZBswZgtleyYURc9fsz+8RdS1rXMFlbrQcpbX+xNE0T
WlEhTT5bAuJmI/Syo2TOVUiqsiJ/Y92pMj0xJA34pCXI3iAeSq4g/lLfPB0Nb8I9
dP4QL5jcR81JCaJLu78Gmk3ECtg7NPTra1v8qJXvirNDq6nq6d1r0A10DwLbAeb5
XZLTPk4nXR5cVKr84NwqUkW/aHWrPCI/+EIMQWviaIBX4pxqgehBzDy6oqkqVC79
ikpSCrqOwUHVwuIUlu50pn14zfw22cCU8KMPa71BIk2206x2uKfPRtg9xCoYZ5Ws
V8kZhTCcgt1fvoUlNR2OuxuAqIxIiMsK2ttBopDmfoxM2BqD9zsA91ERfZMaYOP/
urGcQjWLJBHQWUTDfcjLh29KR8eBgf8QxFoIUnytjCTgQKW1e9MbO+gT0gJtcmBg
6Cf+nMnkV++1fcPVDrqeIJTnM18IramDZxsCGLoc1U4iiwKi3g6Kx8zJfixYDXXP
rRpSpOBoX6/s2YtChho+/uF5Zvp0lv4297k+7IaNCA6kHXnMaK8GAfA7SpBCCvSi
p8TICSK2Z5SLDilsFMNoA6M/cys42WObd/Azklfs8UYiotrco5a6B/0maP2MqQQS
C3RQJK3z1KnfDOZeA393O3hpMV4ncUIG95P3c6DWcJovbcAJ3hiqw+/CQhshS5z9
kQqTe8geIpchygga9xw/vC+HtHNQY/f+nfaLObyMs/Co1t81QxbyIuTlnZUL6mNl
y9jcNTgN6loYdgJFYTaAgq4tI+ZOCaNvBobGyZCfbOGVLpzIh8wdqxe03DVIAAp6
MmkjNQar4Twuyorx0DFk4rrZZD57uDrdJ0dk/rf9Ht861vxuIRhkDzr6Sdrmu8Cc
f1033uEeY9oP1HsX7VvBFUQYnZrNa0KJJXkkdAv2x7XhOzjLlVNoFLrZEvF+kMvc
xSKJ6KrY843zrMwCnOS5m7wKhrW4+w1pUwMAgBYe9uHJqNxaGni6JECJYpmPnL+y
YMAfXgieO7BBOFVxcI5JBMCW3EQBCCoLN8VfrkXGoURYM61+91kEewXsSh/eTHgc
RksBi4Exr/KC+LN+M0os0MATBw==
-----END ENCRYPTED PRIVATE KEY-----
`;
const EXAMPLE_PASSPHRASE = 'passphrase';

const input = ref(EXAMPLE_PRIVATE_KEY);
const output = ref('');
const passphrase = ref(EXAMPLE_PASSPHRASE);

handleClick();

function handleClick() {
  window.$he3
    .getRSAPublicKeyFromPrivateKey(input.value, passphrase.value)
    .then((res) => {
      output.value = res;
    })
    .catch((reason) => {
      window.$he3.message.error(reason);
    });
}
</script>
<style scoped lang="less">
.PrivateToPublic {
  p {
    margin-top: 10px;
  }

  .ant-input {
    margin-top: 10px;
  }

  .ant-btn {
    margin-top: 10px;
  }
}
</style>
