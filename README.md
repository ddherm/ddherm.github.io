# 方凱 · Kai Fang 个人网站

展示个人作品、论文介绍、研究方向与教育背景的静态网站。页面内容以个人信息主档为事实来源，保留个人贡献、作者顺序及已发表／已录用／在投等状态。

网站地址：[ddherm.github.io](https://ddherm.github.io/)。

视觉以图学习与无人机通信网络为主题。首页的城市拓扑与多跳路径为交互示意，不是实时仿真结果；可切换拓扑和路由视图。项目采用重点案例与错落布局，论文保留独立的状态筛选与引用下载。

## 本地预览

在本目录运行：

```bash
python3 -m http.server 4173 --directory dist
```

浏览器打开 <http://localhost:4173>。静态文件不需要安装前端依赖或执行构建。

## 内容维护

- `dist/content.js`：维护论文的结构化内容。修改论文状态时，同时核对作者身份、年份和链接。
- `dist/app.js`：维护项目详情的中英文文案与交互逻辑。
- `scripts/prepare.mjs`：同步生成 BibTeX 下载文件和无 JavaScript 时的完整论文列表。修改论文数据后运行 `node scripts/prepare.mjs`；GitHub Actions 也会自动执行。
- `dist/index.html`：首页结构和项目介绍的页面文案；调整首页文字时检查对应的中英文版本。
- `dist/assets/`：项目截图与品牌图标。Movo 截图使用演示项目数据；UavNetSim 截图展示平台界面。
- `dist/assets/fonts/`：自托管的 Space Grotesk 字体与 OFL 许可证；中文正文采用系统中文字体。
- `.github/workflows/pages.yml`：将 `dist/` 部署到 GitHub Pages。

更新个人经历或论文状态时，先核对本人确认的事实与对应材料，再同步中英文文案和引用文件。仓库只保存公开网站所需文件。

## 发布到 GitHub Pages

GitHub 账号为 **ddherm**，推荐新建公开仓库 **ddherm.github.io**，将本目录作为该仓库的根目录，推送到 `main` 分支。

1. 在 GitHub 仓库打开 **Settings → Pages**。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送 `main` 分支，或在 **Actions → Deploy GitHub Pages** 中点击 **Run workflow**。
4. 工作流成功后，预期网址为 **<https://ddherm.github.io>**。

本仓库使用 GitHub Actions 发布，后续推送到 `main` 会触发网站更新。若使用其他仓库名，GitHub Pages 会使用对应项目路径。

GitHub Pages 托管本作品集的静态页面；Flash Pocket 等应用通过作品链接访问，Movo 与 UavNetSim 的运行服务不包含在该静态部署中。

## 展示范围

- **Movo**：语音驱动的网页原型开发助手，个人开源项目、本机 MVP。
- **Flash Pocket**：已上线的智能知识管理系统，个人全栈作品，使用 AI 辅助编程完成。
- **UavNetSim**：无人机通信网络仿真平台，方凱为主要作者之一，侧重强化学习优化、仿真测试与工程集成。
- **论文与研究**：强化学习、图与时空学习、动态路由、可信通信及 LLM 应用；论文状态以页面标注为准。

项目源码与文档的版权和许可证以各项目原仓库为准。
