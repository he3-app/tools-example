<template>
  <h-horizontal-layout :left-width="400">
    <template #left>
      <div>
        <a-form :label-col="{ span: 12 }" :wrapper-col="{ span: 16 }" size="small">
          <a-form-item :label="t('rows')">
            <h-number-input v-model:value="row" size="small" max="12" min="0" :save-options="{autoSave:true,key:'row'}"/>
          </a-form-item>
          <a-form-item :label="t('columns')">
            <h-number-input v-model:value="column" size="small" max="12" min="0" :save-options="{autoSave:true,key:'column'}"/>
          </a-form-item>
          <a-form-item :label="t('rowGap')">
            <h-number-input v-model:value="rowGap" size="small" min="0" :save-options="{autoSave:true,key:'rowGap'}"/>
          </a-form-item>
          <a-form-item :label="t('columnGap')">
            <h-number-input v-model:value="columnGap" size="small" min="0" :save-options="{autoSave:true,key:'columnGap'}"/>
          </a-form-item>
        </a-form>
        <h-code v-show="showCss" :code="previewCss" lang="CSS" />
        <h-code v-show="!showCss" :code="previewHtml" lang="HTML" />
        <a-button id="btn" type="primary" size="small" @click="() => (showCss = !showCss)">
          {{ t('show') }} {{ showCss ? 'HTML' : 'CSS' }}
        </a-button>
      </div>
    </template>
    <template #right>
      <div>
        <div class="main">
          <!-- 列定义 -->
          <section
            class="colunits"
            :style="{
              gridTemplateColumns: colTemplate,
              gridTemplateRows: '50px',
              gridColumnGap: columnGap + 'px',
              gridRowGap: rowGap + 'px',
            }"
          >
            <div v-for="(col, i) in inputColArr" :key="i">
              <a-input
                v-model:value.lazy="col.unit"
                :class="`col-cum-input ${column > 7 ? 'widthfull' : ''}`"
                @change="validateunit(col.unit, i, colArr)"
              />
            </div>
          </section>
          <!-- 行定义 -->
          <section
            class="rowunits"
            :style="{
              gridTemplateColumns: '50px',
              gridTemplateRows: rowTemplate,
              gridColumnGap: columnGap + 'px',
              gridRowGap: rowGap + 'px',
            }"
          >
            <div v-for="(row, i) in inputRowArr" :key="i">
              <a-input
                v-model:value.lazy="row.unit"
                class="col-cum-input"
                @change="validateunit(row.unit, i, rowArr)"
              />
            </div>
          </section>
          <!-- 网格内容 -->
          <div id="gridContainer">
            <section
              class="grid"
              :style="{
                gridTemplateColumns: colTemplate,
                gridTemplateRows: rowTemplate,
                gridColumnGap: columnGap + 'px',
                gridRowGap: rowGap + 'px',
              }"
            >
              <div v-for="(item, i) in divNum" :key="i" :class="'box' + i" />
            </section>
          </div>
        </div>
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import type { Ref } from 'vue';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
type TArrRef = Ref<
  {
    unit: string;
  }[]
>;

const createArr = (direction: number) => {
  //初始化 都为1fr
  const arr = [];
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: '1fr' });
  }
  return arr;
};

const row = ref(3);
const column = ref(3);
const rowGap = ref(0);
const columnGap = ref(0);
const divNum = computed<number>(() => {
  const num = row.value * column.value;
  return num;
});

//样式
const rowArr = ref(createArr(row.value));
const colArr = ref(createArr(column.value));
//输入 做一个区分 进行校验
const inputRowArr = ref(createArr(row.value));
const inputColArr = ref(createArr(column.value));

const showCss = ref<boolean>(true);

const previewHtml = computed(() => {
  let content = `<div class="container">\n`;
  for (let i = 0; i < divNum.value; i++) {
    content += '\t<div></div>\n';
  }

  return `${content}</div>`;
});

const previewCss = computed(() => {
  return `.container{
    display: grid;
    grid-template-rows: ${rowTemplate.value};
    grid-template-columns: ${colTemplate.value};
    grid-row-gap:${rowGap.value}px;
    grid-column-gap:${columnGap.value}px;
  }`;
});

// 计算列样式
const colTemplate = computed(() => {
  const unitGroups = groupRepeatedUnits(colArr);
  return createRepetition(unitGroups);
});

//计算行样式
const rowTemplate = computed(() => {
  const unitGroups = groupRepeatedUnits(rowArr);
  return createRepetition(unitGroups);
});

//对行列变化进行监听
watch(row, (newRow, oldRow) => {
  adjustArr(oldRow, newRow, rowArr);
  adjustArr(oldRow, newRow, inputRowArr);
});

watch(column, (newCol, oldCol) => {
  adjustArr(oldCol, newCol, colArr);
  adjustArr(oldCol, newCol, inputColArr);
});

//改变input
function adjustArr(oldVal: number, newVal: number, direction: TArrRef) {
  if (newVal > oldVal) {
    const diff = newVal - oldVal;
    for (let i = 0; i < diff; i++) {
      direction.value.push({ unit: '1fr' });
    }
  } else {
    const diff = oldVal - newVal;
    for (let i = 0; i < diff; i++) {
      direction.value.pop();
    }
  }
}

/**
 * 对可重复的方块样式进行统计，方便repeat
 */
function groupRepeatedUnits(templateUnitArray: TArrRef) {
  const templateArray = templateUnitArray.value.map((i) => i['unit']);
  const groups = [[templateArray.shift()]];
  for (const templateUnit of templateArray) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.includes(templateUnit)) {
      lastGroup.push(templateUnit);
    } else {
      groups.push([templateUnit]);
    }
  }
  return groups;
}

/**
 * 返回 template 样式
 */
function createRepetition(groups: (string | undefined)[][], maxRepetition = 1) {
  return groups
    .map((group) =>
      group.length === maxRepetition ? group.join(' ') : `repeat(${group.length}, ${group[0]})`
    )
    .join(' ');
}

/**
校验样式输入
 */
function validateunit(
  unit: string,
  index: number,
  arr: {
    unit: string;
  }[]
) {
  const check =
    unit.endsWith('fr') ||
    unit.endsWith('px') ||
    unit.endsWith('%') ||
    unit.endsWith('em') ||
    unit.endsWith('rem') ||
    unit.endsWith('vw') ||
    unit.endsWith('vh') ||
    unit.endsWith('vmin') ||
    unit.endsWith('q') ||
    unit.endsWith('mm') ||
    unit.endsWith('cm') ||
    unit.endsWith('in') ||
    unit.endsWith('pt') ||
    unit.endsWith('pc') ||
    unit.endsWith('ex') ||
    unit.endsWith('ch') ||
    /minmax/.test(unit) ||
    ['auto', 'min-content', 'max-content'].includes(unit) ||
    Number.parseInt(unit, 10) === 0; // allow 0 as a valid value without a unit
}
</script>

<style lang="less" scoped>
.main {
  height: 500px;
  margin-left: 75px;
}

.rowunits,
.colunits {
  display: grid;
  div {
    text-align: center;
    position: relative;
  }
}

.colunits {
  overflow-x: scroll;
}

.rowunits {
  float: left;
  height: 100%;
  margin-left: -70px;
  div {
    align-self: center;
  }
}

.col-cum-input {
  width: 60px;
}

[mode="dark"] #gridContainer {
  --gird-color: #eee;
}

#gridContainer {
  --gird-color: blue;
  border: 2px solid #ccc;
  width: 100%;
  height: 100%;
  position: relative;
}

.grid {
  width: 100%;
  height: 100%;
  overflow: visible;
  position: absolute;
  display: grid;
  grid-auto-flow: row dense;
  div[class*='box'] {
    border: 1px dotted var(--gird-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
  }
}

.widthfull {
  width: 100%;
}

#btn {
  float: right;
  margin-top: 10px;
}

:deep .ant-form-item {
  margin-bottom: 10px;
}
</style>
