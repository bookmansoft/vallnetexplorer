# vallnetexplorer

**游戏金链区块链浏览器.**

## Quick Start

To get started, first you should run gamegoldnode on local mathine, then

```sh
npm i
npm start
```

在文件[www/ionic.config.json]中配置远程节点地址

```json
{
  "name": "vallnetexplorer",
  "integrations": {
    "cordova": {}
  },
  "type": "ionic-angular",
  "proxies": [
    {
      "path": "/api",
      "proxyUrl": "http://114.116.107.218:2102/public/"
    }
  ],
  "hooks": {}
}
```
## 部署须知

1. 如果出现"[npm] sh: ionic-app-scripts: command not found"

```sh
npm i @ionic/app-scripts@3.2.4
```

2. linux需要把node/bin加到path中,否则npm i -g 安装的就找不到命令

3. linux下安装node-sass需要sudo才行