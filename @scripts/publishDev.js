const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');
// 获取token
const he3Token = process.env.HE3_TOKEN;
const feishuToken = process.env.FEISHU_TOKEN;
const baseUrl = process.env.BASE_URL;
// 获取commit作者
const latestAuthor = execSync('git log -1 --pretty=format:"%an"').toString();
// 获取上一次 commit 的 hash 值
const lastCommitHash = execSync('git log --format="%H" -n 1 HEAD^').toString().trim();
// 获取上一次 commit 的提交信息
const lastCommitMessage = execSync(`git log --pretty=format:"%s" ${lastCommitHash} -n 1`)
  .toString()
  .trim();
const successArr = [];
const errorArr = [];

const folders = fs
  .readdirSync('./', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

async function publish() {
  for (const folder of folders) {
    if (
      [
        '.git',
        '.idea',
        '.suspence',
        '.vscode',
        '@template',
        '@scripts',
        '.github',
        'node_modules',
        '@packages',
      ].includes(folder)
    )
      continue;
    const folderPath = path.join(process.cwd(), folder);
    const packagePath = path.join(process.cwd(), folder, 'package.json');

    let packageJson = fs.readFileSync(packagePath, 'utf8');
    packageJson = JSON.parse(packageJson);
    const he3 = packageJson.he3;

    if (Array.isArray(he3)) {
      for (let { version, id } of he3) {
        const currentVersion = await getRemoteVersion(id);

        if (currentVersion !== version || !currentVersion) {
          console.log('------------------------');
          console.log('开始工具', id);
          console.log('远程版本:', currentVersion);
          console.log('本地版本:', version);
          console.log('版本不等，开始构建');
          try {
            res = await execSync(
              'npm install --registry=https://registry.npm.taobao.org && ' +
                'npm update --registry=https://registry.npm.taobao.org && ' +
                `npm run publish -- --include=${id} --token=${he3Token} --url=${baseUrl}`,
              { cwd: folderPath, stdio: 'inherit' }
            );
            if ((await getRemoteVersion(id)) === version) {
              console.log('✅ 发布成功！', id);
              successArr.push(id);
            } else {
              console.log('❌发布失败', id);
              errorArr.push(id);
            }
          } catch (e) {
            console.log('❌发布失败', id);
            errorArr.push(id);
            console.log(e);
          }
        }
      }
    } else {
      let { version, id } = he3;
      const currentVersion = await getRemoteVersion(id);

      let res = null;
      if (currentVersion !== version || !currentVersion) {
        console.log('------------------------');
        console.log('开始工具', id);
        console.log('远程版本:', currentVersion);
        console.log('本地版本:', version);
        console.log('版本不等，开始构建');
        try {
          res = await execSync(
            'npm install --registry=https://registry.npm.taobao.org && ' +
              'npm update --registry=https://registry.npm.taobao.org && ' +
              `npm run publish -- --token=${he3Token} --url=${baseUrl}`,
            { cwd: folderPath, stdio: 'inherit' }
          );
          if ((await getRemoteVersion(id)) === version) {
            console.log('✅ 发布成功！', id);
            successArr.push(id);
          } else {
            console.log('❌发布失败', id);
            errorArr.push(id);
          }
        } catch (e) {
          console.log('❌发布失败', id);
          errorArr.push(id);
          console.log(e);
        }
      }
    }
  }

  console.log('\n\n===========================');
  console.log(`发版完毕👏 \n发版成功: ${successArr.join(',')}\n发版失败: ${errorArr.join(',')} `);
  console.log('===========================');
  sendMsg(`> 测试环境工具发布
  Author: ${latestAuthor}
  发版成功: ${successArr.join(',')}
  发版失败: ${errorArr.join(',')} 
  commit: ${lastCommitMessage}
  详情可见: https://github.com/he3-app/tools/actions/workflows/publish_dev.yaml
  `);
}

publish();

function httpRequest(url, method, headers, data) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers,
    };

    const request = https.request(url, options, (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        resolve(responseData);
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    if (data) {
      request.write(data);
    }

    request.end();
  });
}

async function getRemoteVersion(id) {
  let remoteVersion = await httpRequest(`${baseUrl}/v1/hub/tool/${id}/currentVersion`);

  try {
    remoteVersion = JSON.parse(remoteVersion);
  } catch (e) {
    console.log(id, '❌解析版本获取失败', e);
  }

  let { currentVersion } = remoteVersion;
  return currentVersion;
}

function sendMsg(msg) {
  let obj = {
    msg_type: 'text',
    content: {
      title: 'Tools Publish - TEST',
      text: msg,
    },
  };
  feishuToken &&
    httpRequest(
      `https://open.feishu.cn/open-apis/bot/v2/hook/${feishuToken}`,
      'POST',
      '',
      JSON.stringify(obj)
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
}
