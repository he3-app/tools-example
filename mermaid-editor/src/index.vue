<template>
  <h-horizontal-layout class="layout">
    <template #left>
      <div class="left">
        <a-form layout="inline">
          <a-form-item :label="t('autoSync')">
            <a-switch v-model:checked="autoSync" @change="onSyncChange" />
          </a-form-item>
          <a-form-item>
            <a-button v-show="!autoSync" type="primary" @click="onSync">{{ t('sync') }}</a-button>
          </a-form-item>
        </a-form>

        <h-code-editor  v-model="input" :save-options="{autoSave: true, key: 'mermaid-editor-h-code-editor'}" :lang="'MARKDOWN'" class="left-editor" />

        <div class="left-buttons">
          <template v-for="item in examplesList" :key="item.key">
            <a-tooltip>
              <template #title>{{ item.description }}</template>
              <a-button type="primary" class="left-example" @click="onClickExample(item.value)">
                <template #icon>
                  <Icons :type="item.key" />
                </template>
              </a-button>
            </a-tooltip>
          </template>
        </div>
        <div>
          <a :href="download.svg" :download="download.name">
            <a-button type="primary" :disabled="download.svgDisabled" class="left-download">
              <template #icon>
                <DownloadOutlined />
              </template>
              {{ t('save') }}
            </a-button>
          </a>
        </div>
      </div>
    </template>
    <template #right>
      <div class="right">
        <!-- <p v-show="err !== ''" class="error">{{ err }}</p> -->
        <div ref="container" class="right-container" />
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
// import { useSetting } from '@/store/useSetting'
import { DownloadOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { mermaidExamples } from './example';
import { isMermaid } from './regs';
import Icons from './Icons.vue';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const input = ref(mermaidExamples.sequence);
const container = ref(null);
const config = ref<MermaidConfig>({
  theme: 'default',
  startOnLoad: false,
});
const err = ref('');
const autoSync = ref(true);
const download = ref({
  svg: '',
  svgDisabled: false,
  name: 'mermaid-diagram.svg',
});

const script = document.createElement('script');
script.type = 'text/javascript';
script.type = 'module';
/* script.src = $he3.publicAssetPath + "/test.js/url" */
script.src = 'https://cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js';
script.onload = function () {
  draw();
};
document.querySelectorAll('body')[0].appendChild(script);

// const settingData = useSetting()
if (window.$he3.theme === 'dark') {
  config.value.theme = 'dark';
}
// todo
// watch(
//   () => settingData.dark,
//   () => {
//     if (settingData.dark) {
//       config.value.theme = 'dark'
//     } else {
//       config.value.theme = 'default'
//     }
//   },
//   // { immediate: true },
// )

watch(
  () => input.value,
  () => {
    if (autoSync.value) {
      onSync();
    }
  }
);

const examplesList = Object.entries(mermaidExamples).map((entry) => {
  return {
    key: entry[0],
    value: entry[1],
    description: t(entry[0]),
  };
});

function onClickExample(data: string) {
  input.value = data;
}

function onSyncChange() {
  if (autoSync.value) {
    onSync();
  }
}

function onSync() {
  draw();
}

onMounted(() => {
  window.$he3.getLastClipboard().then((res) => {
    if (isMermaid(res)) {
      input.value = res;
      draw();
      window.$he3.onUseClipboardValue();
    }
  });
});

async function draw() {
  mermaid.mermaidAPI.initialize(config.value);

  const element = container.value as unknown as HTMLElement;
  const graphDefinition = input.value;
  mermaid.mermaidAPI
    .renderAsync('mermaidGraph', graphDefinition)
    .then((graph) => {
      download.value.svgDisabled = true;

      element.innerHTML = graph;
      err.value = '';
      const svgElement = document.querySelector('#mermaidGraph');
      if (svgElement) {
        svgElement.style.maxWidth = '';
        // Generate download URL
        const data = new XMLSerializer().serializeToString(element);
        const svgBlob = new Blob([data], {
          type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);
        download.value.svg = url;
        download.value.svgDisabled = false;
        const d = new Date();
        download.value.name = `mermaid-diagram-${formatTime(d)}`;
      }
    })
    .catch((e) => {
      err.value = e.message;
    });
}

function formatTime(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
}
</script>

<style scoped lang="less">
.error {
  font-size: 1.5rem;
  color: red;
}

.left {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-editor {
    flex-grow: 1;
    overflow: scroll;
  }

  &-example {
    margin: 3px;
  }

  &-download {
    margin: 3px;
  }
}

.right {
  height: 100%;

  display: flex;
  flex-direction: column;

  &-container {
    border: 1px solid var(--primary-border-color);
    border-radius: var(--border-radius-base);
    background-color: var(--secondary-bg-color);

    height: 100%;
    overflow: scroll;

    flex-grow: 1;
    display: flex;
    flex-direction: column;

    :deep(#mermaidGraph) {
      flex-grow: 1;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
