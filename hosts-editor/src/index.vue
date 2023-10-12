<template>
  <div class="box">
    <!-- <div class="btns">
      <a-button type="primary" :loading="saveLoading" @click="applyHost">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        {{ t("apply") }}
      </a-button>
      <a-button type="primary" :loading="saveLoading" @click="saveHost">
        <template #icon>
          <CheckOutlined />
        </template>
        {{ t("save") }}
      </a-button>
    </div> -->
    <div class="content">
      <div class="list">
        <a-list item-layout="horizontal" :data-source="listDate">
          <template #renderItem="{ item, index }">
            <a-list-item
              class="normal"
              :class="{ bgColor: index === selListIndex }"
              @click="selListIndex = index"
            >
              <span
                ><desktop-outlined
                  v-if="index === 0"
                  style="margin-right: 5px"
                /><file-text-outlined v-else style="margin-right: 5px" />
                <span class="title">{{ item.title }}</span>
              </span>
              <div class="delete" v-if="item?.key !== 0">
                <div @click="handleApplyHost(item)">
                  <a-switch :checked="item.isApply" />
                </div>
                <delete-outlined class="delete-icon" @click="deleteAll(item)" />
              </div>
            </a-list-item>
          </template>
          <div class="add">
            <a-button
              type="primary"
              @click="addFile"
              block
              :icon="h(PlusOutlined)"
              >{{ t("addMsg") }}</a-button
            >
          </div>
        </a-list>
      </div>
      <div class="hosts-editor">
        <div class="code-editor">
          <h-code-editor
            @change="handleEditFile"
            :disabled="listDate[selListIndex]?.key === 0"
            v-model="listDate[selListIndex].content"
            :lang="'SHELL'"
          />
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      :title="t('addFileText')"
      @ok="confirm"
      :ok-text="t('confirm')"
      :cancel-text="t('cancel')"
      @cancel="handleCancel"
    >
      <div>
        <span>{{ t("modelMsg") }}</span>
        <h-input v-model:value="nameMsg" autoSelect />
      </div>
    </a-modal>
    <a-modal
      v-model:visible="showPswdModel"
      :title="t('checkAbility')"
      @ok="getPswd"
      :ok-text="t('confirm')"
      :cancel-text="t('cancel')"
      @cancel="showPswdModel = false"
    >
      <div>
        <span>{{ t("pswdInput") }}</span>
        <a-input-password v-model:value="pswd" autoSelect />
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { h } from "vue";
import messages from "./lang.json";
import {
  DeleteOutlined,
  PlusOutlined,
  DesktopOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const startLine = "# --- HE3_CONTENT_START ---";
const endLine = "# --- HE3_CONTENT_END ---";
const selListIndex = ref(0);
const visible = ref(false);
const showPswdModel = ref(false);
const hosts = ref("");
let nameMsg = ref("");
let maxKey = ref(0);
const pswd = ref("");
const getSystemHosts = async function () {
  const {
    content,
    readonly: fileReadonly,
    path,
  } = await window.$he3.getSystemHosts();
  hosts.value = content;
  listDate.value[0].content = content;
};
const listDate = ref([
  {
    key: 0,
    title: "系统 Hosts",
    content: hosts.value || "",
  },
]);
function handleDate(data) {
  return data.filter((item, index, self) => {
    return index === self.findIndex((t) => t.key === item.key);
  });
}
onMounted(async () => {
  getSystemHosts();
  const previewerValue = JSON.parse(await $he3.getToolOptions());
  console.log("previewerValue", previewerValue);
  listDate.value = [...listDate.value, ...JSON.parse(previewerValue.content)];
  listDate.value = handleDate(listDate.value);
  let arr = listDate.value.map((item) => {
    return item.key;
  });
  maxKey.value = arr.reduce((a, b) => Math.max(a, b), -Infinity);
});
const saveLoading = ref(false);
const saveHost = async (data, actionType) => {
  const element = listDate.value.find((item) => item?.key === data.key);
  const elementIndex = listDate.value.indexOf(element);
  if (elementIndex !== -1 && actionType === "update") {
    listDate.value[elementIndex] = data;
  } else if (elementIndex !== -1 && actionType === "delete") {
    listDate.value.splice(elementIndex, 1);
    selListIndex.value = 0;
  } else if (actionType === "add") {
    listDate.value.push(data);
    selListIndex.value = listDate.value.length - 1;
  }
  listDate.value = handleDate(listDate.value);
  let optionsContent;
  try {
    optionsContent = JSON.stringify(listDate.value);
  } catch (error) {
    optionsContent = "";
  }
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      test: "saveDate",
      content: optionsContent,
    },
  });
};

const editHost = async (data) => {
  saveLoading.value = true;
  let newHostContent = hosts.value;
  let cloneListData = JSON.parse(JSON.stringify(listDate.value));

  //初始化,删除原有的host文件
  newHostContent = deleteHe3Host(newHostContent);

  // 添加到host文件
  newHostContent += "\n" + startLine;
  cloneListData.forEach((element) => {
    if (element.isApply === true) {
      let searchString =
        "\n\n" + `# ${element.title}` + "\n" + element.content + "\n";
      newHostContent += searchString;
    }
  });

  newHostContent += "\n" + endLine;
  if (cloneListData.some((item) => item.isApply === true) === false) {
    newHostContent = deleteHe3Host(newHostContent);
  }

  try {
    const res = await window.$he3.setSystemHosts(newHostContent, pswd.value);
  } catch (error) {
    window.$he3.message.error(t("applyFailed"));
    currentApplyData.value = data;
    currentActionType.value = "update";
    showPswdModel.value = true;
    return;
  } finally {
    saveLoading.value = false;
  }

  //成功后更新
  saveHost(data, "update");
  listDate.value = cloneListData;
  listDate.value[0].content = newHostContent;
  let optionsContent;
  try {
    optionsContent = JSON.stringify(listDate.value);
  } catch (error) {
    optionsContent = "";
  }
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      test: "saveDate",
      content: optionsContent,
    },
  });
};

const applyHost = async (data) => {
  saveLoading.value = true;
  currentActionType.value = "update";
  let newHostContent = hosts.value;

  newHostContent = initOriginHost(newHostContent, data);
  try {
    const res = await window.$he3.setSystemHosts(newHostContent, pswd.value);
    //更新host
    listDate.value[0].content = newHostContent;
    hosts.value = newHostContent;

    window.$he3.message.success(t("applySuccess"));
    data.isApply = !data.isApply;
    saveHost(data, "update");
  } catch (error) {
    window.$he3.message.error(t("applyFailed"));
    currentApplyData.value = data;
    showPswdModel.value = true;
    return;
  } finally {
    saveLoading.value = false;
  }
};

const deleteHe3Host = (inputString) => {
  const lines = inputString.split("\n");
  const outputLines = [];

  let skipLines = false;
  for (const line of lines) {
    if (line.trim() === startLine) {
      skipLines = true;
      continue;
    }
    if (line.trim() === endLine) {
      skipLines = false;
      continue;
    }
    if (!skipLines) {
      outputLines.push(line);
    }
  }

  let outputString = outputLines.join("\n");

  return outputString;
};

const initOriginHost = (newHostContent, data) => {
  //初始化,删除原有的host文件
  newHostContent = deleteHe3Host(newHostContent);

  // 添加到host文件
  newHostContent += "\n" + startLine;
  const cloneListData = JSON.parse(JSON.stringify(listDate.value));
  cloneListData.forEach((element) => {
    if (element.key === data.key) {
      element.isApply = !element.isApply;
    }
    if (element.isApply === true) {
      let searchString =
        "\n\n" + `# ${element.title}` + "\n" + element.content + "\n";
      newHostContent += searchString;
    }
  });
  newHostContent += "\n" + endLine;
  if (cloneListData.some((item) => item.isApply === true) === false) {
    newHostContent = deleteHe3Host(newHostContent);
  }
  return newHostContent;
};

async function deleteAll(data) {
  let newHostContent = hosts.value;
  let cloneListData;
  try {
    cloneListData = JSON.parse(JSON.stringify(listDate.value));
  } catch (error) {
    cloneListData = [];
  }
  const indexOf = cloneListData.findIndex((item) => item.key === data.key);
  cloneListData = cloneListData.filter((item, index) => index !== indexOf);

  //初始化,删除原有的host文件
  newHostContent = deleteHe3Host(newHostContent);
  // 添加到host文件
  newHostContent += "\n" + startLine;
  cloneListData.forEach((element) => {
    if (element.key === data.key) {
      element.isApply = !element.isApply;
    }
    if (element.isApply === true) {
      let searchString =
        "\n\n" + `# ${element.title}` + "\n" + element.content + "\n";
      newHostContent += searchString;
    }
  });
  newHostContent += "\n" + endLine;
  if (cloneListData.some((item) => item.isApply === true) === false) {
    newHostContent = deleteHe3Host(newHostContent);
  }
  try {
    const res = await window.$he3.setSystemHosts(newHostContent, pswd.value);
  } catch (error) {
    window.$he3.message.error(t("applyFailed"));
    currentApplyData.value = data;
    currentActionType.value = "delete";
    showPswdModel.value = true;
    return;
  } finally {
    saveLoading.value = false;
  }

  //成功后更新
  saveHost(data, "delete");
  listDate.value = cloneListData;
  listDate.value[0].content = newHostContent;
  selListIndex.value = 0;
  window.$he3.message.success(t("deleteMsg"));
  let optionsContent;
  try {
    optionsContent = JSON.stringify(listDate.value);
  } catch (error) {
    optionsContent = [];
  }
  window.$he3.uploadToolOptions({
    id: window.$he3.toolId,
    options: {
      test: "saveDate",
      content: optionsContent,
    },
  });
}
function addFile() {
  visible.value = true;
}
function handleCancel() {
  visible.value = false;
  nameMsg.value = "";
}
async function confirm() {
  const previewerValue = JSON.parse(await $he3.getToolOptions());
  let contentData = JSON.parse(previewerValue.content);
  const isRepeat = contentData.some((item) => item.title === nameMsg.value);
  console.log(isRepeat);
  if (nameMsg.value == "" || isRepeat === true) {
    window.$he3.message.warning(t("warnMsg"));
    return;
  } else {
    let newDate = {
      key: maxKey.value + 1,
      title: nameMsg.value,
      content: "",
      isApply: false,
    };
    maxKey.value += 1;
    saveHost(newDate, "add");
    visible.value = false;
    nameMsg.value = "";
    window.$he3.message.success(t("addSuccessMsg"));
  }
}

const handleEditFile = _.throttle(async (e) => {
  if (listDate.value[selListIndex.value]?.isApply) {
    editHost(listDate.value[selListIndex.value]);
  } else {
    saveHost(listDate.value[selListIndex.value], "update");
  }
  // const res = await window.$he3.setSystemHosts(newHostContent);
}, 2000);

const currentApplyData = ref([]);
const currentActionType = ref("");
const handleApplyHost = (data) => {
  applyHost(data);
};

const getPswd = () => {
  switch (currentActionType.value) {
    case "delete":
      deleteAll(currentApplyData.value);
      break;
    case "update":
      applyHost(currentApplyData.value);
      break;
  }
  showPswdModel.value = false;
  currentActionType.value = "";
};
</script>
<style lang="less" scoped>
[mode="dark"] .box {
  .content {
    .list {
      background: #4d4f5f;
      .normal {
        border: 1px solid #292c38;
        &.bgColor {
          background: #292c38;
        }
        .title {
          color: var(--dark, #abb7c9);
          font-family: Nunito Sans;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
        }
      }
    }
  }
}

.box {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .btns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .content {
    display: flex;
    flex: 1;
    .list {
      width: 300px;
      min-width: 250px;
      border-radius: 6px;
      font-weight: bolder;
      height: 100%;
      overflow: auto;
      background-color: #f4f8fb;
      :deep(.ant-list-items:nth-child(1)) {
        margin-top: 4%;
      }
      :deep(.ant-list-items) {
        padding: 0 10px;
        li {
          padding: 10px;
        }
      }
      .normal {
        border: 1px solid #d7dde3;
        border-radius: 5px;
        margin-bottom: 5px;
        cursor: pointer;
        &.bgColor {
          background-color: #e2ebf2;
        }
        .title {
          color: rgba(8, 23, 53, 0.85);
          font-family: Nunito Sans;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
        }
        .delete {
          display: flex;
          justify-content: center;
          align-items: center;
          .delete-icon {
            margin-left: 8px;
          }
        }
      }
      .add {
        width: 100%;
        padding: 0 10px;
        font-weight: bold;
        margin-bottom: 4%;
      }
    }
    .hosts-editor {
      max-width: 700px;
      min-width: 650px;
      flex: 1;

      .code-editor {
        height: 100%;
      }
    }
  }
}
</style>
