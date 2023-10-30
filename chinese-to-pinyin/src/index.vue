<script setup lang='ts'>
import { ref } from 'vue';
import 'animate.css';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import pinyin from 'pinyin';
import { IPinyinStyle } from 'pinyin/lib/declare';
import JsonViewer from 'vue-json-viewer';


const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const styleOptions = ref([
  {
    'label': t('styleOptions.normal'),
    'value': 'normal',
  },
  {
    'label': t('styleOptions.tone'),
    'value': 'tone',
  },
  {
    'label': t('styleOptions.tone2'),
    'value': 'tone2',
  },
  {
    'label': t('styleOptions.to3ne'),
    'value': 'to3ne',
  },
  {
    'label': t('styleOptions.initials'),
    'value': 'initials',
  },
  {
    'label': t('styleOptions.first_letter'),
    'value': 'first_letter',
  },
]);

const chosenStyle = ref<IPinyinStyle>('normal');


const isSegment = ref(false);  // 分词
const isGroup = ref(false);  // 词组
const isCompact = ref(false);
const isHeteronym = ref(false); // 是否启用多音字
const isSurname = ref(false); //  姓氏模式，优先使用姓氏的拼音。

const json = ref<string[][]>();
function transform(inputValue: string) {
  json.value = pinyin(inputValue, {
    style: chosenStyle.value,
    mode: isSurname.value ? 'surname' : 'normal',
    segment: isSegment.value ? 'segmentit' : false,
    group: isGroup.value,
    compact: isCompact.value,
    heteronym: isHeteronym.value,
  })
  return json.value.map(strArray => strArray.join(',')).join(' ');
}

const transformRef = ref();
const handleChange = () => {
  transformRef.value.handleChange();
};

</script>

<template>
  <h-text-transform ref='transformRef' :transform='transform'>
    <template #option>
      <a-form>
        <a-form-item :label='t("outputStyle")'>
          <a-radio-group v-model:value='chosenStyle' :options='styleOptions' @change='handleChange' />
        </a-form-item>
        <a-form-item :label='t("outputMode")'>
          <a-checkbox v-model:checked='isSegment' @change='handleChange'>{{ t('segment') }}</a-checkbox>
          <a-checkbox v-model:checked='isGroup' @change='handleChange'>{{ t('group') }}</a-checkbox>
          <a-checkbox v-model:checked='isCompact' @change='handleChange'>{{ t('compact') }}</a-checkbox>
          <a-checkbox v-model:checked='isHeteronym' @change='handleChange'>{{ t('heteronym') }}</a-checkbox>
          <a-checkbox v-model:checked='isSurname' @change='handleChange'>{{ t('surnameMode') }}</a-checkbox>
        </a-form-item>
      </a-form>
      <json-viewer class='json-view' :value='json' :expand-depth='5' />
    </template>
  </h-text-transform>

</template>

<style scoped lang='less'>
[mode='dark'] .json-view {
  --bg-color: #3E4252;
}

.json-view {
  --bg-color: #f4f8fb;

  width: 100%;
  height: 220px;
  overflow-y: auto;
  background-color: var(--bg-color);
  border-radius: 8px;
}
</style>
