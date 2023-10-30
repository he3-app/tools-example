<template>
  <h-horizontal-layout mode="middle" :width="400">
    <template #left>
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item :label="t('label.data')">
          <a-input v-model:value="data" @change="handleGenerate" />
        </a-form-item>

        <a-form-item :label="t('label.format')">
          <h-select
            v-model:value="bOpts.format"
            :options="formatOptions"
            @change="fillExampleAndGen"
            :save-options="{key:'format', autoSave: true}"
          />
        </a-form-item>

        <a-form-item :label="t('label.width')">
          <a-row :gutter="10">
            <a-col :span="16">
              <a-slider v-model:value="bOpts.width" :min="1" :max="4" @change="handleGenerate" />
            </a-col>
            <a-col :span="4">
              <h-number-input
                v-model:value="bOpts.width"
                :min="1"
                :max="4"
                @change="handleGenerate"
                :save-options="{key:'width', autoSave: true}"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item :label="t('label.height')">
          <a-row :gutter="10">
            <a-col :span="16">
              <a-slider
                v-model:value="bOpts.height"
                :min="10"
                :max="150"
                @change="handleGenerate"
              />
            </a-col>
            <a-col :span="4">
              <h-number-input
                v-model:value="bOpts.height"
                :min="10"
                :max="150"
                @change="handleGenerate"
                :save-options="{key:'height', autoSave: true}"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item :label="t('label.color')" :wrapper-col="{ span: 24 }">
          <a-input-group>
            <a-row :gutter="10">
              <a-col :span="6">
                <a-input v-model:value="bOpts.line" type="color" @change="handleGenerate" />
              </a-col>
              <a-col :span="6">
                <a-input v-model:value="bOpts.background" type="color" @change="handleGenerate" />
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-item>

        <a-form-item :label="t('label.showText')">
          <h-switch v-model:checked="tOpts.show" @change="handleGenerate" :save-options="{key:'showText', autoSave: true}"/>
        </a-form-item>

        <a-form-item v-if="tOpts.show" :label="t('label.textAlign')">
          <h-radio
            v-model:value="tOpts.align"
            :options="textAlignOptions"
            option-type="button"
            @change="handleGenerate"
            :save-options="{key:'align', autoSave: true}"
          />
        </a-form-item>

        <a-form-item v-if="tOpts.show" :wrapper-col="{ span: 8 }" :label="t('label.font')">
          <h-select v-model:value="tOpts.font" :options="fontOptions" @change="handleGenerate"           
            :save-options="{key:'font', autoSave: true}"/>
        </a-form-item>

        <a-form-item v-if="tOpts.show" :label="t('label.fontOptions')">
          <a-checkbox-group
            v-model:value="tOpts.fontOptions"
            :options="realFontOptions"
            @change="handleGenerate"
          />
        </a-form-item>

        <a-form-item v-if="tOpts.show" :label="t('label.textSize')">
          <a-row :gutter="10">
            <a-col :span="16">
              <a-slider v-model:value="tOpts.size" :min="8" :max="36" @change="handleGenerate" />
            </a-col>
            <a-col :span="4">
              <h-number-input
                v-model:value="tOpts.size"
                :min="8"
                :max="36"
                :save-options="{key:'size', autoSave: true}"
                @change="handleGenerate"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item v-if="tOpts.show" :label="t('label.textMargin')">
          <a-row :gutter="10">
            <a-col :span="16">
              <a-slider v-model:value="tOpts.margin" :min="0" :max="25" @change="handleGenerate" />
            </a-col>
            <a-col :span="4">
              <h-number-input
                v-model:value="tOpts.margin"
                :min="0"
                :max="25"
                :save-options="{key:'margin', autoSave: true}"
                @change="handleGenerate"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </template>

    <template #right>
      {{ t('selectType') + ': ' }}
      <h-select v-model:value="downloadType" class="output-type" style="width: 80px" :save-options="{key:'downloadType', autoSave: true}">
        <a-select-option :value="ExportType.PNG">
          {{ '.' + ExportType.PNG }}
        </a-select-option>
        <a-select-option :value="ExportType.SVG">
          {{ '.' + ExportType.SVG }}
        </a-select-option>
      </h-select>
      <!-- png 按钮 -->
      <template v-if="downloadType === ExportType.PNG">
        <a :href="download.url" :download="download.filename">
          <a-button :disabled="!isValid" type="primary">
            <template #icon>
              <DownloadOutlined />
            </template>
            {{ t('save') }}
          </a-button>
        </a>
      </template>
      <!-- svg 按钮 -->
      <template v-else-if="downloadType === ExportType.SVG">
        <a-button
          type="primary"
          :disabled="!isValid"
          :loading="downloadLoading"
          @click="handleDownloadSvg"
        >
          <template #icon>
            <DownloadOutlined />
          </template>
          {{ t('save') }}
        </a-button>
      </template>

      <div v-show="isValid" class="output">
        <canvas id="he3-barcode-canvas" ref="barCodeOutput" class="barcode-output" />
      </div>
      <div v-show="!isValid">
        <p style="color: red; font-size: 2em">Not valid data for this barcode type</p>
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import JsBarcode from 'jsbarcode';
import { XMLSerializer } from 'xmldom';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const EXAMPLE_DATA = new Map([
  ['CODE128', 'Example 1234'],
  ['CODE128A', 'EXAMPLE'],
  ['CODE128B', 'Example text'],
  ['CODE128C', '12345678'],
  ['EAN13', '1234567890128'],
  ['EAN8', '12345670'],
  ['UPC', '123456789999'],
  ['CODE39', 'EXAMPLE TEXT'],
  ['ITF14', '10012345000017'],
  ['ITF', '123456'],
  ['MSI', '123456'],
  ['MSI10', '123456'],
  ['MSI11', '123456'],
  ['MSI1010', '123456'],
  ['MSI1110', '123456'],
  ['pharmacode', '1234'],
]);
const barCodeOutput = ref<HTMLCanvasElement | null>(null);
const download = ref({
  url: '',
  filename: 'barcode',
});
const data = ref('Example 1234');
const bOpts = ref<barCodeOptions>({
  width: 2,
  height: 100,
  background: '#ffffff',
  line: '#000000',
  format: 'CODE128',
});
const tOpts = ref<textOptions>({
  show: true,
  margin: 0,
  align: 'center',
  font: 'Monospace',
  fontOptions: [],
  size: 16,
});
const isValid = ref(true);
const textAlignOptions = [
  { label: t('left'), value: 'left' },
  { label: t('center'), value: 'center' },
  { label: t('right'), value: 'right' },
];
const fontOptions = [
  {
    label: 'Monospace',
    value: 'Monospace',
  },
  {
    label: 'Sans-serif',
    value: 'Sans-serif',
  },
  {
    label: 'Serif',
    value: 'Serif',
  },
  {
    label: 'Fantasy',
    value: 'Fantasy',
  },
  {
    label: 'Cursive',
    value: 'Cursive',
  },
];
const realFontOptions = [
  { label: t('bold'), value: 'bold' },
  { label: t('italic'), value: 'italic' },
];
const formatOptions = [
  { label: 'CODE128(auto)', value: 'CODE128' },
  { label: 'CODE128A', value: 'CODE128A' },
  { label: 'CODE128B', value: 'CODE128B' },
  { label: 'CODE128C', value: 'CODE128C' },
  { label: 'EAN13', value: 'EAN13' },
  { label: 'EAN8', value: 'EAN8' },
  { label: 'UPC', value: 'UPC' },
  { label: 'CODE39', value: 'CODE39' },
  { label: 'ITF14', value: 'ITF14' },
  { label: 'ITF', value: 'ITF' },
  { label: 'MSI', value: 'MSI' },
  { label: 'MSI10', value: 'MSI10' },
  { label: 'MSI11', value: 'MSI11' },
  { label: 'MSI1010', value: 'MSI1010' },
  { label: 'MSI1110', value: 'MSI1110' },
  { label: 'pharmacode', value: 'pharmacode' },
];

// download Type
enum ExportType {
  SVG = 'svg',
  PNG = 'png',
}
const downloadType = ref<ExportType>(ExportType.PNG);
const downloadLoading = ref<boolean>(false);

function fillExampleAndGen() {
  const example = EXAMPLE_DATA.get(bOpts.value.format);
  if (example !== undefined) {
    data.value = example;
  }
  handleGenerate();
}

onMounted(() => {
  handleGenerate();
});

function handleGenerate() {
  try {
    generate(data.value, bOpts.value, tOpts.value);
    isValid.value = true;
    if (barCodeOutput.value instanceof HTMLCanvasElement) {
      download.value.url = barCodeOutput.value.toDataURL('image/png');
    }
  } catch {
    isValid.value = false;
  }
}

interface barCodeOptions {
  width: number;
  height: number;
  background: string;
  line: string;
  format: string;
}
interface textOptions {
  show: boolean;
  margin: number;
  align: string;
  font: string;
  fontOptions: Array<string>;
  size: number;
}
function generate(data: string, bOptions: barCodeOptions, tOptions: textOptions) {
  if (data === '') {
    return;
  }
  JsBarcode('#he3-barcode-canvas', data, {
    width: bOptions.width,
    height: bOptions.height,
    background: bOptions.background,
    lineColor: bOptions.line,
    format: bOptions.format,
    displayValue: tOptions.show,
    textMargin: tOptions.margin,
    textAlign: tOptions.align,
    font: tOptions.font,
    fontOptions: tOptions.fontOptions.join(' '),
    fontSize: tOptions.size,
  });
}

// 处理下载二维码为svg格式事件
const handleDownloadSvg = () => {
  downloadLoading.value = true;
  const bOptions = bOpts.value;
  const tOptions = tOpts.value;
  try {
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const xmlSerializer = new XMLSerializer();
    JsBarcode(svgNode, data.value, {
      width: bOptions.width,
      height: bOptions.height,
      background: bOptions.background,
      lineColor: bOptions.line,
      format: bOptions.format,
      displayValue: tOptions.show,
      textMargin: tOptions.margin,
      textAlign: tOptions.align,
      font: tOptions.font,
      fontOptions: tOptions.fontOptions.join(' '),
      fontSize: tOptions.size,
    });
    const svgText = xmlSerializer.serializeToString(svgNode);
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'barcode');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    message.error((error as ErrorEvent).message);
  }
  downloadLoading.value = false;
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 8px;
}

.output-type {
  margin-right: 10px;
}

.output {
  margin-top: 20px;
}
</style>
