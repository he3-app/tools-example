<template>
  <h-single-layout :max-width="1280">
    <div class="crontab">
      <a-radio-group v-model:value="mode" style="margin-bottom: 20px">
        <a-radio-button value="common">Common</a-radio-button>
        <a-radio-button value="linux">Linux Crontab</a-radio-button>
      </a-radio-group>
      <a-form>
        <a-formItem :label="t('CronExpression')">
          <h-input v-model:value="userInput" auto-select @blur="cronChange" :autoFillInputCondition="isCron" />
        </a-formItem>
        <a-formItem>
          <a-tabs v-model:activeKey="activeTabsKey" centered>
            <a-tabPane v-if="mode === 'common'" key="second" :tab="t('Seconds.name')">
              <a-radioGroup v-model:value="cronState.second.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Seconds.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Seconds.interval[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.second.incrementIncrement"
                        :min="0"
                        :max="59"
                        :disabled="cronState.second.tabType !== 2"
                      />
                      <span>{{ t('Seconds.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.second.incrementStart"
                        :min="0"
                        :max="59"
                        :disabled="cronState.second.tabType !== 2"
                      />
                      <span>{{ t('Seconds.interval[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Seconds.cycle[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.second.rangeStart"
                        :min="0"
                        :max="59"
                        :disabled="cronState.second.tabType !== 3"
                      />
                      <span>{{ t('Seconds.cycle[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.second.rangeEnd"
                        :min="0"
                        :max="59"
                        :disabled="cronState.second.tabType !== 3"
                      />
                      <span>{{ t('Seconds.cycle[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Seconds.specific') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.second.specials"
                      :disabled="cronState.second.tabType !== 4"
                    >
                      <a-row>
                        <a-col v-for="(_, index) in 60" :key="index" :span="2">
                          <a-checkbox :key="index" :value="index.toString()">
                            {{ index }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
            <a-tabPane key="minute" :tab="t('Minutes.name')">
              <a-radioGroup v-model:value="cronState.minute.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Minutes.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Minutes.interval[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.minute.incrementIncrement"
                        :min="0"
                        :max="59"
                        :disabled="cronState.minute.tabType !== 2"
                      />
                      <span>{{ t('Minutes.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.minute.incrementStart"
                        :min="0"
                        :max="59"
                        :disabled="cronState.minute.tabType !== 2"
                      />
                      <span>{{ t('Minutes.interval[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Minutes.cycle[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.minute.rangeStart"
                        :min="0"
                        :max="59"
                        :disabled="cronState.minute.tabType !== 3"
                      />
                      <span>{{ t('Minutes.cycle[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.minute.rangeEnd"
                        :min="0"
                        :max="59"
                        :disabled="cronState.minute.tabType !== 3"
                      />
                      <span>{{ t('Minutes.cycle[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Minutes.specific') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.minute.specials"
                      :disabled="cronState.minute.tabType !== 4"
                    >
                      <a-row>
                        <a-col v-for="(_, index) in 60" :key="index" :span="2">
                          <a-checkbox :key="index" :value="index.toString()">
                            {{ index }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
            <a-tabPane key="hour" :tab="t('Hours.name')">
              <a-radioGroup v-model:value="cronState.hour.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Hours.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Hours.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.hour.incrementIncrement"
                        :min="0"
                        :max="23"
                        :disabled="cronState.hour.tabType !== 2"
                      />
                      <span>{{ t('Hours.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.hour.incrementStart"
                        :min="0"
                        :max="23"
                        :disabled="cronState.hour.tabType !== 2"
                      />
                      <span>{{ t('Hours.interval[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Hours.cycle[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.hour.rangeStart"
                        :min="0"
                        :max="23"
                        :disabled="cronState.hour.tabType !== 3"
                      />
                      <span>{{ t('Hours.cycle[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.hour.rangeEnd"
                        :min="0"
                        :max="23"
                        :disabled="cronState.hour.tabType !== 3"
                      />
                      <span>{{ t('Hours.cycle[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Hours.specific') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.hour.specials"
                      :disabled="cronState.hour.tabType !== 4"
                    >
                      <a-row>
                        <a-col v-for="(_, index) in 24" :key="index" :span="2">
                          <a-checkbox :key="index" :value="index.toString()">
                            {{ index }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
            <a-tabPane key="dayOfMonth" :tab="t('Day.name')">
              <a-radioGroup v-model:value="cronState.day.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Day.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Day.intervalDay[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.day.incrementIncrement"
                        :min="1"
                        :max="31"
                        :disabled="cronState.day.tabType !== 2"
                      />
                      <span>{{ t('Day.intervalDay[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.day.incrementStart"
                        :min="1"
                        :max="31"
                        :disabled="cronState.day.tabType !== 2"
                      />
                      <span>{{ t('Day.intervalDay[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Day.cycleDay[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.day.rangeStart"
                        :min="1"
                        :max="31"
                        :disabled="cronState.day.tabType !== 3"
                      />
                      <span>{{ t('Day.cycleDay[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.day.rangeEnd"
                        :min="1"
                        :max="31"
                        :disabled="cronState.day.tabType !== 3"
                      />
                      <span>{{ t('Day.cycleDay[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Day.specificDay') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.day.specials"
                      :disabled="cronState.day.tabType !== 4"
                    >
                      <a-row>
                        <a-col v-for="(item, index) in 31" :key="index" :span="2">
                          <a-checkbox :key="index" :value="item.toString()">
                            {{ item }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                  <a-radio :value="5">
                    <span>{{ t('Day.noSpecific') }}</span>
                  </a-radio>
                  <a-radio :value="6">
                    <span>{{ t('Day.lastDay') }}</span>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
            <a-tabPane key="month" :tab="t('Month.name')">
              <a-radioGroup v-model:value="cronState.month.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Month.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Month.interval[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.month.incrementIncrement"
                        :min="1"
                        :max="12"
                        :disabled="cronState.month.tabType !== 2"
                      />
                      <span>{{ t('Month.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.month.incrementStart"
                        :min="1"
                        :max="12"
                        :disabled="cronState.month.tabType !== 2"
                      />
                      <span>{{ t('Month.interval[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Month.cycle[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.month.rangeStart"
                        :min="1"
                        :max="12"
                        :disabled="cronState.month.tabType !== 3"
                      />
                      <span>{{ t('Month.cycle[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.month.rangeEnd"
                        :min="1"
                        :max="12"
                        :disabled="cronState.month.tabType !== 3"
                      />
                      <span>{{ t('Month.cycle[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Month.specific') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.month.specials"
                      :disabled="cronState.month.tabType !== 4"
                    >
                      <a-row>
                        <a-col v-for="(item, index) in 12" :key="index" :span="2">
                          <a-checkbox :key="index" :value="item.toString()">
                            {{ item }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
            <a-tabPane key="dayOfWeek" :tab="t('Week.name')">
              <a-radioGroup v-model:value="cronState.week.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Week.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Week.interval[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.week.incrementIncrement"
                        :min="1"
                        :max="7"
                        :disabled="cronState.week.tabType !== 2"
                      />
                      <span>{{ t('Week.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.week.incrementStart"
                        :min="1"
                        :max="7"
                        :disabled="cronState.week.tabType !== 2"
                      />
                      <span>{{ t('Week.interval[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Week.cycle[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.week.rangeStart"
                        :min="1"
                        :max="7"
                        :disabled="cronState.week.tabType !== 3"
                      />
                      <span>{{ t('Week.cycle[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.week.rangeEnd"
                        :min="1"
                        :max="7"
                        :disabled="cronState.week.tabType !== 3"
                      />
                    </a-space>
                    <span>{{ t('Week.cycle[2]') }}</span>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Week.specific') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.week.specials"
                      :disabled="cronState.week.tabType !== 4"
                    >
                      <a-row>
                        <a-col v-for="(item, index) in 7" :key="index" :span="3">
                          <a-checkbox :key="index" :value="item.toString()">
                            {{ item }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                  <a-radio :value="5">
                    <span>{{ t('Week.noSpecific') }}</span>
                  </a-radio>
                  <a-radio :value="6">
                    <span>{{ t('Week.lastWeek') }}</span>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
            <a-tabPane v-if="mode === 'common'" key="year" :tab="t('Year.name')">
              <a-radioGroup v-model:value="cronState.year.tabType">
                <a-space direction="vertical">
                  <a-radio :value="1">{{ t('Year.every') }}</a-radio>
                  <a-radio :value="2">
                    <a-space>
                      <span>{{ t('Year.interval[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.year.incrementIncrement"
                        :min="1"
                        :max="2099"
                        :disabled="cronState.year.tabType !== 2"
                      />
                      <span>{{ t('Year.interval[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.year.incrementStart"
                        :min="new Date().getFullYear()"
                        :max="2099"
                        :disabled="cronState.year.tabType !== 2"
                      />
                      <span>{{ t('Year.interval[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="3">
                    <a-space>
                      <span>{{ t('Year.cycle[0]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.year.rangeStart"
                        :min="new Date().getFullYear()"
                        :max="2099"
                        :disabled="cronState.year.tabType !== 3"
                      />
                      <span>{{ t('Year.cycle[1]') }}</span>
                      <a-inputNumber
                        v-model:value="cronState.year.rangeEnd"
                        :min="new Date().getFullYear()"
                        :max="2099"
                        :disabled="cronState.year.tabType !== 3"
                      />
                      <span>{{ t('Year.cycle[2]') }}</span>
                    </a-space>
                  </a-radio>
                  <a-radio :value="4">
                    <span>{{ t('Year.specific') }}</span>
                    <a-checkboxGroup
                      v-model:value="cronState.year.specials"
                      :disabled="cronState.year.tabType !== 4"
                    >
                      <a-row>
                        <a-col
                          v-for="(item, index) in 2100 - new Date().getFullYear()"
                          :key="index"
                          :span="3"
                        >
                          <a-checkbox
                            :key="index"
                            :value="(new Date().getFullYear() + index).toString()"
                          >
                            {{ (new Date().getFullYear() + index).toString() }}
                          </a-checkbox>
                        </a-col>
                      </a-row>
                    </a-checkboxGroup>
                  </a-radio>
                  <a-radio :value="5">
                    <span>{{ t('Year.noSpecific') }}</span>
                  </a-radio>
                </a-space>
              </a-radioGroup>
            </a-tabPane>
          </a-tabs>
        </a-formItem>
        <!--      <a-formItem>-->
        <!--        <Button type="primary" @click="tryRunHandler">Try Run</Button>-->
        <!--      </a-formItem>-->
      </a-form>

      <h-singleline :title="t('CronExpressionOutput')" :value="cronState?.cronExpression" />
      <h-singleline :title="t('CronExpressionExecute')" :value="cronState?.cronExpressionExecute" />
      <!--    result:-->
      <!--    <div v-for="item in nextRuns" :key="item">-->
      <!--      {{ item }}-->
      <!--    </div>-->
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import cronParser from 'cron-parser';
import cronParserV2 from '@chuxingpay/cron-parser';
import cronstrue from 'cronstrue/i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useI18n } from 'vue-i18n';
import { getCurrentLang, langEnum } from './utilsLang';
import { isCron } from './regs';

import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

dayjs.extend(utc);
dayjs.extend(timezone);

let lang = 'en';
const langMap = {
  [langEnum.EN]: 'en',
  [langEnum.ZH]: 'zh_CN',
  [langEnum.ZH_TW]: 'zh_TW',
  [langEnum.ES]: 'es',
  [langEnum.JA]: 'ja',
  [langEnum.KO]: 'ko',
  [langEnum.DE]: 'de',
  [langEnum.FR]: 'fr',
  [langEnum.IT]: 'it',
  [langEnum.RU]: 'ru',
  [langEnum.PT]: 'pt',
};
onMounted(() => {
  const currentLang = getCurrentLang();
  lang = langMap[currentLang];
});

const userInput = ref('0/2 * * * * ?');
const mode = ref<'common' | 'linux'>('common');
const activeTabsKey = ref('second');
const cronState = ref({
  second: {
    tabType: 1,
    incrementStart: 0,
    incrementIncrement: 3,
    rangeStart: 0,
    rangeEnd: 0,
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.second.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.second.incrementStart}/${cronState.value.second.incrementIncrement}`;
          case 3:
            return `${cronState.value.second.rangeStart}-${cronState.value.second.rangeEnd}`;
          case 4:
            return cronState.value.second.specials.join(',');
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.second.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.second.tabType = 2;
          cronState.value.second.incrementStart = Number(value.split('/')[0]);
          cronState.value.second.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.second.tabType = 3;
          cronState.value.second.rangeStart = Number(value.split('-')[0]);
          cronState.value.second.rangeEnd = Number(value.split('-')[1]);
        } else {
          cronState.value.second.tabType = 4;
          cronState.value.second.specials = value.split(',');
        }
      },
    }),
  },
  minute: {
    tabType: 1,
    incrementStart: 0,
    incrementIncrement: 3,
    rangeStart: 0,
    rangeEnd: 0,
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.minute.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.minute.incrementStart}/${cronState.value.minute.incrementIncrement}`;
          case 3:
            return `${cronState.value.minute.rangeStart}-${cronState.value.minute.rangeEnd}`;
          case 4:
            return cronState.value.minute.specials.join(',');
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.minute.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.minute.tabType = 2;
          cronState.value.minute.incrementStart = Number(value.split('/')[0]);
          cronState.value.minute.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.minute.tabType = 3;
          cronState.value.minute.rangeStart = Number(value.split('-')[0]);
          cronState.value.minute.rangeEnd = Number(value.split('-')[1]);
        } else {
          cronState.value.minute.tabType = 4;
          cronState.value.minute.specials = value.split(',');
        }
      },
    }),
  },
  hour: {
    tabType: 1,
    incrementStart: 0,
    incrementIncrement: 3,
    rangeStart: 0,
    rangeEnd: 0,
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.hour.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.hour.incrementStart}/${cronState.value.hour.incrementIncrement}`;
          case 3:
            return `${cronState.value.hour.rangeStart}-${cronState.value.hour.rangeEnd}`;
          case 4:
            return cronState.value.hour.specials.join(',');
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.hour.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.hour.tabType = 2;
          cronState.value.hour.incrementStart = Number(value.split('/')[0]);
          cronState.value.hour.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.hour.tabType = 3;
          cronState.value.hour.rangeStart = Number(value.split('-')[0]);
          cronState.value.hour.rangeEnd = Number(value.split('-')[1]);
        } else {
          cronState.value.hour.tabType = 4;
          cronState.value.hour.specials = value.split(',');
        }
      },
    }),
  },
  day: {
    tabType: 1,
    incrementStart: 1,
    incrementIncrement: 3,
    rangeStart: 1,
    rangeEnd: 3,
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.day.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.day.incrementStart}/${cronState.value.day.incrementIncrement}`;
          case 3:
            return `${cronState.value.day.rangeStart}-${cronState.value.day.rangeEnd}`;
          case 4:
            return cronState.value.day.specials.join(',');
          case 5:
            return '?';
          case 6:
            return 'L';
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.day.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.day.tabType = 2;
          cronState.value.day.incrementStart = Number(value.split('/')[0]);
          cronState.value.day.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.day.tabType = 3;
          cronState.value.day.rangeStart = Number(value.split('-')[0]);
          cronState.value.day.rangeEnd = Number(value.split('-')[1]);
        } else if (value === '?') {
          cronState.value.day.tabType = 5;
        } else if (value === 'L') {
          cronState.value.day.tabType = 6;
        } else {
          cronState.value.day.tabType = 4;
          cronState.value.day.specials = value.split(',');
        }
      },
    }),
  },
  month: {
    tabType: 1,
    incrementStart: 1,
    incrementIncrement: 3,
    rangeStart: 1,
    rangeEnd: 3,
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.month.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.month.incrementStart}/${cronState.value.month.incrementIncrement}`;
          case 3:
            return `${cronState.value.month.rangeStart}-${cronState.value.month.rangeEnd}`;
          case 4:
            return cronState.value.month.specials.join(',');
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.month.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.month.tabType = 2;
          cronState.value.month.incrementStart = Number(value.split('/')[0]);
          cronState.value.month.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.month.tabType = 3;
          cronState.value.month.rangeStart = Number(value.split('-')[0]);
          cronState.value.month.rangeEnd = Number(value.split('-')[1]);
        } else {
          cronState.value.month.tabType = 4;
          cronState.value.month.specials = value.split(',');
        }
      },
    }),
  },
  week: {
    tabType: 1,
    incrementStart: 1,
    incrementIncrement: 3,
    rangeStart: 1,
    rangeEnd: 3,
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.week.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.week.incrementStart}/${cronState.value.week.incrementIncrement}`;
          case 3:
            return `${cronState.value.week.rangeStart}-${cronState.value.week.rangeEnd}`;
          case 4:
            return cronState.value.week.specials.join(',');
          case 5:
            return '?';
          case 6:
            return 'L';
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.week.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.week.tabType = 2;
          cronState.value.week.incrementStart = Number(value.split('/')[0]);
          cronState.value.week.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.week.tabType = 3;
          cronState.value.week.rangeStart = Number(value.split('-')[0]);
          cronState.value.week.rangeEnd = Number(value.split('-')[1]);
        } else if (value === '?') {
          cronState.value.week.tabType = 5;
        } else if (value === 'L') {
          cronState.value.week.tabType = 6;
        } else {
          cronState.value.week.tabType = 4;
          cronState.value.week.specials = value.split(',');
        }
      },
    }),
  },
  year: {
    tabType: 1,
    incrementStart: new Date().getFullYear(),
    incrementIncrement: 3,
    rangeStart: new Date().getFullYear(),
    rangeEnd: new Date().getFullYear(),
    specials: [],
    value: computed({
      get() {
        switch (cronState.value.year.tabType) {
          case 1:
            return '*';
          case 2:
            return `${cronState.value.year.incrementStart}/${cronState.value.year.incrementIncrement}`;
          case 3:
            return `${cronState.value.year.rangeStart}-${cronState.value.year.rangeEnd}`;
          case 4:
            return cronState.value.year.specials.join(',');
          case 5:
            return '';
          default:
            return '*';
        }
      },
      set(value) {
        if (value === '*') {
          cronState.value.year.tabType = 1;
        } else if (value.includes('/')) {
          cronState.value.year.tabType = 2;
          cronState.value.year.incrementStart = Number(value.split('/')[0]);
          cronState.value.year.incrementIncrement = Number(value.split('/')[1]);
        } else if (value.includes('-')) {
          cronState.value.year.tabType = 3;
          cronState.value.year.rangeStart = Number(value.split('-')[0]);
          cronState.value.year.rangeEnd = Number(value.split('-')[1]);
        } else if (value === '') {
          cronState.value.year.tabType = 5;
        } else {
          cronState.value.year.tabType = 4;
          cronState.value.year.specials = value.split(',');
        }
      },
    }),
  },
  cronExpression: computed(() => {
    const resultArr = [];
    mode.value === 'common' ? resultArr.push(cronState.value.second.value) : '';
    resultArr.push(
      cronState.value.minute.value,
      cronState.value.hour.value,
      cronState.value.day.value,
      cronState.value.month.value,
      cronState.value.week.value
    );
    if (cronState.value.year.value) {
      resultArr.push(cronState.value.year.value);
    }
    return resultArr.join(' ');
  }),
  cronExpressionExecute: computed(() => {
    if (cronState.value.cronExpression) {
      let str = cronState.value.cronExpression;
      if (mode.value === 'linux') {
        const arr = cronState.value.cronExpression.split(/\s+/);
        arr.unshift('0');
        str = arr.join(' ');
      }
      try {
        return cronstrue.toString(str, {
          locale: lang,
        });
      } catch (error) {
        return error;
      }
    }
  }),
});

function parseCron(cron: string) {
  if (mode.value === 'linux') cron = LinuxParseCron(cron);
  const option = {
    tz: dayjs.tz.guess(),
  };
  try {
    return cronParser.parseExpression(cron, option);
  } catch {
    try {
      return cronParserV2.parseExpression(cron, option);
    } catch (e) {
      console.error(e);
    }
  }
}

function LinuxParseCron(cron: string) {
  const arr = cron.split(/\s+/);
  arr.unshift('0');
  return arr.join(' ');
}

function cronChange() {
  const splitUserInput = userInput.value.split(/\s+/);
  if (splitUserInput.length < 5 || splitUserInput.length > 7) {
    window.$he3.message.warn('cron表达式格式错误');
    return;
  }
  const result = parseCron(userInput.value);
  if (!result) {
    window.$he3.message.warn('cron表达式错误');
    return;
  }
  if (mode.value === 'common') {
    cronState.value.second.value = splitUserInput[0];
    cronState.value.minute.value = splitUserInput[1];
    cronState.value.hour.value = splitUserInput[2];
    cronState.value.day.value = splitUserInput[3];
    cronState.value.month.value = splitUserInput[4];
    cronState.value.week.value = splitUserInput[5];
    cronState.value.year.value = splitUserInput.length === 7 ? splitUserInput[6] : '';
  } else {
    cronState.value.minute.value = splitUserInput[0];
    cronState.value.hour.value = splitUserInput[1];
    cronState.value.day.value = splitUserInput[2];
    cronState.value.month.value = splitUserInput[3];
    cronState.value.week.value = splitUserInput[4];
  }
}
</script>

<style scoped lang="less"></style>
