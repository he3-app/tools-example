<template>
  <h-text-transform ref="transformRef" :sample-data="EXAMPLE_BASE64_STRING" :transform="transform">
    <template #option>
      <div class="option">
        <span class="result-opt">
          <span class="opt">{{ t('delimiter_tip') }}</span>
          <span class="opt">
            <h-select v-model:value="delimiter" size="small" @change="handleChange" :save-options="{key:'delimiter', autoSave: true}">
              <a-select-option :value="''">({{ t('delimiter_empty') }})</a-select-option>
              <a-select-option :value="':'">{{ t('delimiter_colon') }}(:)</a-select-option>
              <a-select-option :value="' '">{{ t('delimiter_space') }}({{ ' ' }})</a-select-option>
              <a-select-option :value="'-'">{{ t('delimiter_hyphen') }}(-)</a-select-option>
            </h-select>
          </span>
          <span class="opt">
            <h-radio v-model:value="resultCase" size="small" @change="handleChange"         
            :save-options="{key:'case', autoSave: true}">
              <a-radio-button value="lower">
                {{ t('lower_case') }}
              </a-radio-button>
              <a-radio-button value="upper">
                {{ t('upper_case') }}
              </a-radio-button>
            </h-radio>
          </span>
        </span>
      </div>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { Buffer } from 'buffer';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_BASE64_STRING = 'H8BRh8j48O9oYatfu5AZzq6A9RINhZO5H16dQZngK7T62em8MUt1FLm52t+eX6xO';
const delimiter = ref('');
const resultCase = ref('lower');

const transformRef = ref();
const handleChange = () => {
  transformRef.value.handleChange();
};

function transform(inputValue: string) {
  let res = Buffer.from(inputValue, 'base64').toString('hex');
  if (delimiter.value != '' && res.length > 2) {
    const arr = [];
    for (let index = 0; index < res.length; index += 2) {
      arr.push(res.slice(index, index + 2));
    }
    res = arr.join(delimiter.value);
  }
  if (resultCase.value === 'upper') res = res.toUpperCase();
  return res;
}
</script>

<style scoped lang="less">
.option {
  margin: 20px 0px;
  height: 30px;
  .result-opt {
    float: right;
    .opt {
      margin-left: 10px;
    }
  }
}
</style>
