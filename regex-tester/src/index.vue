<template>
  <h-single-layout mode="middle" :width="1280">
    <div class="regexTool">
      <div class="title">
        {{ t('RegularExpression') }}
        <a-button style="float: right" size="small" type="primary" @click="showModel">
          {{ t('RegexImage') }}
        </a-button>
      </div>

      <a-row class="regex" type="flex" :gutter="16">
        <a-col flex="auto">
          <h-input
            v-model:value="leftRegex"
            prefix="/"
            size="large"
            class="reg-input"
            :auto-select="true"
            :save-options="{key:'leftRegex', autoSave: true}"
          />
        </a-col>
        <a-col flex="300px">
          <h-select
            v-model:value="rightRegex"
            mode="multiple"
            size="large"
            style="width: 100%"
            option-label-prop="tag"
            :options="rightOptions"
            :save-options="{key:'right', autoSave: true}"
          >
            <template #option="{ tag, leftStr, rightStr }">
              {{ leftStr }}
              <strong>{{ tag }}</strong>
              {{ rightStr }}
            </template>
          </h-select>
        </a-col>
      </a-row>

      <a-divider />
      <h-highlight-input
        v-model="testStr"
        :title="t('TestString')"
        :highlight-text="matchArray"
        :regex-modifier="rightRegex.join('')"
      />
      <a-tabs
        v-model:activeKey="activeKey"
        @tabClick="replaceOutput = testStr.replace(reg, replaceInput)"
      >
        <a-tab-pane key="1" :tab="t('matchResult')">
          <h-multiline ref="resultRef" :title="t('result')" :value="matchResult" />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="t('replace')">
          <h-input v-model:value="replaceInput" size="large" class="reg-input" />
          <h-multiline :title="t('result')" :value="replaceOutput" />
        </a-tab-pane>
      </a-tabs>

      <a-modal
        :mask="mask"
        :width="width"
        :visible="previewVisible"
        :footer="null"
        @cancel="handleCancel"
      >
        <div ref="canvasRef" style="margin-top: 20px; max-height: 70vh; overflow: scroll" />
      </a-modal>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, reactive, ref, watch } from 'vue';
import visualRegex from 'visual-regex';
import { useI18n } from 'vue-i18n';
import { isRegExp } from '@he3-kit/utils';
import messages from './lang.json';
const $he3 = window.$he3;
const { t } = useI18n({
  locale: $he3.lang,
  messages,
});

const activeKey = ref('1');
// 正则
const leftRegex = ref(
  '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})'
);
const rightRegex = ref(['g', 'i']);
const rightOptions = reactive([
  {
    leftStr: '',
    rightStr: 'lobal',
    tag: 'g',
    value: 'g',
  },
  {
    leftStr: 'case ',
    rightStr: 'ntensive',
    tag: 'i',
    value: 'i',
  },
  {
    leftStr: '',
    rightStr: 'ultiline',
    tag: 'm',
    value: 'm',
  },
  {
    leftStr: '',
    rightStr: 'ingle line(dotall)',
    tag: 's',
    value: 's',
  },
  {
    leftStr: '',
    rightStr: 'nicode',
    tag: 'u',
    value: 'u',
  },
  {
    leftStr: 'stick',
    rightStr: 'ingle line(dotall)',
    tag: 'y',
    value: 'y',
  },
]);
// 测试文字
const testStr = ref('He3 is a free, modern developer toolbox. Check it out: https://he3.app');
// 正则图
const canvasRef = ref<HTMLElement | null>(null);
// 匹配结果
const matchResult = ref('');
const matchArray = reactive<string[]>([]);
const resultRef = ref();
let reg: RegExp;
const match = window._.debounce(() => {
  try {
    reg = new RegExp(leftRegex.value, rightRegex.value.join(''));
  } catch {
    $he3.message.error(t('wrongFormat'));
    return;
  }
  const results = testStr.value.match(reg);
  if (results) {
    matchResult.value = results.join('\n');
    matchArray.length = 0;
    // 这里需要去重，否则会出bug
    matchArray.push(...new Set(results));
  } else {
    matchResult.value = t('noMatch');
    matchArray.length = 0;
    resultRef.value.warnDisabled();
  }
}, 300);
watch([leftRegex, rightRegex, testStr], () => {
  match();
});
const mask = ref(false);
onMounted(() => {
  $he3.getLastClipboard().then((res) => {
    if (isRegExp(res)) {
      rightRegex.value.length = 0;
      const value = res.split('/');
      leftRegex.value = value[1];
      rightRegex.value.push(...value[2].split(''));
      $he3.onUseClipboardValue();
    }
  });
  match();
  previewVisible.value = false;
  mask.value = true;
});
const width = ref(0);
const previewVisible = ref(true);
const showModel = () => {
  // 绘图
  if (leftRegex.value.length <= 0) {
    $he3.message.warning(t('nothing'));
    return;
  }
  const visual = visualRegex(reg);
  const canvas = visual.visualCanvas();
  if (canvasRef.value?.hasChildNodes())
    canvasRef.value.removeChild(canvasRef.value.firstChild as HTMLElement);
  canvasRef.value?.appendChild(canvas);
  width.value = canvas.width + 60;
  previewVisible.value = true;
};
const handleCancel = () => {
  previewVisible.value = false;
};
// 替换
const replaceInput = ref('he3.app');
const replaceOutput = ref('');
watch(
  () => replaceInput.value,
  () => {
    replaceOutput.value = testStr.value.replace(reg, replaceInput.value);
  }
);
</script>
<style scoped lang="less">
@headerHeight: 30px;
.regexTool {
  overflow-x: hidden;
  .title {
    margin-bottom: 10px;
  }
  .regex {
    .reg-input {
      font-weight: 900;
      font-family: var(--code-font-family);
    }
  }
}
</style>
