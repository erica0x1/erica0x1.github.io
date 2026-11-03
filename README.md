# Erica Lin — Portfolio

9 个项目、独立详情页和 Makeup Class 的完整 10 页规则。所有图片均保存在本地，网站无需安装网页框架。

## 打开预览

在此文件夹运行本地预览（粉笔与 WebGL 效果建议通过这个地址查看）：

```sh
node scripts/serve.mjs
```

然后打开 http://127.0.0.1:4173 。

## 修改内容

- content/projects.json：项目介绍、角色、链接、图库。
- scripts/build.mjs：页面生成与项目页模板。
- scripts/home-template.mjs：黑板首页、精选作品、个人介绍与桌宠。
- styles.css：基础与项目页样式；studio.css：新版纸张、黑板、桌宠与手机样式。
- app.js：项目图片放大与结尾图的剧透保护。
- studio.js：黑板绘画、三张作品的颗粒鼠标效果、信封展开、摸猫与 Spotify。
- assets/images/：经过压缩的原有展示素材。
- assets/studio/：新制作的像素猫、粉笔、黑板擦；生成记录见该目录 README.md。
- favicon.svg：奶油底、松针绿 e 与酒红色小点的新标志。已提供 ICO、32px PNG 和 180px Apple 主屏幕图标；修改形状后可用 scripts/build-icons.py 重新导出（需要 Pillow）。

修改项目数据或模板后运行：

```sh
node scripts/build.mjs
```

## GitHub 与上线

仓库：https://github.com/erica0x1/portfolio

公开网站：https://erica0x1.github.io/portfolio/

2026-11-03 已按 Erica 的要求将仓库设为 Public，并开启 GitHub Pages。
发布来源为 main 分支的根目录；以后通过 GitHub Desktop 保存并 Push origin，GitHub 会自动更新公开网站。
修改项目数据或页面模板后，先运行上面的 build 命令，再提交生成的页面。
手机和其他电脑直接打开公开链接即可，不依赖本机预览服务。

待补充内容见 CONTENT_CHECKLIST.md。

## 内容来源

- 旧网站：https://ercxlin.wixsite.com/portfolio
- To Rei 正式页面：https://ericalin.itch.io/to-rei
- 新项目介绍结合 Erica 指定的项目身份、既有设计讨论与本地项目记录整理。
- Line by Line 概述参考其创意总监的公开介绍：https://mfzhou.carrd.co/

开发截图和 Last Call 早期印刷样张均有版本说明，不作为最新完成版本的证明。

## 新版交互

- 默认展示 Line by Line、Sleepwalk、To Rei，点击 View all 9 games 展开其余六个游戏。
- 点击或拖动粉笔 / 黑板擦，然后在黑板上按住拖动；restore the board 恢复，Esc 放下工具。
- 三张精选图都有局部 WebGL Bayer 颗粒效果；不支持 WebGL 时使用 Canvas 降级。手机正常展示原图。
- 个人介绍从信封展开为照片、信件、笔记；窄屏按实际纸张高度依次排列。
- 灰白猫和 studio radio 固定在首页右下角，猫有眨眼、被摸与睡觉状态。
- Spotify 使用 Erica 提供的歌单，点开才加载，不自动播放。当前预览环境显示试听；完整播放由 Spotify 的访问条件决定。
- 尊重系统的减少动态效果设置；折叠内容不进入键盘焦点顺序。
- 圣诞点缀：松针绿与酒红、黑板角落挂饰、格纹纸胶带、冬青邮票和猫旁的小礼物。

2026-11-03 验证：11 个页面与 301 个本地引用检查通过；实际操作过粉笔绘画、擦除、恢复、全部游戏展开、信封开关、摸猫、Spotify 加载及项目图库；检查桌面、390px 和 320px 窄屏。
