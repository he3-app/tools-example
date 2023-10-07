// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs-cdn");
const axios = require("axios");

const CdnClient = tencentcloud.cdn.v20180606.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_ID,
    secretKey: process.env.TENCENT_SECRET,
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "cdn.tencentcloudapi.com",
    },
  },
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new CdnClient(clientConfig);

async function pushCdnCache(tooId){
  try{
    let toolInfo = await axios.get(`https://api.he3app.com/v1/hub/tool/${tooId}`)
    let {id, userId, currentVersion} = toolInfo.data;
    let url = `https://cdn.he3app.com/${userId}/${id}/${currentVersion}/index.umd.js`
    let params ={
      Urls: [url]
    }
    await client.PushUrlsCache(params)
  }catch (e){
    console.log('预热cdn失败');
    console.log(e);
  }
}

module.exports = {
  pushCdnCache
}
