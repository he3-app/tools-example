<template>
  <h-single-layout mode="middle" :width="1280" class="layout">
    <div class="code-to-image-wrap">
      <div class="frame-wrap">
        <div ref="pictureRef" class="frame-container">
          <div class="frame">
            <div class="frame-head">
              <div class="controls">
                <div class="btn close" />
                <div class="btn minimize" />
                <div class="btn maximize" />
              </div>
              <h-input
                v-model:value="title"
                class="title"
                size="small"
                :bordered="false"
                style="color: #ccc"
              />
            </div>
            <h-code-editor v-model="originalCode" :lang="lang" theme="ONE_DARK" />
          </div>
        </div>
      </div>
    </div>
   
    <div class="settings-content">
      <a-space>
        <span style="white-space: nowrap">
          {{ t('language') }}
        </span>

        <LangSelect v-model="lang" />
        <div style="min-width: 70px;padding-left: 30px;">
          {{ t('fileName') }}
        </div>
        <h-input v-model:value="picName" :placeholder="``" :save-options="{autoSave: true, key: 'picName'}"  style="min-width: 100px" />
        <h-select v-model:value="chosenPicType" :save-options="{autoSave: true, key: 'chosenPicType'}"  style="width: 90px">
          <a-select-option v-for="(v, k, i) in PicType" :key="i" :value="v">
            {{ k }}
          </a-select-option>
        </h-select>
        <a-button type="primary" @click="download">
          {{ t('saveAsFile') }}
        </a-button>
      </a-space>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { useI18n } from 'vue-i18n';
import { InitialCode } from './constants';
import LangSelect from './components/LangSelect.vue';
import { CodeEditorLanguagesDisplayName } from './components/constants';
import messages from './lang.json';
import type { CodeEditorLanguagesUnion } from './components/constants';

const $he3 = window.$he3;
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const pictureRef = ref<HTMLDivElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const originalCode = ref(InitialCode);
const picName = ref('');
const title = ref('untitled.ts');

const lang = ref<CodeEditorLanguagesUnion>('TYPESCRIPT');
const langMap = new Map([
  ['C', 'c'],
  ['CPP', 'cpp'],
  ['CSHARP', 'cs'],
  ['CSS', 'css'],
  ['CRYSTAL', 'cr'],
  ['DART', 'dart'],
  ['ELM', 'ELM'],
  ['GO', 'go'],
  ['HASKELL', 'hs'],
  ['HTML', 'html'],
  ['JAVA', 'java'],
  ['JAVASCRIPT', 'js'],
  ['JSON', 'json'],
  ['JSX', 'jsx'],
  ['KOTLIN', 'kt'],
  ['LUA', 'lua'],
  ['MARKDOWN', 'md'],
  ['OBJECTIVE_C', 'm'],
  ['PHP', 'php'],
  ['PYTHON', 'py'],
  ['R', 'r'],
  ['RUBY', 'rb'],
  ['RUST', 'rs'],
  ['SHELL', 'sh'],
  ['SQL', 'sql'],
  ['SWIFT', 'swift'],
  ['SCALA', 'scala'],
  ['TSX', 'tsx'],
  ['TYPESCRIPT', 'ts'],
  ['TOML', 'toml'],
  ['WEB_ASSEMBLY', 'WASM'],
  ['XML', 'xml'],
  ['YAML', 'yml'],
]);

watch(originalCode, () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
});

watch(lang, () => {
  const name = title.value.split('.')[0];
  title.value = `${name}.${langMap.get(lang.value)}`;
});

const PicType = {
  PNG: 'png',
  WEBP: 'webp',
  SVG: 'svg',
};
const chosenPicType = ref(PicType.PNG);

const download = () => {
  if (originalCode.value.length <= 0) {
    $he3.message.warn('Please input your code first');
    return;
  }

  const htmlToImage = {
    [PicType.PNG]: toPng,
    [PicType.WEBP]: toJpeg,
    [PicType.SVG]: toSvg,
  };

  htmlToImage[chosenPicType.value](pictureRef.value as HTMLDivElement, {
    style: {
      transform: 'scale(1)',
    },
  })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${picName.value || 'code'}.${chosenPicType.value}`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      window.$he3.message.error('oops, something went wrong!');
      console.error(err);
    });
};
// 自动回填
onMounted(async () => {
  window.$he3.getLastClipboard().then(async (res) => {

    if (res && typeof res === 'string' && res.length > 0) {
      const guessedLangs = await window.$he3.guessLang(res);

      if (
        guessedLangs &&
        Array.isArray(guessedLangs) &&
        guessedLangs.length > 0 &&
        guessedLangs[0].confidence > 0.06 &&
        guessedLangs[0].languageId &&
        typeof guessedLangs[0].languageId === 'string'
      ) {
        // Accurate match.
        let targetLang = Object.keys(CodeEditorLanguagesDisplayName).find(
          (langName) => langName.toLowerCase() === (guessedLangs[0].languageId as string)
        );

        // Fuzzy match.
        if (!targetLang) {
          targetLang = Object.keys(CodeEditorLanguagesDisplayName).find((langName) =>
            new RegExp(langName, 'ig').test(guessedLangs[0].languageId as string)
          );
        }

        // console.log(targetLang)
        if (targetLang) {
          originalCode.value = res;
          lang.value = targetLang as CodeEditorLanguagesUnion;
          window.$he3.onUseClipboardValue();
        }
      }
    }
  });
});
</script>
<style scoped lang="less">
.layout {
  position: relative;
  :deep(.one) {
    height: 100%;
  }

  .settings-content {
    position: absolute;
    z-index: 1;
    top: 620px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    box-shadow: 1px 1px 8px 0;
    border: 1px solid transparent;
    border-radius: 8px;
    background-color: var(--primary-bg-color);
    display: flex;
    gap: 10px;
  }
}


.code-to-image-wrap {
  height: 90%;
  overflow-y: scroll;

  .frame-wrap {
    display: grid;
    align-items: center;
  }

  .frame-container {
    padding: 64px;
    // max-width: 96%;
    background: #b83cda;
    background: linear-gradient(
      225deg,
      rgba(184, 60, 218, 1) 0%,
      rgba(183, 35, 223, 1) 26%,
      rgba(206, 49, 152, 1) 53%,
      rgba(255, 0, 168, 1) 91%
    );
  }

  .frame {
    background-color: #292c33;
    border-radius: 12px;
    box-shadow: 0px 0px 64px 10px rgba(50, 50, 50, 0.8);
    padding-bottom: 20px;
    .frame-head {
      padding: 0.5vh 0.5vw;
      height: 32px;
      position: relative;

      .controls {
        position: absolute;
        display: flex;
        align-items: center;
        margin-left: 9px;
        margin-top: 9px;
        width: 80px;
        .btn.close {
          background-color: #ec6a5e;
        }
        .btn.minimize {
          background-color: #f4bf4f;
        }
        .btn.maximize {
          background-color: #60c353;
        }

        .btn {
          width: 12px;
          height: 12px;
          border-radius: var(--border-radius-base);
          margin-right: 8px;
        }
      }
      .title {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
