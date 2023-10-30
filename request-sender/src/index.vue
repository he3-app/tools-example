<template>
  <div class="all">
    <!-- 请求 -->
    <div class="http-send">
      <h-input
        v-model:value="request.url"
        allow-clear
        :save-options="{ autoSave: true, key: 'request-sender-input' }"
      >
        <template #addonBefore>
          <h-select
            v-model:value="request.func"
            style="width: auto"
            :style="{ color: methodColor(request.func) }"
            :save-options="{ key: 'request-sender-select-method', autoSave: true }"
          >
            <a-select-option style="color: #008030" value="GET">GET</a-select-option>
            <a-select-option style="color: #ae7a00" value="POST">POST</a-select-option>
            <a-select-option style="color: #623497" value="PATCH">PATCH</a-select-option>
            <a-select-option style="color: #a11a0d" value="DELETE">DELETE</a-select-option>
            <a-select-option style="color: #a80e67" value="OPTIONS">OPTIONS</a-select-option>
            <a-select-option style="color: #008030" value="HEAD">HEAD</a-select-option>
          </h-select>
        </template>
      </h-input>
      <a-button class="send-btn" type="primary" @click="sendRequest">
        {{ t('send') }}
      </a-button>
    </div>

    <div class="content">
      <!-- history list -->
      <splitpanes style="height: 100%" @resized="handleRowSplitpanes">
        <pane min-size="10" :size="layoutInit.row.leftMinSize">
          <div class="history-list">
            <div class="history-class">{{ t('history') }}</div>
            <a-collapse
              v-model:activeKey="historyCollapseActive"
              :bordered="false"
              :header="t('history')"
            >
              <a-collapse-panel
                v-for="(panelItem, paneIndex) in groupHistoryList"
                :key="paneIndex"
                :header="
                  ['Today', 'Yesterday'].includes(panelItem.group)
                    ? t(panelItem.group)
                    : panelItem.group
                "
              >
                <a-list item-layout="horizontal" :data-source="panelItem.items" :split="false">
                  <template #renderItem="{ item, index }">
                    <a-list-item
                      class="list-item"
                      :class="{
                        activeBgColor: item?.id === selListId,
                        hoverBgColor: hoverActive.index === index && hoverActive.id === item?.id,
                      }"
                      @click="handleHistoryItem(index, item)"
                      @mouseenter="handleMouseEvent(index, item)"
                      @mouseleave="handleMouseEvent(-1)"
                    >
                      <div class="list-item-msg">
                        <div style="margin-right: 8px" :style="{ color: methodColor(item.func) }">
                          {{ item.func }}
                        </div>
                        <div style="white-space: nowrap; overflow: hidden; " >{{ item.url }}</div>
                      </div>
                      <Transition name="fade">
                        <div
                          class="delete"
                          v-show="hoverActive.index === index && hoverActive.id === item?.id"
                        >
                          <CloseOutlined size="small" @click.stop="handleDelete(index, item)" />
                        </div>
                      </Transition>
                    </a-list-item>
                  </template>
                </a-list>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </pane>
        <pane min-size="10" :size="layoutInit.row.rightMinSize">
          <splitpanes
            class="http-content"
            horizontal
            style="height: 100%"
            @resized="handleColSplitpanes"
          >
            <pane min-size="10" :size="layoutInit.col.upMinSize">
              <!-- 设置 -->
              <a-tabs v-model:activeKey="activeKey" style="height: 100%">
                <a-tab-pane key="1" tab="Params">
                  <h-kv-input
                    :model-value="request.params.toString()"
                    mode="list"
                    :default-value="defaultRequest.params"
                    @change="onParamsChange"
                  />
                </a-tab-pane>
                <a-tab-pane key="2" tab="Authorization" force-render>
                  <a-space direction="vertical" style="width: 100%">
                    <h2>Authorization Type:</h2>
                    <a-select v-model:value="request.authorization.type">
                      <a-select-option value="No">No Auth</a-select-option>
                      <a-select-option value="Bearer">Bearer Token</a-select-option>
                      <a-select-option value="Basic">Basic Auth</a-select-option>
                    </a-select>
                    <!-- Bearer -->
                    <a-input
                      v-show="request.authorization.type === 'Bearer'"
                      v-model:value="request.authorization.token"
                      placeholder="token"
                    />
                    <!-- Basic -->
                    <a-input
                      v-show="request.authorization.type === 'Basic'"
                      v-model:value="request.authorization.basic.username"
                      placeholder="username"
                    />
                    <a-input
                      v-show="request.authorization.type === 'Basic'"
                      v-model:value="request.authorization.basic.password"
                      placeholder="password"
                    />
                  </a-space>
                </a-tab-pane>
                <a-tab-pane key="3" tab="Headers">
                  <h-kv-input
                    v-model="headersStr"
                    mode="list"
                    :default-value="defaultRequest.headers"
                    @change="onHeaderChange"
                  />
                </a-tab-pane>
                <a-tab-pane key="4" tab="Body">
                  <a-radio-group v-model:value="request.contentType" name="radioGroup">
                    <a-radio value="none">none</a-radio>
                    <a-radio value="application/x-www-form-urlencoded">
                      x-www-form-urlencoded
                    </a-radio>
                    <a-radio value="multipart/form-data">form-data</a-radio>
                    <a-radio value="application/json">json</a-radio>
                  </a-radio-group>
                  <div v-if="request.contentType == 'none'" class="center">
                    {{ t('body') }}
                  </div>
                  <div
                    v-else-if="
                      request.contentType == 'application/x-www-form-urlencoded' ||
                      request.contentType == 'multipart/form-data'
                    "
                  >
                    <h-kv-input
                      v-model="headersStr"
                      mode="list"
                      :default-value="defaultRequest.body"
                      @change="onBodyChange"
                    />
                  </div>

                  <div v-else>
                    <h-multiline-input
                      v-model="request.body"
                      :save-options="{ autoSave: true, key: 'request-sender-h-multiline-input' }"
                      title=""
                    />
                  </div>
                </a-tab-pane>
              </a-tabs>
            </pane>
            <pane min-size="10" :size="layoutInit.col.downMinSize">
              <!-- 响应 -->
              <a-tabs v-model:activeKey="activeKey2" style="height: 100%">
                <a-tab-pane key="1" :class="response.isImage ? 'img-center' : ''" tab="Body">
                  <img v-if="response.isImage" :src="response.result" />
                  <h-code v-else :code="response.result" :lang="response.lang" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="Headers">
                  <h-kv :value="response.headers" style="max-width: 100%" />
                </a-tab-pane>
                <template #rightExtra>
                  <div v-if="response.status">
                    Status:
                    <span :class="getResponseStatusClass(response.status)">
                      >
                      {{ response.status }}
                    </span>
                    {{ response.statusText }}
                  </div>
                </template>
              </a-tabs>
            </pane>
          </splitpanes>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import prettyJson from 'json-stringify-pretty-compact';
import { html } from 'js-beautify';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import type { AxiosError } from 'axios';
import type { Lang } from '@he3-kit/utils';
import { Pane, Splitpanes } from 'splitpanes'; // https://antoniandre.github.io/splitpanes/
import 'splitpanes/dist/splitpanes.css';
import { CloseOutlined } from '@ant-design/icons-vue';
import { v4 as uuidv4 } from 'uuid';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
type Auth = 'No' | 'Basic' | 'Bearer';
const disabled = ref(false);
const request = reactive({
  func: 'GET',
  url: '',
  params: {},
  authorization: {
    type: 'No' as Auth,
    basic: {
      username: '',
      password: '',
    },
    token: '',
  },
  headers: {
    'Cache-Control': 'no-cache',
    Accept: '*',
  } as any,
  body: '',
  contentType: 'none',
});

const historyCollapseActive = ref([0]);
const activeKey = ref('1');
const activeKey2 = ref('1');
const hoverActive = reactive({
  index: -1,
  id: -1,
});
const layoutInit = reactive({
  row: {
    leftMinSize: '15',
    rightMinSize: '85',
  },
  col: {
    upMinSize: '50',
    downMinSize: '50',
  },
});
const response = reactive({
  status: 0,
  statusText: '',
  result: ' ',
  headers: {},
  isImage: false,
  lang: 'JSON' as Lang,
});

const defaultRequest = reactive({
  params:'',
  headers:'',
  body:'',
})

onMounted(async () => {
  try {
    const previewerValue = JSON.parse(await window.$he3.getToolOptions());
    historyList.value = previewerValue?.value?.data || [];
    if (previewerValue.layoutInit) {
      layoutInit.row = previewerValue.layoutInit?.row;
      layoutInit.col = previewerValue.layoutInit?.col;
    }
    console.log('onMounted', previewerValue, groupHistoryList.value);
  } catch (error) {
    console.log(error);
  }
});

const historyList = ref([]);
const groupHistoryList = computed(() => {
  return groupAndSortByDate(historyList.value);
});
const selListId = ref(-1);
// 根据 HTTP 响应的状态码返回对应的 CSS 类名
function getResponseStatusClass(status) {
  if (status >= 200 && status < 300) {
    return 'http-status-success';
  } else if (status >= 400 && status < 600) {
    return 'http-status-error';
  } else {
    return 'http-status-warning';
  }
}
const sendRequest = async () => {
  selListId.value = -1;
  recordHistory();
  try {
    disabled.value = true;
    let requestData ={
      method: request.func,
      url: /http/.test(request.url) ? request.url : `http://${request.url}` ,
      params: request.params,
      data: request.body,
      auth: request.authorization.type === 'Basic' ? request.authorization.basic : undefined,
      maxRedirects: 0, // 默认值
      headers:
        request.authorization.type === 'Bearer'
          ? Object.assign({}, request.headers, request.contentType, {
              Authorization: `Bearer ${request.authorization.token}`,
            })
          : Object.assign({}, request.headers, request.contentType),
    }
    const res = await window.$he3.requestSender(JSON.parse(JSON.stringify(requestData))) 
    response.headers = Object.assign({}, res.headers);
    const reseponseType = res?.headers['content-type'];
    response.isImage = /image/.test(reseponseType);
    if (response.isImage)
      response.result = /http/.test(request.url) ? request.url : `http://${request.url}`;
    else if (/html/.test(reseponseType)) {
      response.result = html(res.data, {
        indent_size: 2,
      });
      response.lang = 'HTML';
    } else {
      response.result = prettyJson(res.data, { maxLength: 10 });
      response.lang = 'JSON';
    }
    response.status = res.status;
    response.statusText = res.statusText;
    disabled.value = false;
  } catch (error: AxiosError) {
    response.statusText = error.code;
    response.result = error.message;
    window.$he3.message.error(error.message);
    disabled.value = false;
  }
};

const recordHistory = async () => {
  const cloneRequestData = JSON.parse(JSON.stringify(request));
  cloneRequestData.createAt = new Date().getTime();
  let previewerValue;
  try {
    previewerValue = JSON.parse(await window.$he3.getToolOptions());
  } catch (error) {
    console.log(error);
  }
  const value = {
    name: 'requestHistory',
  };
  cloneRequestData.id = uuidv4();
  console.log(value);
  previewerValue?.value?.data
    ? (value.data = [...previewerValue?.value?.data, cloneRequestData])
    : (value.data = [cloneRequestData]);
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      value,
    },
  });
  historyList.value.push(cloneRequestData);
};

function groupAndSortByDate(data) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 创建分组对象
  const groups = {};

  // 分组
  data.forEach((item) => {
    const itemDate = new Date(item.createAt);
    if (isSameDate(itemDate, today)) {
      addToGroup(groups, 'Today', item);
    } else if (isSameDate(itemDate, yesterday)) {
      addToGroup(groups, 'Yesterday', item);
    } else {
      const yearMonth = getYearMonth(itemDate);
      addToGroup(groups, yearMonth, item);
    }
  });

  // 排序
  const sortedGroups = Object.keys(groups).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA;
  });

  // 构建结果数组
  const result = [];
  sortedGroups.forEach((group) => {
    const sortedItems = groups[group].sort((a, b) => {
      const dateA = new Date(a.createAt);
      const dateB = new Date(b.createAt);
      return dateB - dateA;
    });
    result.push({ group, items: sortedItems });
  });

  return result;
}

function addToGroup(groups, groupName, item) {
  if (!groups[groupName]) {
    groups[groupName] = [];
  }
  groups[groupName].push(item);
}

function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getYearMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要加1
  return `${year}-${month}`;
}

const paramsStr = ref('');
const changeParamStr = window._.debounce((newValue: string) => {
  try {
    request.params = JSON.parse(newValue);
  } catch (error) {
    console.log(error);
  }
}, 1000);
watch(() => paramsStr.value, changeParamStr);
const headersStr = ref('');
const bodyStr = ref('');
const changeHeadersStr = window._.debounce((newValue: string) => {
  try {
    request.headers = JSON.parse(newValue);
  } catch (error) {
    console.log(error);
  }
}, 1000);
const changeBodyStr = window._.debounce((newValue: string) => {
  try {
    request.body = JSON.parse(newValue);
  } catch (error) {
    console.log(error);
  }
}, 1000);
watch(() => headersStr.value, changeHeadersStr);
watch(() => bodyStr.value, changeBodyStr);
interface KVRow {
  key: string;
  value: string;
  index: number;
}


const onParamsChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total;
    return Object.assign(total, { [cur.key]: cur.value });
  }, {});
  request.params = obj;
};
const onHeaderChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total;
    return Object.assign(total, { [cur.key]: cur.value });
  }, {});
  request.headers = obj;
};
const onBodyChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total;
    return Object.assign(total, { [cur.key]: cur.value });
  }, {});
  request.body = obj;
};
const handleMouseEvent = (index: number, item: any) => {
  hoverActive.index = index;
  hoverActive.id = item?.id;
};

const handleDelete = (index, item) => {
  selListId.value = -1;
  const value = {
    name: 'requestHistory',
  };
  const indexOf = historyList.value.findIndex((historyItem) => historyItem.id === item.id);
  historyList.value.splice(indexOf, 1);
  value.data = JSON.parse(JSON.stringify(historyList.value));
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      value,
    },
  });
};

const methodColor = (func) => {
  switch (func) {
    case 'GET':
      return '#008030';
    case 'POST':
      return '#AE7A00';
    case 'PUT':
      return '#0053B8';
    case 'PATCH':
      return '#623497';
    case 'DELETE':
      return '#A11A0D';
    case 'OPTIONS':
      return '#A80E67';
    case 'HEAD':
      return '#008030';
  }
};

const handleHistoryItem = (index, item) => {
  selListId.value = item?.id;
  request.func = item.func;
  request.url = item.url;
  request.authorization = item.authorization;
  request.headers = item.headers;
  request.body = item.body;
  request.contentType = item.contentType;
  // paramsStr.value = JSON.stringify(item.params)
  request.params = item.params;

  defaultRequest.body = item.body;
  defaultRequest.headers = item.headers;
  defaultRequest.params = item.params;

};

const handleRowSplitpanes = (e) => {
  layoutInit.row.leftMinSize = String(e[0].size);
  layoutInit.row.rightMinSize = String(e[1].size);
  const cloneData = JSON.parse(JSON.stringify(layoutInit));
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      layoutInit: cloneData,
    },
  });
};
const handleColSplitpanes = (e) => {
  layoutInit.col.upMinSize = String(e[0].size);
  layoutInit.col.downMinSize = String(e[1].size);
  const cloneData = JSON.parse(JSON.stringify(layoutInit));
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      layoutInit: cloneData,
    },
  });
};
</script>
<style scoped lang="less">
[mode='dark'] .all{
  --splitpanes-border-color:rgba(135, 141, 146, 0.6);
  --splitpanes-http-bg:rgba(135, 141, 146, 0.6);
  --history-list-bg: #343744;
  --history-color: #abb7c9;
  --ant-collapse-header-color: #abb7c9;
  --active-bg-color: #4c4f5f;
  --hover-bg-color: #3e4252;
  --list-item-msg-color:#abb7c9;
}

.all {
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  --splitpanes-border-color:rgba(209, 222, 232, 0.6);
  --splitpanes-http-bg:rgba(209, 222, 232, 0.6);
  --history-list-bg: #f4f8fb;
  --history-color: #191d23;
  --ant-collapse-header-color:rgba(8, 23, 53, 0.45);
  --active-bg-color: hsl(208, 35%, 93%);
  --hover-bg-color: #edf0f4;
  --list-item-msg-color:rgba(8, 23, 53, 0.85);
  --ant-tabs-nav-border-color:rgba(209, 222, 232, 0.60);
  .http-send {
    display: flex;
    justify-content: center;
    align-items: center;
    .send-btn {
      display: flex;
      margin-left: 20px;
      width: 120px;
      height: 40px;
      padding: 5px 16px;
      justify-content: center;
      align-items: center;
    }
  }
  .content {
    display: flex;
    width: 100%;
    height: 100%;
    margin-top: 8px;
    :deep(.splitpanes__splitter) {
      background: var(--splitpanes-border-color);
      border-right: 1px solid var(--splitpanes-border-color);
      box-sizing: border-box;
      cursor: col-resize;
      &:hover {
        border-right: 8px solid var(--splitpanes-border-color);
      }
    }
    .history-list {
      width: 100%;
      height: 100%;
      background: var(--history-list-bg);
      border-radius: 16px 0px 0px 16px;
      padding: 16px;
      overflow: scroll;
      padding-right: 0px;
      :deep(.ant-list-item) {
        padding: 4px 0 !important;
      }
      :deep(.ant-collapse-item) {
        background: var(--history-list-bg);
      }
      :deep(.ant-collapse-item) {
        border: none;
      }
      :deep(.ant-collapse-header) {
        font-family: Nunito Sans;
        padding: 12px 0px;
        padding-bottom: 0px;
        color: var(--ant-collapse-header-color);
        font-size: 12px;
        font-weight: 400;
      }
      :deep(.ant-collapse-content-box) {
        padding-bottom: 4px;
      }
      .history-class {
        color: var(--history-color);
        text-shadow: 0 0 0.25px currentcolor;
        font-size: 16px;
      }
      .activeBgColor {
        background:var(--active-bg-color) !important;
      }
      .hoverBgColor {
        background: var(--hover-bg-color);
      }
      .list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        border-radius: 6px;
        margin-bottom: 4px;
        .delete {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 100%;
          border-radius: 6px;
          background-color: inherit;
          position: absolute;
          top: 50%;
          right: 0px;
          transform: translate(0, -50%);
        }
        .list-item-msg {
          color: var(--list-item-msg-color);
          font-size: 14px;
          font-weight: 400;
          width: 100%;
          padding: 4px 12px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
      }
    }
    .http-content {
      display: flex;
      width: 100%;
      border-radius: 0px 16px 16px 0px;
      background: var(--active-bg-color);
      padding: 4px 26px;
      overflow-x: scroll;
      :deep(.splitpanes__splitter) {
        background: var(--splitpanes-http-bg);
        border-bottom: 1px solid var(--splitpanes-http-bg);
        padding: 0px 0px;
        cursor: row-resize;
        &:hover {
          border-bottom: 8px solid var(--splitpanes-http-bg);
        }
      }
      :deep(.ant-tabs-nav::before) {
        border-bottom: 1px solid var(--ant-tabs-nav-border-color);
      }
      :deep(.ant-tabs) {
        color: var(--ant-collapse-header-color);
      }
      :deep(.ant-tabs-content-holder) {
        overflow: scroll;
      }
      :deep(.json) {
        max-width: 100%;
      }
      .img-center {
        display: flex;
        justify-content: center;
      }
      .http-status-success {
        color: green;
      }
      .http-status-error {
        color: red;
      }
      .http-status-warning {
        color: orange;
      }
      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>

