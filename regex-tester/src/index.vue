<template>
  <h-single-layout mode="middle" :width="1280">
    <div @click="showReference = false" class="regexTool">
      <div class="title">
        {{ t("RegularExpression") }}

        <a-button
          style="float: right"
          size="small"
          type="primary"
          @click="showModel"
        >
          {{ t("RegexImage") }}
        </a-button>
        <a-button
          class="reference-button"
          style="float: right"
          size="small"
          type="primary"
          @click.stop="changeReferenceShow"
        >
          {{ t("Reference") }}
        </a-button>
        <div v-show="showReference" class="reference-list">
          <div
            class="reference-item"
            v-for="(item, index) in referenceList"
            :key="index"
          >
            <div class="tag">{{ item.key }}</div>
            <div class="description">-{{ item.value }}</div>
          </div>
        </div>
      </div>

      <a-row class="regex" type="flex" :gutter="16">
        <a-col flex="auto">
          <h-input
            v-model:value="leftRegex"
            prefix="/"
            size="large"
            class="reg-input"
            :auto-select="true"
            :save-options="{ key: 'leftRegex', autoSave: true }"
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
            :save-options="{ key: 'right', autoSave: true }"
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
          <h-multiline
            ref="resultRef"
            :title="t('result')"
            :value="matchResult"
          />
        </a-tab-pane>
        <a-tab-pane key="2" :tab="t('replace')">
          <h-input
            v-model:value="replaceInput"
            size="large"
            class="reg-input"
          />
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
        <div
          ref="canvasRef"
          style="margin-top: 20px; max-height: 70vh; overflow: scroll"
        />
      </a-modal>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, reactive, ref, watch } from "vue";
import visualRegex from "visual-regex";
import { useI18n } from "vue-i18n";
import { isRegExp } from "@he3-kit/utils";
import messages from "./lang.json";
const $he3 = window.$he3;
const { t } = useI18n({
  locale: $he3.lang,
  messages,
});

const activeKey = ref("1");
// 正则
const leftRegex = ref(
  "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})"
);
const rightRegex = ref(["g", "i"]);
const rightOptions = reactive([
  {
    leftStr: "",
    rightStr: "lobal",
    tag: "g",
    value: "g",
  },
  {
    leftStr: "case ",
    rightStr: "ntensive",
    tag: "i",
    value: "i",
  },
  {
    leftStr: "",
    rightStr: "ultiline",
    tag: "m",
    value: "m",
  },
  {
    leftStr: "",
    rightStr: "ingle line(dotall)",
    tag: "s",
    value: "s",
  },
  {
    leftStr: "",
    rightStr: "nicode",
    tag: "u",
    value: "u",
  },
  {
    leftStr: "stick",
    rightStr: "ingle line(dotall)",
    tag: "y",
    value: "y",
  },
]);
const showReference = ref(false);
const referenceList = ref([
  {
    key: "[abc]",
    value: t("desc[abc]"),
  },
  {
    key: "[0-9]",
    value: t("desc[0-9]"),
  },
  {
    key: "[a-zA-Z]",
    value: t("desc[a-zA-Z]"),
  },
  {
    key: "[^abc]",
    value: t("desc[^abc]"),
  },
  {
    key: "[a-z0-9]",
    value: t("desc[a-z0-9]"),
  },
  {
    key: "\\d",
    value: t("desc-d"),
  },
  {
    key: "\\D",
    value: t("desc-D"),
  },
  {
    key: "\\w",
    value: t("desc-w"),
  },
  {
    key: "\\W",
    value: t("desc-W"),
  },
  {
    key: "\\s",
    value: t("desc-s"),
  },
  {
    key: "\\S",
    value: t("desc-S"),
  },
  {
    key: "\\t",
    value: t("desc-t"),
  },
  {
    key: "\\r",
    value: t("desc-r"),
  },
  {
    key: "\\n",
    value: t("desc-n"),
  },
  {
    key: "\\v",
    value: t("desc-v"),
  },
  {
    key: "\\f",
    value: t("desc-f"),
  },
  {
    key: "[\\b\]",
    value: t("desc[-b-]"),
  },
  {
    key: "\\0",
    value: t("desc-0"),
  },
  {
    key: "\\xnn",
    value: t("desc-xnn"),
  },
  {
    key: "\\unnnn",
    value: t("desc-unnnn"),
  },
  {
    key: "\\",
    value: t("desc-"),
  },
  {
    key: "x*",
    value: t("descx*"),
  },
  {
    key: "x+",
    value: t("descx+"),
  },
  {
    key: "x?",
    value: t("descx?"),
  },
  {
    key: "x{n}",
    value: t("descx{n}"),
  },
  {
    key: "x{n,}",
    value: t("descx{n,}"),
  },
  {
    key: "x{n,m}",
    value: t("descx{n,m}"),
  },
]);
const changeReferenceShow = () => {
  showReference.value = !showReference.value;
};
// 测试文字
const testStr = ref(
  "He3 is a free, modern developer toolbox. Check it out: https://he3.app"
);
// 正则图
const canvasRef = ref<HTMLElement | null>(null);
// 匹配结果
const matchResult = ref("");
const matchArray = reactive<string[]>([]);
const resultRef = ref();
let reg: RegExp;
const match = window._.debounce(() => {
  try {
    reg = new RegExp(leftRegex.value, rightRegex.value.join(""));
  } catch {
    $he3.message.error(t("wrongFormat"));
    return;
  }
  const results = testStr.value.match(reg);
  if (results) {
    matchResult.value = results.join("\n");
    matchArray.length = 0;
    // 这里需要去重，否则会出bug
    matchArray.push(...new Set(results));
  } else {
    matchResult.value = t("noMatch");
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
      const value = res.split("/");
      leftRegex.value = value[1];
      rightRegex.value.push(...value[2].split(""));
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
    $he3.message.warning(t("nothing"));
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
const replaceInput = ref("he3.app");
const replaceOutput = ref("");
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
    position: relative;
    margin-bottom: 10px;
  }
  .regex {
    .reg-input {
      font-weight: 900;
      font-family: var(--code-font-family);
    }
  }
}
.label {
  color: rgba(8, 23, 53, 0.45);
  font-size: 12px;
  line-height: 140%; /* 16.8px */
}
.reference-button {
  margin-right: 10px;
}
.reference-list {
  z-index: 9;
  position: absolute;
  right: 31px;
  top: 35px;
  width: 286px;
  height: 451px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 11px 22px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 20px 0px rgba(77, 97, 138, 0.15);
  .reference-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    width: 100%;
  }
  .reference-item:last-child {
    margin-bottom: 0;
  }
  .tag {
    color: #6728ed;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
    margin-right: 12px;
    white-space: nowrap;
  }
  .description {
    color: #08173573;
    font-size: 12px;
    line-height: 16.8px;

    overflow: visible;
    white-space: pre-wrap;
    text-align: left;
  }
}
[mode="dark"] .reference-list {
  background-color: #2a2c37;
  box-shadow: 0px 4px 20px 0px rgba(95, 146, 247, 0.15);
  .tag {
    color: #5f92f7;
  }
  .description {
    color: #c2c7cf;
  }
}
</style>
