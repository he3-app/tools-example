import fs from 'fs';
import { OpenAIChat } from "langchain/llms/openai";

exec()
async function exec() {
  const AiToolsJsonRes = await generateAiToolsJson('我需要感谢信生成工具')
  if (!AiToolsJsonRes) {
    return
  }
  const id = AiToolsJsonRes.id;
  const description = AiToolsJsonRes.description
  const keywords = AiToolsJsonRes.keywords
  const prompt = AiToolsJsonRes.prompt
  createFile(id)
  appendPromptFile(id, prompt)
  readAndWriteJsonFile(id, description, keywords);
  readAndWriteI18nJsonFile(id, description, keywords)
}

async function generateAiToolsJson(
  topic, plt='gpt4'
) {
  const messages = `我要你充当ChatGPT提示生成器，我发个话题，你首先要根据话题的内容生成ChatGPT提示词作为 prompt，你生成的提示词不能少于 200 字，你生成的提示词必须以”我需要你作为“开头，你生成的提示词需要模仿下面的8 个话题的提示词：
1.育儿师
我们应以幼儿园老师的方式回答2-6岁孩子提出的各种奇思妙想的问题。要用生动活泼的语气和亲和力回答，尽量避免复杂的词汇和抽象概念。我们的答案应该具体易懂，能用比喻和实例结合动画片或绘本场景解释。此外，我们应该提供更多实际行动来加深孩子的理解力。你准备好了吗？

2.辩论者的角色
我们将提供一些与时事相关的话题，你的任务是研究辩论双方，为每一方提供有效的论据，并反驳对方的观点。你还需要根据证据得出有说服力的结论。你的目标是帮助人们从辩论中获得更多的知识和关于当前话题的洞察。

3.人工智能写作导师
我们将提供一个需要帮助提高写作水平的学生，你的任务是使用人工智能工具如自然语言处理，给予学生如何提高写作水平的反馈。你还应该运用修辞学知识和有效写作技巧，建议学生如何更好地以书面形式表达思想和观点。我首先需要你修改一段文本。

4.书面作品的标题生成器
我将提供一篇文章的主题和关键词，你需为其生成五个吸引人的标题。请确保标题简洁，不超过20个字，并保持其意义。回复时请使用吸引读者的语言风格。我的第一个题目是文章的内容。

5.箴言书
请提供明智的建议、激励人心的名言和有意义的谚语，以帮助指导我的日常决策。如果必要的话，你还可以给出将这些建议付诸实践的具体方法或其他相关主题。我的第一个要求是...

6.小说家
请构思创意独特、吸引人的故事，能够持久地吸引读者。你可以选择不同的体裁,如幻想、浪漫、历史等，但要注意情节、角色和高潮的吸引力。我的第一个要求是...

7.编剧
请为一部长篇电影或网络剧开发一个有创意、吸引观众的剧本。首先构思有趣的人物、故事背景和人物对话。一旦角色发展完整，请创造一个扣人心弦、充满曲折的故事情节，让观众一直保持悬念，直到故事结束。我的第一个要求是剧本的主题。

8.讲故事人
请构思一则具有娱乐性的故事，吸引人并富有想象力，能引起观众的注意。可以是童话故事、教育故事或其他类型的故事，以各自目标受众选择相应的主题或话题。我第一个要求是...

其次，你要根据我给的话题生成一个符合短横线命名法(不是下划线)的英文变量名称作为 id，尽可能见词知意，尽可能简短，你需要返回一个默认的最优结果。
然后，你需要根据你生成的提示词生成描述信息description, 描述信息要简短且易于理解, 描述信息必须是英语。
最后，你需要为生成的提示词生成 5 个 SEO 关键词 keywords, 关键词必须是英语。
你的回复必须要将 prompt， id， description， keywords 放在一个 json 文件中返回。
话题：${ topic }`;

  const model = new OpenAIChat({
    temperature: .8,
    streaming: false,
    azureOpenAIApiInstanceName: 'he3-prod',
    azureOpenAIApiKey: '7b6bca61a51446d7a9cb0172bdcd1523',
    azureOpenAIApiVersion: '2023-05-15',
    azureOpenAIApiDeploymentName:
      plt === "gpt3"
        ? 'gpt-35-turbo'
        : 'gpt-4',
  });

  try {
    return JSON.parse(await model.call(messages))
  } catch {
    return null
  }
}

async function genAiToolI18nJson(
  enString
) {
  const messages = `你现在是翻译 I18n 国际化的文案的助手，你需要将文案翻译成这些语言 "zh-cn","en", "zh-tw", "de","es","fr","it","ja","ko","pt","ru",
按照不同语言进行分组，最后返回格式化后的json代码块给我, 不要做任何解释和扩充
${enString}
`;

  const model = new OpenAIChat({
    temperature: .8,
    streaming: false,
    azureOpenAIApiInstanceName: 'he3-prod',
    azureOpenAIApiKey: '7b6bca61a51446d7a9cb0172bdcd1523',
    azureOpenAIApiVersion: '2023-05-15',
    azureOpenAIApiDeploymentName: 'gpt-35-turbo'
  });

  try {
    return JSON.parse(await model.call(messages))
  } catch {
    return null
  }
}



function readAndWriteJsonFile(id, description, keywords) {
  const path = 'package.json';
  try {
    const data = fs.readFileSync(path, 'utf8');
    let jsonObj = JSON.parse(data);
    jsonObj.he3.push({
      ...jsonObj.he3[0],
      id: id,
      name: kebabToSpaceCase(id),
      version: '1.0.0',
      description: description,
      keywords: keywords
    });
    fs.writeFileSync(path, JSON.stringify(jsonObj), 'utf8');
  } catch (err) {
    console.error('readAndWriteJsonFile 读取或写入文件时发生错误:', err);
  }
}

async function readAndWriteI18nJsonFile(id, description, keywords) {
  const i18n = await genAiToolI18nJson(`"en": {\n' +
    '      "$name": ${kebabToSpaceCase(id)},\n' +
    '      "$description": ${description},\n' +
    '      "$keywords": [${keywords}]\n' +
    '    },`)
  const path = 'meta.locale.json';
  try {
    const data = fs.readFileSync(path, 'utf8');
    let jsonObj = JSON.parse(data);
    jsonObj.push({
      id: id,
      ...i18n
    });
    fs.writeFileSync(path, JSON.stringify(jsonObj), 'utf8');
  } catch (err) {
    console.error('readAndWriteI18nJsonFile 读取或写入文件时发生错误:', err);
  }
}

function appendPromptFile(id, prompt) {
  const filePath = './src/utils/prompt.ts';
  const contentToAppend = `
  export const ${ kebabToPascalCase(id) } = '${ prompt }'
  `;
  try {
    fs.appendFileSync(filePath, contentToAppend, 'utf8');
  } catch (e) {
    console.error('appendPromptFile 写入文件时发生错误:', err);
  }
}

/**
 * 创建提示词工具文件
 * @param id
 */
function createFile(id) {
  // 短横线连接命名
  const kebabFilePath = './src/' + id + '.ts';
  const content = `import { promptboot } from '@he3-kit/utils';
import {${ kebabToPascalCase(id) }} from './utils/prompt';

export default promptboot({
  prompt: ${ kebabToPascalCase(id) }.trim(),
});
`;
  try {
    fs.writeFileSync(kebabFilePath, content, 'utf8');
  } catch (err) {
    console.error('createFile 写入文件时发生错误:', err);
  }
}

/**
 * 短横线转为驼峰
 * @param kebabCaseString
 */
function kebabToPascalCase(kebabCaseString) {
  const words = kebabCaseString.split('-');
  const pascalCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return pascalCaseWords.join('');
}

/**
 * 短横线转为大写空格
 * @param kebabCaseString
 */
function kebabToSpaceCase(kebabCaseString) {
  const words = kebabCaseString.split('-');
  const pascalCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return pascalCaseWords.join(' ');
}