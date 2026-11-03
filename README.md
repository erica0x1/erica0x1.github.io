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
- scripts/build.mjs：页面生成；scripts/project-template.mjs：项目页模板。
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

- 默认展示 Spatial Tinting（大图）、Sleepwalk 和 To Rei（小图），点击 View all 9 games 展开其余六个游戏。All / Digital / Tabletop 可切换分类；后两项直接展示该分类全部作品。
- 点击或拖动粉笔 / 黑板擦，然后在黑板上按住拖动；restore the board 恢复，Esc 放下工具。
- 三张精选图都有局部 WebGL Bayer 颗粒效果；不支持 WebGL 时使用 Canvas 降级。手机正常展示原图。
- 个人介绍从信封展开为照片、信件、笔记；窄屏按实际纸张高度依次排列。
- 灰白猫和 studio radio 固定在首页右下角，猫有眨眼、被摸与睡觉状态。
- Spotify 使用 Erica 提供的歌单，点开才加载，不自动播放。当前预览环境显示试听；完整播放由 Spotify 的访问条件决定。
- 尊重系统的减少动态效果设置；折叠内容不进入键盘焦点顺序。
- 圣诞点缀：松针绿与酒红、黑板角落挂饰、格纹纸胶带、冬青邮票和猫旁的小礼物。

2026-11-03 验证：11 个页面与 301 个本地引用检查通过；实际操作过粉笔绘画、擦除、恢复、全部游戏展开、信封开关、摸猫、Spotify 加载及项目图库；检查桌面、390px 和 320px 窄屏。

## 颗粒效果兼容检查

2026-11-03：改为预乘透明度输出，闲置时隐藏特效层，并用 CSS 圆形裁剪独立限制范围；鼠标淡出按实际时间计算，切出窗口、离开屏幕或图形上下文丢失时恢复原图。页面资源版本已更新，避免继续加载旧效果。

启动本地预览后，打开 `/tests/dither-regression.html`，点击 **Run regression checks**。17 项检查覆盖生产 shader 的透明像素、局部范围、高分辨率与较低精度、完整封面的留白区域，以及三张图的激活、淡出、窗口失焦和上下文丢失。重新运行前刷新页面，因为最后一项会主动丢弃测试用图形上下文。

这些检查与 390px / 3840px 布局检查已通过；它们不能代替在朋友实际显卡和浏览器上的复核。

## 2026-11-03 内容与交互更新

- 项目数据新增 `teamSize`、`duration`；Line by Line 的开发人数尚未确认，显示 Team project。
- Spatial Tinting、Melodic Function、Makeup Class 使用 `visual` 布局，正文直接展示原作品集页面；Dismember 使用 `hybrid`，保留 Overview / My contribution 后接作品集。`portfolio` 与 `gallery` 分开存储、分开放大翻页。
- 三款数字游戏的 gallery 使用 itch.io 原始截图；Makeup Class 尚无提供的 itch.io 页面，保留实体游戏照片。
- Last Call 加入在线试玩、规则与四人团队署名。新封面与 Dear Little Alice 宣传封面的原素材、提示词记录见 assets/cover-generation.md。
- 黑板使用本地 Caveat / Patrick Hand 字体；约 9px 颗粒粉笔笔刷与粉笔端面匹配，绘画时笔尖跟随落笔位置。
- 手机号按 Erica 要求加入公开 contact 区域。
- 本轮验证：9 个项目元数据完整，18 张作品集页面与游戏图库互不混合，360 个本地引用有效；实际检查分类、放大翻页、粉笔绘画、桌面与 390px 布局，17 项颗粒检查通过。
