<template>
  <div class="layout-wrap">
    <div class="layout">
      <div class="settings-content">
        <a-form
            layout="inline"
            autocomplete="off"
        >
          <a-form-item :label="t('padding')">
            <a-radio-group v-model:value="frameContainerPadding">
              <a-radio :value="16">16</a-radio>
              <a-radio :value="32">32</a-radio>
              <a-radio :value="64">64</a-radio>
              <a-radio :value="128">128</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item :label="t('theme')">
            <a-radio-group v-model:value="frameContainerBgImage">
              <a-radio :value="bgImage[0]">
                <div class="theme-circle" :style="{backgroundImage:bgImage[0]}"></div>
              </a-radio>
              <a-radio :value="bgImage[1]">
                <div class="theme-circle" :style="{backgroundImage:bgImage[1]}"></div>
              </a-radio>
              <a-radio :value="bgImage[2]">
                <div class="theme-circle" :style="{backgroundImage:bgImage[2]}"></div>
              </a-radio>
              <a-radio :value="bgImage[3]">
                <div class="theme-circle" :style="{backgroundImage:bgImage[3]}"></div>
              </a-radio>'<a-radio :value="bgImage[4]">
              <div class="theme-circle" :style="{backgroundImage:bgImage[4]}"></div>
            </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item :label="t('background')">
            <a-switch v-model:checked="showBackground" />
          </a-form-item>

          <a-form-item :label="t('language')">
            <LangSelect v-model="lang"/>
          </a-form-item>

          <a-form-item :label="t('fileName')">
            <div style="display: flex">
              <h-input v-model:value="picName" :placeholder="``" :save-options="{autoSave: true, key: 'picName'}"
                       style="min-width: 100px"/>
              <h-select v-model:value="chosenPicType" :save-options="{autoSave: true, key: 'chosenPicType'}"
                        style="width: 90px">
                <a-select-option v-for="(v, k, i) in PicType" :key="i" :value="v">
                  {{ k }}
                </a-select-option>
              </h-select>
            </div>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="download">
              {{ t('saveAsFile') }}
            </a-button>
          </a-form-item>
        </a-form>

      </div>
      <div class="code-to-image-wrap">
        <div class="frame-wrap">
          <div ref="pictureRef" class="frame-container">
            <div class="frame">
              <div class="frame-head">
                <div class="controls">
                  <div class="btn close"/>
                  <div class="btn minimize"/>
                  <div class="btn maximize"/>
                </div>
                <h-input
                    v-model:value="title"
                    class="title"
                    size="small"
                    :bordered="false"
                    style="color: #ccc"
                />
              </div>
              <h-code-editor v-model="originalCode" :lang="lang" theme="ONE_DARK"/>
            </div>
          </div>
        </div>
        </div>
      </div>

    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {toJpeg, toPng, toSvg} from 'html-to-image';
import {useI18n} from 'vue-i18n';
import {InitialCode} from './constants';
import LangSelect from './components/LangSelect.vue';
import type {CodeEditorLanguagesUnion} from './components/constants';
import {CodeEditorLanguagesDisplayName} from './components/constants';
import messages from './lang.json';

const $he3 = window.$he3;
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const pictureRef = ref<HTMLDivElement>();
const textareaRef = ref<HTMLTextAreaElement>();
const originalCode = ref(InitialCode);
const picName = ref('');
const title = ref('untitled.ts');

const lang = ref<CodeEditorLanguagesUnion>('TYPESCRIPT');
const langMap = new Map([
  ['C', 'c'],
  ['CPP', 'cpp'],
  ['CSHARP', 'cs'],
  ['CSS', 'css'],
  ['DART', 'dart'],
  ['ELM', 'ELM'],
  ['GO', 'go'],
  ['HASKELL', 'hs'],
  ['HTML', 'html'],
  ['JAVA', 'java'],
  ['JAVASCRIPT', 'js'],
  ['JSON', 'json'],
  ['JSX', 'tsx'],
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
  ['TSX', 'tsx'],
  ['TYPESCRIPT', 'ts'],
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

const frameContainerPadding = ref(16)
const bgImage = [
    'linear-gradient(140deg, rgb(76, 200, 200), rgb(32, 32, 51))',
    'linear-gradient(140deg, rgb(207, 47, 152), rgb(106, 61, 236))',
    'linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248))',
    'linear-gradient(140deg, rgb(142, 199, 251), rgb(28, 85, 170))',
    'linear-gradient(140deg, rgb(255, 207, 115), rgb(255, 122, 47))'
]
const frameContainerBgImage = ref(bgImage[0])

const showBackground = ref(true)

onMounted(() => {
  pictureRef.value.style.padding = `${frameContainerPadding.value}px`
  if (showBackground.value) {
    pictureRef.value.style.backgroundImage = frameContainerBgImage.value
  } else {
    pictureRef.value.style.backgroundImage = 'none'
  }
})

watch([frameContainerPadding,frameContainerBgImage,showBackground], () => {
  pictureRef.value.style.padding = `${frameContainerPadding.value}px`
  if (showBackground.value) {
    pictureRef.value.style.backgroundImage = frameContainerBgImage.value
  } else {
    pictureRef.value.style.backgroundImage = 'none'
  }
},)

</script>
<style scoped lang="less">
.layout-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 768px;

  .layout {
    width: 80%;

    .settings-content {
      width: 100%;
      padding: 10px 20px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: var(--tools-bg-color-1);

      .theme-circle {
        width:20px;
        height:20px;
        border-radius: 50%;
      }
    }

    .code-to-image-wrap {
      width: 100%;

      .frame-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        .frame-container {
          width: 100%;
          // Midnight
          //background-image: linear-gradient(140deg, rgb(76, 200, 200), rgb(32, 32, 51));
          // Breeze
          //background-image: linear-gradient(140deg, rgb(207, 47, 152), rgb(106, 61, 236));
          // Candy
          //background-image: linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248));
          // Raindrop
          //background-image: linear-gradient(140deg, rgb(142, 199, 251), rgb(28, 85, 170));
          // Sunset
          //background-image: linear-gradient(140deg, rgb(255, 207, 115), rgb(255, 122, 47));


          .frame {
            width: 100%;
            background-color: #292c33;
            border-radius: 12px;
            //box-shadow: 0px 0px 64px 10px rgba(50, 50, 50, 0.8);
            padding-bottom: 20px;


            .frame-head {
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
                  border-radius: 50%;
                  margin-right: 8px;
                }
              }

              .title {
                width: 100%;
                text-align: center;
              }
            }

            :deep(.code-editor-wrapper) {

              .cm-gutters {
                width: 34px;
              }

              .cm-content {
                width: calc(100% - 34px);
                min-width: inherit;

                word-wrap: break-word;
                white-space: pre-wrap;
                word-break: normal;
                overflow: visible;
              }
            }

          }
        }
      }


    }

  }
}
</style>
