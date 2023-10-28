<template>
  <h-single-layout :max-width="1440">
    <template #top>
      <div class="top">
        <p>
          {{ t('input_tip') }}
        </p>
        <h-input
          v-model:value="uuid"
          autofocus
          class="input"
          spellcheck="false"
          @change="parseUUID()"
          :autoFillInputCondition="isUUID"
        />
      </div>
    </template>
    <template #bottom>
      <div>
        <p>
          {{ t('result_tip') }}
        </p>
        <h-kv :value="outputValue" :width="600" />
      </div>
    </template>
  </h-single-layout>
</template>

<script setup lang="ts">
import { defineEmits, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { parse as uuidParse, version as uuidVersion, validate } from 'uuid';
import { isUUID } from '@he3-kit/utils';
import messages from './lang.json';
const $he3 = window.$he3;
const { t } = useI18n({
  locale: $he3.lang,
  messages,
});
type TOutput = {
  Content: string | null;
  'Standard String Format': string | null;
  Version: number | null;
  Variant: string | null;
  // 'Single Integer Value': number | null
};

const emit = defineEmits(['acceptClipboardCb']);

const uuid = ref<string>('10923e02-1161-465e-ad0b-0661d8b540af');

const outputValue = ref<TOutput>({
  Content: null,
  'Standard String Format': null,
  Version: null,
  Variant: null,
});

function parseUUID() {
  if (!validate(uuid.value)) {
    outputValue.value = {
      Content: null,
      'Standard String Format': null,
      Version: null,
      Variant: null,
    };
    return;
  }
  const bytes = uuidParse(uuid.value);
  outputValue.value = {
    'Standard String Format': `${uuid.value}`,
    Content: [...bytes]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join(':')
      .toUpperCase(),
    Version: uuidVersion(uuid.value),
    Variant: getVariant(uuid.value),
  };
}

function getVariant(uuid: string): string {
  const _N = Number.parseInt(uuid.split('-')[3][0], 16);
  if (_N <= 7) return 'reserved (NCS backward compatible)';
  if (_N <= 11) return 'DCE 1.1, ISO/IEC 11578:1996';
  if (_N <= 13) return 'reserved (Microsoft GUID)';
  if (_N === 14) return 'reserved (future use)';
  return 'unknown / invalid. Must end with "0"';
}

onMounted(() => {
  parseUUID();
});
</script>

<style scoped lang="less">
.wrap {
    height: 30%;
}
.top {
  height: inherit;
  .input {
    margin-bottom: 10px;
  }
}
</style>
