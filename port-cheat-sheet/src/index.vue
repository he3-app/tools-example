<template>
  <h-single-layout mode="middle" :width="1280">
    <div>
      <a-select
        v-show="!$he3.renderOnSearch"
        show-search
        label-in-value
        :placeholder="t('searchPlaceholder')"
        style="width: 100%"
        :options="options"
        :filter-option="filterOption"
        @change="onSearch"
      />
      <div v-show="!$he3.renderOnSearch" class="portsBox">
        <div
          v-for="(port, index) in portsList"
          :id="port.label"
          :key="index"
          class="port"
        >
          <span>
            <span class="range">
              {{ port.label }}
            </span>
            <span class="valPadding" :style="{ backgroundColor: port.color }">
              {{ port.value }}
            </span>
          </span>
        </div>
        <span class="range colorTitle">Legends</span>
        <div v-for="(legend, index) in legends" :key="index" class="port">
          <span
            class="range legendBlock"
            :style="{ backgroundColor: legend.color }"
          >
            {{ legend.kind }}
          </span>
        </div>
      </div>
      <div v-show="$he3.renderOnSearch" class="portRender">
        {{ searchRes.port }}
        : {{ searchRes.meaning }}
      </div>
    </div>
  </h-single-layout>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { isPorts, legends, portsList } from "./ports";

import messages from "./lang.json";

const $he3 = window.$he3;

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const onSearch = (searchValue: any) => {
  const element = document.getElementById(searchValue.label);
  if (element) {
    element.scrollIntoView();
    element.style.backgroundColor = "coral";
    setTimeout(() => {
      element.style.backgroundColor = "";
    }, 3000);
  }
};
const options = ref(portsList);

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};
const searchRes = reactive<any>({
  port: "",
  meaning: "",
});
onMounted(async () => {
  if ($he3.renderOnSearch) {
    const res = await $he3.getSearchValue();
    searchRes.port = res?.match(/[0-9]{1,5}/)?.[0] || "";
    searchRes.meaning = "";
    for (const s of portsList) {
      if (s.label === searchRes.port) {
        searchRes.meaning = s.value;
        break;
      }
    }
  }

  const processValue = async (value) => {
    if (isPorts(value)) {
      const element = document.getElementById(value);
      if (element) {
        element.scrollIntoView();
        element.style.backgroundColor = "coral";
        setTimeout(() => {
          element.style.backgroundColor = "";
        }, 3000);
      }
    }
  };
  const previewerValue = await $he3.getPreviewerValue();
  await processValue(previewerValue);

  const clipboardValue = await $he3.getLastClipboard();
  await processValue(clipboardValue);
  
  if (isPorts(clipboardValue)) $he3.onUseClipboardValue();
});
</script>
<style lang="less" scoped>
.portsBox {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 1850px;
}

.title {
  text-align: center;
  font-weight: 700;
  font-size: 30px;
  color: #10334a;
}

.range {
  display: inline-block;
  margin-right: 20px;
  font-weight: 600;
  color: rgb(53, 53, 88);
}

.port {
  margin: 3px 5px;
}

.port:hover {
  background-color: coral;
}

.colorTitle {
  margin: 10px 5px;
  font-size: 20px;
}

.legendBlock {
  display: inline-block;
  width: 100px;
}

.valPadding {
  padding-right: 10px;
}

.portRender {
  font-size: 30px;
  height: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
