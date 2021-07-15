# jenkinsDeployInfo
简单获取文件夹内最新文件内容的小项目


## 怎么使用
配置config.json

```bash
npm i -g aok.js
npm i -g cute.curl

aok .

cute http://localhost:11540/deploy?node=b2b

```

## 部署 info
0. npm i
修改deploy.info
修改 api/config.json
1. nssm 方式部署
2. path:  C:\Program Files\nodejs\node.exe
3. startup Dir :  E:\jenkins\tools\site 
4. argument :  deploy.info.js


##  查看部署的版本
```bash
chrome http://localhost:11540/infos.html

```
