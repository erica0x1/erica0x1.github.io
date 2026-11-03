# Erica Lin — Portfolio

9 个项目、独立详情页和 Makeup Class 的完整 10 页规则。所有图片均保存在本地，网站无需安装网页框架。

## 打开预览

直接用浏览器打开 index.html，或在此文件夹运行：

```sh
node scripts/serve.mjs
```

然后打开 http://127.0.0.1:4173 。

## 修改内容

- content/projects.json：项目介绍、角色、链接、图库。
- scripts/build.mjs：首页与项目页模板。
- styles.css：桌面与手机样式。
- app.js：分类筛选、图片放大、结尾图的剧透保护。
- assets/images/：经过压缩的原有展示素材。

修改项目数据或模板后运行：

```sh
node scripts/build.mjs
```

## GitHub 与上线

仓库：https://github.com/erica0x1/portfolio

网站使用相对路径，可用于 GitHub Pages 的 /portfolio/ 项目地址。
上传文件与开启 GitHub Pages 是两步；当前初版以本地预览为准。
通过 GitHub Desktop 保存并 Push origin 上传更新。

待补充内容见 CONTENT_CHECKLIST.md。

## 内容来源

- 旧网站：https://ercxlin.wixsite.com/portfolio
- To Rei 正式页面：https://ericalin.itch.io/to-rei
- 新项目介绍结合 Erica 指定的项目身份、既有设计讨论与本地项目记录整理。
- Line by Line 概述参考其创意总监的公开介绍：https://mfzhou.carrd.co/

开发截图和 Last Call 早期印刷样张均有版本说明，不作为最新完成版本的证明。
