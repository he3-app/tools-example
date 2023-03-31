import { h, resolveComponent } from "vue"
import register from "./utils/register"
import { Ref } from 'vue'
export default register({
  inputHandler: async (str: string) => {
    return await window.$he3.jsonToCSType(str)
  },
  lang: 'CSHARP',
  // TODO: Complete function.
  slot: {
    left: () => h(
      resolveComponent('a-button'),
      {
        type: 'primary', // 按钮类型
        // icon: 'InteractionOutlined',
        size: 'small',
        onClick:
          // 执行需要完成的函数
          async function (_event: any,
            inputValue: Ref<string>,
            outputValue: Ref<string>,) {
            const str = await window.$he3.jsonToOther('csharp', inputValue.value)
            outputValue.value = str
          },
      },
      "Complete",
    ),
  }
})