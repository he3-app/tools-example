<template>
  <h-single-layout mode="middle" :width="900">
    <div style="display: flex">
      <div class="flexCan">
        <span class="title">{{ t('pickColor') }}</span>
        <a-card class="imgCard">
          <div class="main">
            <div class="container">
              <div
                v-for="(num, idx) in colorNum"
                :key="idx"
                :style="{
                  position: 'relative',
                  top: idx !== 0 ? -7 * idx + 'px' : '',
                }"
                @mousemove="changeColor2"
              >
                <div
                  v-for="i in num"
                  :key="i"
                  class="colorDiv"
                  :style="{ backgroundColor: colors[count] }"
                  @click="changeColor"
                >
                  <span :style="{ display: 'none' }">{{ count++ }}</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
        <span
          :style="{
            display: 'inline-block',
            width: '30%',
            height: ' 20px',
            backgroundColor: moveColor,
          }"
        />
        <span class="title">{{ t('enterColor') }}</span>
        <a-input-search
          v-model:value="iptVal"
          enter-button="OK"
          size="default"
          style="width: 60%"
          @search="onSearch"
        />
        <span class="title">{{ t('useHTML') }}</span>
        <h-input :value="iptColor" type="color" style="width: 60%" size="small" @blur="iptPick" />
      </div>
      <div class="flexC">
        <span class="title">{{ t('selected') }}</span>
        <div class="midDiv">
          <span style="color: #000 !important">Black Text</span>
          <span style="text-shadow: 1px 1px 0 #444; color: #000 !important">Shadow</span>
          <span style="color: #fff !important">White Text</span>
          <span style="text-shadow: 1px 1px 0 #444; color: #fff !important">Shadow</span>
        </div>
        <span style="font-weight: 700">{{ selectColor.toLowerCase() }}</span>
        <span>{{ convertColor(selectColor, ColorType.RGB) }}</span>
        <span>{{ convertColor(selectColor, ColorType.HSL) }}</span>
      </div>
      <div class="flexC">
        <span class="title">{{ t('ld') }}</span>
        <div v-for="(i, index) in 21" :key="i" style="display: flex; width: 100%; padding: 0px 5px">
          <label style="width: 40px; text-align: right">{{ 100 - index * 5 }}%</label>
          <div
            :style="{
              height: '20px',
              flexGrow: 1,
              margin: '2px 5px',
              backgroundColor: partColor + (100 - index * 5) + '%)',
            }"
          />
          <label style="width: 40px">
            {{ convertColor(partColor + (100 - index * 5) + '%)', ColorType.HEX).toLowerCase() }}
          </label>
        </div>
      </div>
    </div>
    <h2>{{ t('hue') }}</h2>
    <a-table
      size="small"
      :columns="columns1"
      :data-source="data1"
      class="ant-table-striped"
      :pagination="false"
      :row-class-name="
        (_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)
      "
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'color'">
          <div :style="{ backgroundColor: text }">
            <span style="opacity: 0">1</span>
          </div>
        </template>
      </template>
    </a-table>
    <h2>{{ t('saturation') }}</h2>
    <a-table
      size="small"
      :columns="columns2"
      :data-source="data2"
      class="ant-table-striped"
      :pagination="false"
      :row-class-name="
        (_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)
      "
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'color'">
          <div :style="{ backgroundColor: text }">
            <span style="opacity: 0">1</span>
          </div>
        </template>
      </template>
    </a-table>
    <h2>{{ t('lightness') }}</h2>
    <a-table
      size="small"
      :columns="columns3"
      :data-source="data3"
      class="ant-table-striped"
      :pagination="false"
      :row-class-name="
        (_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)
      "
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'color'">
          <div :style="{ backgroundColor: text }">
            <span style="opacity: 0">1</span>
          </div>
        </template>
      </template>
    </a-table>
    <h1>RGB (Red, Green, Blue)</h1>
    <a-card style="width: 90%; display: flex; flex-direction: column">
      <div style="display: flex">
        <div style="width: 33%">
          <span>Red</span>
          <span />
          <div style="width: 100%; background-color: red">
            <span style="opacity: 0">1</span>
          </div>
          <a-slider v-model:value="red" :min="0" :max="255" />
        </div>
        <div style="width: 33%">
          <span>Green</span>
          <span />
          <div style="width: 100%; background-color: green">
            <span style="opacity: 0">1</span>
          </div>
          <a-slider v-model:value="green" :min="0" :max="255" />
        </div>
        <div style="width: 33%">
          <span>Blue</span>
          <span><span style="opacity: 0">1</span></span>
          <div style="width: 100%; background-color: blue">
            <span style="opacity: 0">1</span>
          </div>
          <a-slider v-model:value="blue" :min="0" :max="255" />
        </div>
      </div>
      <div
        :style="{
          width: '100%',
          backgroundColor: 'rgb(' + red + ',' + green + ',' + blue + ')',
        }"
      >
        <span style="opacity: 0">1</span>
      </div>
      <div
        :style="{
          width: '100%',
          backgroundColor: selectColor,
        }"
      >
        <span style="opacity: 0">1</span>
      </div>
      <p style="text-align: center">
        {{ 'rgb(' + red + ',' + green + ',' + blue + ')' }}
      </p>
      <p style="text-align: center">
        {{ convertColor('rgb(' + red + ',' + green + ',' + blue + ')', ColorType.HEX) }}
      </p>
    </a-card>
  </h-single-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { ColorType, convertColor } from '@he3-kit/utils';

import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const iptColor = ref('#a6a6a6');
const $he3 = window.$he3;
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const iptPick = (e) => {
  if (e.target?.value) {
    iptColor.value = e.target.value;
    selectColor.value = convertColor(iptColor.value, ColorType.HEX);
  }
};
const selectColor = ref<string>('#a6a6a6');
const iptVal = ref<string>('');
const partColor = computed(() => {
  const color = convertColor(selectColor.value, ColorType.HSL);
  return `${color.split('%')[0]}%,`;
});
const onSearch = () => {
  selectColor.value = convertColor(iptVal.value, ColorType.HEX);
};
const colorNum: number[] = [7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 9, 8, 7];
const colors = [
  '#003366',
  '#336699',
  '#3366CC',
  '#003399',
  '#000099',
  '#0000CC',
  '#000066',
  '#006666',
  '#006699',
  '#0099CC',
  '#0066CC',
  '#0033CC',
  '#0000FF',
  '#3333FF',
  '#333399',
  '#669999',
  '#009999',
  '#33CCCC',
  '#00CCFF',
  '#0099FF',
  '#0066FF',
  '#3366FF',
  '#3333CC',
  '#666699',
  '#339966',
  '#00CC99',
  '#00FFCC',
  '#00FFFF',
  '#33CCFF',
  '#3399FF',
  '#6699FF',
  '#6666FF',
  '#6600FF',
  '#6600CC',
  '#339933',
  '#00CC66',
  '#00FF99',
  '#66FFCC',
  '#66FFFF',
  '#66CCFF',
  '#99CCFF',
  '#9999FF',
  '#9966FF',
  '#9933FF',
  '#9900FF',
  '#006600',
  '#00CC00',
  '#00FF00',
  '#66FF99',
  '#99FFCC',
  '#CCFFFF',
  '#CCCCFF',
  '#CC99FF',
  '#CC66FF',
  '#CC33FF',
  '#CC00FF',
  '#9900CC',
  '#003300',
  '#009933',
  '#33CC33',
  '#66FF66',
  '#99FF99',
  '#CCFFCC',
  '#FFFFFF',
  '#FFCCFF',
  '#FF99FF',
  '#FF66FF',
  '#FF00FF',
  '#CC00CC',
  '#660066',
  '#336600',
  '#009900',
  '#66FF33',
  '#99FF66',
  '#CCFF99',
  '#FFFFCC',
  '#FFCCCC',
  '#FF99CC',
  '#FF66CC',
  '#FF33CC',
  '#CC0099',
  '#993399',
  '#333300',
  '#669900',
  '#99FF33',
  '#CCFF66',
  '#FFFF99',
  '#FFCC99',
  '#FF9999',
  '#FF6699',
  '#FF3399',
  '#CC3399',
  '#990099',
  '#666633',
  '#99CC00',
  '#CCFF33',
  '#FFFF66',
  '#FFCC66',
  '#FF9966',
  '#FF6666',
  '#FF0066',
  '#CC6699',
  '#993366',
  '#999966',
  '#CCCC00',
  '#FFFF00',
  '#FFCC00',
  '#FF9933',
  '#FF6600',
  '#FF5050',
  '#CC0066',
  '#660033',
  '#996633',
  '#CC9900',
  '#FF9900',
  '#CC6600',
  '#FF3300',
  '#FF0000',
  '#CC0000',
  '#990033',
  '#663300',
  '#996600',
  '#CC3300',
  '#993300',
  '#990000',
  '#800000',
  '#993333',
];
let count = 0;
const moveColor = ref('');
const changeColor = (e: any) => {
  selectColor.value = convertColor(e.target.style.backgroundColor, ColorType.HEX);
};

const changeColor2 = (e: any) => {
  moveColor.value = e.target.style.backgroundColor;
};
const columns1 = [
  { title: 'Color', dataIndex: 'color', width: 100, align: 'center' },
  { title: 'Hue', dataIndex: 'hue', align: 'center' },
  { title: 'Hex', dataIndex: 'hex', align: 'center' },
  { title: 'Rgb', dataIndex: 'rgb', align: 'center' },
  { title: 'Hsl', dataIndex: 'hsl', align: 'center' },
];
const columns2 = [
  { title: 'Color', dataIndex: 'color', width: 100, align: 'center' },
  { title: 'Sat', dataIndex: 'sat', align: 'center' },
  { title: 'Hex', dataIndex: 'hex', align: 'center' },
  { title: 'Rgb', dataIndex: 'rgb', align: 'center' },
  { title: 'Hsl', dataIndex: 'hsl', align: 'center' },
];
const columns3 = [
  { title: 'Color', dataIndex: 'color', width: 100, align: 'center' },
  { title: 'Light', dataIndex: 'light', align: 'center' },
  { title: 'Hex', dataIndex: 'hex', align: 'center' },
  { title: 'Rgb', dataIndex: 'rgb', align: 'center' },
  { title: 'Hsl', dataIndex: 'hsl', align: 'center' },
];
const data1: any = reactive([]);
const data2: any = reactive([]);
const data3: any = reactive([]);
const red = ref<number>(0);
const green = ref<number>(0);
const blue = ref<number>(0);
watch(
  selectColor,
  () => {
    let rgbArr = convertColor(selectColor.value, ColorType.RGB).match(/[1-9][0-9]*/g);
    if (rgbArr) {
      red.value = Number(rgbArr[0]);
      green.value = Number(rgbArr[1]);
      blue.value = Number(rgbArr[2]);
    }

    data1.length = 0;
    data2.length = 0;
    data3.length = 0;
    const hsl = convertColor(selectColor.value, ColorType.HSL);

    for (let i = 0; i < 25; i++) {
      const hue = hsl.replace(/\d+/i, (i * 15).toString());
      data1.push({
        key: i,
        color: hue,
        hue: i * 15,
        hex: convertColor(hue, ColorType.HEX),
        rgb: convertColor(hue, ColorType.RGB),
        hsl: hue,
      });
    }
    for (let i = 0; i <= 20; i++) {
      const sat = hsl.replace(/\,\d+/i, `,${100 - i * 5}`);
      const light = hsl.replace(/\d+\%\)/i, `${100 - i * 5}%)`);
      data2.push({
        key: i,
        color: sat,
        sat: `${100 - i * 5}%`,
        hex: convertColor(sat, ColorType.HEX),
        rgb: convertColor(sat, ColorType.RGB),
        hsl: sat,
      });
      data3.push({
        key: i,
        color: light,
        light: `${100 - i * 5}%`,
        hex: convertColor(light, ColorType.HEX),
        rgb: convertColor(light, ColorType.RGB),
        hsl: light,
      });
    }
  },
  {
    immediate: true,
  }
);
</script>
<style scoped lang="less">
.title {
  margin-top: 20px;
  font-size: 18px;
}

.flexC {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 28%;
  margin: 10px 3%;
}

.flexCan {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 35%;
  margin: 10px 3%;
}

.midDiv {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  height: 300px;
  background-color: v-bind(selectColor);
}

.imgCard {
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main {
  --s: 20px;
  /* size  */
  --m: 0px;
  /* margin */
  min-width: 260px;
}

.container {
  height: 220px;
  font-size: 0;
  /* 禁用内联块元素之间的空白 */
}

.container > div {
  text-align: center;
}

.colorDiv {
  width: var(--s);
  margin: var(--m);
  height: calc(var(--s) * 1.1547);
  display: inline-block;
  font-size: initial;
  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  margin: 0;
  cursor: pointer;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

:deep(td.ant-table-cell) {
  padding: 0 !important;
}

h2 {
  margin-top: 20px;
}
</style>
