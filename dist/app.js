(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let lang = 'zh';
  try { lang = localStorage.getItem('kai-portfolio-language') === 'en' ? 'en' : 'zh'; } catch (_) {}
  let paperFilter = 'all';
  let openItem = null;
  let toastTimer;
  const papers = window.PORTFOLIO_CONTENT?.papers ?? [];
  const t = (zh, en) => lang === 'zh' ? zh : en;
  const external = (url, label, classes = '') => `<a class="${classes}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;
  const projects = {
    movo: {
      title: 'Movo', label: 'Voice-driven web prototyping', image: './assets/movo-plan.png',
      summaryZh: '语音驱动的网页原型开发助手：从一句想法出发，讨论需求、确认方案，再让 Coding Agent 生成可检查的网页原型。',
      summaryEn: 'A voice-driven web prototyping assistant. Discuss an idea, confirm a plan, and let a coding agent generate a web prototype you can inspect.',
      roleZh: '个人开源项目 · 单用户本机 MVP · 2026.09', roleEn: 'Personal open-source project · Single-user local MVP · Sep 2026',
      itemsZh: ['语音或文字澄清需求，确认后交给单个 OpenHands Coding Agent。','在 Docker 工作区生成前端，展示任务进度、待答决策和静态预览。','使用 Pipecat / SmallWebRTC、Silero VAD、FunASR 与 TTS 构建网页语音链路。','已在本人电脑实测跑通语音输入、方案确认、实际生成网页与预览的完整链路。'],
      itemsEn: ['Clarify requirements by voice or text before handing a confirmed plan to one OpenHands coding agent.','Generate frontends in a Docker workspace, with task progress, pending decisions and static previews.','Browser voice interactions use Pipecat / SmallWebRTC, Silero VAD, FunASR and TTS.','The complete voice-to-plan-to-generated-page-to-preview flow was tested locally by the author.'],
      noteZh: '单用户本机 MVP，已跑通完整链路。图中展示真实前端界面，项目与对话使用演示数据。',
      noteEn: 'A single-user local MVP with a tested end-to-end flow. Screenshots show the actual frontend with demo projects and conversations.',
      tags: ['FastAPI','SQLite','React','OpenHands','Pipecat','Docker'], url: 'https://github.com/ddherm/movo', linkZh: '查看源代码', linkEn: 'View source'
    },
    flash: {
      title: 'Flash Pocket', label: 'Personal knowledge management',
      summaryZh: '个人全栈知识管理项目，连接微信 / Web 采集、多格式解析、LLM 摘要与标签、向量入库和语义检索。',
      summaryEn: 'A full-stack personal knowledge system connecting WeChat / web capture, multi-format parsing, LLM summaries and tags, vector storage and semantic search.',
      roleZh: '个人项目 · 全栈开发 · AI 辅助编程 · 已上线', roleEn: 'Personal project · Full-stack development · AI-assisted coding · Launched',
      itemsZh: ['接收文本、链接、图片与文件，支持 PDF、DOCX、PPTX 内容处理。','用 Celery / Redis 异步执行内容解析与 AI 任务。','以 PostgreSQL / pgvector 支持语义检索与多条件内容查询。','提供登录鉴权、文件预览、合集、星标、归档和日历视图。'],
      itemsEn: ['Capture text, links, images and files; parse PDF, DOCX and PPTX content.','Run parsing and AI tasks asynchronously with Celery / Redis.','Use PostgreSQL / pgvector for semantic search and content queries.','Provide authentication, previews, collections, favorites, archiving and a calendar view.'],
      noteZh: '通过 AI 辅助编程完成个人全栈开发，已上线供实际访问。',
      noteEn: 'Built and launched as a personal full-stack project with AI-assisted coding.',
      tags: ['FastAPI','Next.js','PostgreSQL','pgvector','Celery','Redis'],url:'https://www.flashpocket.cn/',linkZh:'访问 Flash Pocket',linkEn:'Visit Flash Pocket'
    },
    uav: {
      title:'UavNetSim',label:'UAV network simulation',image:'./assets/uavnetsim.png',
      summaryZh:'基于 Python / SimPy 的可扩展无人机通信网络仿真平台，覆盖路由、MAC、物理层、无人机移动与能耗模型。',
      summaryEn:'An extensible Python / SimPy platform for UAV communication networks, covering routing, MAC, physical-layer interactions, mobility and energy models.',
      roleZh:'开源项目主要作者之一 · 强化学习优化与仿真测试',roleEn:'One of the principal open-source authors · RL optimization & simulation testing',
      itemsZh:['实现 Q-learning 多目标路由 QMR 的决策、配置、报文、路由表等模块。','完成 OSM2World 场景编译、后端 API 和 React 三维视图集成，相关 PR #9 已合并。','在外部场景依赖不可用时提供内置渲染回退。','基于平台开展 GTR、TRI-FRL 策略训练、消融、基线对比与跨场景验证。'],
      itemsEn:['Implemented decision, configuration, packet and routing-table modules for Q-learning multi-objective routing (QMR).','Integrated OSM2World scene compilation, backend APIs and React 3D views; PR #9 was merged.','Added built-in rendering fallback when external scene dependencies are unavailable.','Used the platform for GTR and TRI-FRL training, ablations, baseline comparisons and cross-scenario evaluation.'],
      noteZh:'本人是平台主要作者之一，主要负责强化学习优化、仿真测试与相关工程集成。',
      noteEn:'A collaborative open-source platform. My work focuses on reinforcement learning optimization, simulation testing and related engineering integration.',
      tags:['Python','SimPy','Q-learning','PPO','React','OSM2World'],url:'https://github.com/Zihao-Felix-Zhou/UavNetSim',linkZh:'查看开源项目',linkEn:'View source'
    },
    echo: {
      title:'EchoMind',label:'Multi-agent support orchestration',
      summaryZh:'面向产品咨询、技术故障与账单咨询的 Agent 项目，通过意图识别与主辅角色协作，结合 RAG、会话记忆和工具调用处理多轮问题。',
      summaryEn:'An agent project for product, technical and billing support. Intent recognition and specialist roles combine RAG, conversation memory and tool calls for multi-turn questions.',
      roleZh:'个人项目 · 本地 Python 后端与 Vue 前端',roleEn:'Personal project · Local Python backend & Vue frontend',
      itemsZh:['通用、技术、账单角色协作与升级交接，使用 asyncio 执行异步编排。','ChromaDB 知识检索、查询改写、多子查询召回与重排。','Redis 工作记忆与 ChromaDB 情景摘要、画像构成分层记忆。','动态 Skills、角色工具白名单、缓存、超时、熔断降级及评测监控。'],
      itemsEn:['Asyncio orchestration of general, technical and billing specialists, with escalation handoffs.','ChromaDB retrieval, query rewriting, multi-query recall and reranking.','Layered memory using Redis working context and ChromaDB summaries and profiles.','Dynamic Skills, tool allowlists, caching, timeouts, circuit breaking, monitoring and evaluation.'],
      noteZh:'本地开发版本，页面介绍对应当前项目源码中的功能。公开上线与真实服务完整联调情况尚未记录。',
      noteEn:'A local development project. The described features reflect the current source code; public deployment and full integration with live services are not yet documented.',
      tags:['FastAPI','asyncio','ChromaDB','Redis','Vue 3','Prometheus']
    }
  };

  function venueHtml(p) {
    const name=p.venue.replace(/\s*· (submitted|accepted)$/,'');
    const m=p.journalMetrics;
    if(!m)return escape(name);
    const rating=t('（JCR '+m.quartile+'，IF = '+m.impactFactor+'）',' (JCR '+m.quartile+', IF = '+m.impactFactor+')');
    return '<strong>'+escape(name)+'</strong><span class="venue-rating">'+escape(rating)+'</span><a class="metric-year" href="'+escape(m.sourceUrl)+'" target="_blank" rel="noopener noreferrer" aria-label="'+escape(t('查看期刊指标官方来源','View official journal metrics'))+'">'+m.year+' JIF</a>';
  }
  function statusLabel(p) {
    return p.id==='P02'?t('预印本','Preprint'):({published:t('已发表','Published'),accepted:t('已录用','Accepted'),submitted:t('在投','Submitted')})[p.status];
  }
  function researchBlocks(p) {
    const sections=[['研究问题','Problem','problem'],['算法与实现','Method','method'],['实验效果','Results','results'],['本人工作','My contribution','contribution'],['实验条件','Evaluation setting','conditions']];
    return sections.map(([zh,en,key])=>{
      const value=p[key+(lang==='zh'?'Zh':'En')];
      return value?'<section class="dialog-content-section research-detail"><h3>'+t(zh,en)+'</h3><p>'+escape(value)+'</p></section>':'';
    }).join('');
  }
  function journalSource(p) {
    const m=p.journalMetrics;if(!m)return '';
    return '<p class="journal-source">'+m.year+' JIF · '+t(m.releaseYear+' 年发布','released in '+m.releaseYear)+' · '+escape(m.category)+'<br>'+external(m.sourceUrl,t('期刊指标来源','Journal metric source'))+(m.quartileSourceUrl?' · '+external(m.quartileSourceUrl,t('JCR 分区来源','JCR quartile source')):'')+'</p>';
  }

  function renderPapers() {
    const query = $('#paper-search').value.trim().toLowerCase();
    const filtered = papers.filter(p => (paperFilter === 'all' || p.status === paperFilter) && [p.title,p.authors,p.venue,p.summaryZh,p.summaryEn,p.problemZh,p.problemEn,p.methodZh,p.methodEn,p.resultsZh,p.resultsEn].join(' ').toLowerCase().includes(query));
    const order = {P01:0,P05:1,P06:2,P07:3,P08:4,P02:5,P04:6,P03:7};
    filtered.sort((a,b) => order[a.id] - order[b.id]);
    $('#paper-list').innerHTML = filtered.length ? filtered.map(p => {
      const status = statusLabel(p);
      const year = p.id === 'P07' ? t('目标 2027','Target 2027') : (p.year || t('进行中','In progress'));
      return `<article class="paper-row"><div class="paper-date"><span class="paper-year">${escape(year)}</span><span class="paper-status ${escape(p.status)}">${status}</span></div><div class="paper-main"><div class="paper-venue">${venueHtml(p)}</div><h3 class="paper-title"><button data-paper="${escape(p.id)}">${escape(p.title)}</button></h3><p class="paper-authors">${escape(p.authors).replace(/Kai Fang/g,'<strong>Kai Fang</strong>')}</p><p class="paper-description">${escape(lang === 'zh' ? p.summaryZh : p.summaryEn)}</p>${p.shortResultZh ? `<p class="paper-highlight"><span>${t('效果','Result')}</span>${escape(lang === 'zh' ? p.shortResultZh : p.shortResultEn)}</p>` : ''}<div class="paper-actions"><span class="paper-role">${escape(lang === 'zh' ? p.roleZh : p.roleEn)}</span>${p.url ? external(p.url,t('原文','Paper')) : ''}<button data-paper="${escape(p.id)}">${t('研究介绍','Details')}</button>${p.bibtex ? `<button data-cite="${escape(p.id)}">BibTeX</button>` : ''}</div></div><button class="paper-open" data-paper="${escape(p.id)}" aria-label="${escape(t('查看论文介绍：','View publication: ') + p.title)}">↗</button></article>`;
    }).join('') : `<p class="empty-state">${t('没有找到匹配的论文，试试其他关键词。','No matching papers. Try another keyword.')}</p>`;
  }

  function renderDialog(type, id) {
    if (type === 'project') {
      const p = projects[id]; if (!p) return;
      $('#dialog-content').innerHTML = `<div class="dialog-eyebrow">${p.label}</div><h2 id="dialog-title" class="dialog-title">${p.title}</h2><p class="dialog-summary">${escape(lang === 'zh' ? p.summaryZh : p.summaryEn)}</p><div class="tags">${p.tags.map(s=>`<span>${escape(s)}</span>`).join('')}</div>${p.image ? `<img class="dialog-image" src="${p.image}" alt="${escape(p.title)} ${t('项目界面','project interface')}">` : ''}<div class="dialog-content-section"><h3>${escape(lang === 'zh' ? p.roleZh : p.roleEn)}</h3><ul>${(lang === 'zh' ? p.itemsZh : p.itemsEn).map(s=>`<li>${escape(s)}</li>`).join('')}</ul></div><p class="dialog-notice">${escape(lang === 'zh' ? p.noteZh : p.noteEn)}</p>${p.url ? `<div class="dialog-links">${external(p.url,lang === 'zh' ? p.linkZh : p.linkEn,'button primary')}</div>` : ''}`;
    } else {
      const p = papers.find(p=>p.id === id); if (!p) return;
      $('#dialog-content').innerHTML = `<div class="dialog-eyebrow">${venueHtml(p)}</div><h2 id="dialog-title" class="dialog-title">${escape(p.title)}</h2><p class="dialog-authors">${escape(p.authors)}</p><div class="dialog-paper-meta"><span class="paper-status ${escape(p.status)}">${statusLabel(p)}</span><span>${escape(lang === 'zh' ? p.roleZh : p.roleEn)}</span></div>${journalSource(p)}<p class="dialog-summary">${escape(lang === 'zh' ? p.summaryZh : p.summaryEn)}</p>${researchBlocks(p)}${p.bibtex ? `<details class="citation-details"><summary>${t('文献引用 · BibTeX','Citation · BibTeX')}</summary><pre class="dialog-citation">${escape(p.bibtex)}</pre></details>` : ''}<div class="dialog-links">${p.url ? external(p.url,t('打开论文原文','Open paper'),'button primary') : ''}${p.bibtex ? `<button class="button" data-copy-cite="${p.id}">${t('复制 BibTeX','Copy BibTeX')}</button>` : ''}</div>`;
    }
  }
  function showDialog(type,id) {
    openItem = {type,id}; renderDialog(type,id);
    $('#detail-dialog').showModal(); document.body.style.overflow='hidden';
    $('#detail-dialog').scrollTop=0;
  }
  function toast(message) {
    clearTimeout(toastTimer); $('#toast').textContent=message; $('#toast').classList.add('visible');
    toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);
  }
  async function copy(text,success) {
    try { await navigator.clipboard.writeText(text); toast(success); }
    catch (_) {
      const textarea=document.createElement('textarea'); textarea.value=text; textarea.style.position='fixed';textarea.style.opacity='0'; document.body.append(textarea);textarea.select();
      const copied=document.execCommand('copy');textarea.remove();toast(copied ? success : t('请从详情中手动选择并复制。','Please select and copy the text from the details.'));
    }
  }
  function applyLanguage() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $$('[data-zh][data-en]').forEach(el => {el.textContent=el.dataset[lang];});
    $('#language-toggle').innerHTML=lang === 'zh' ? 'EN' : '中文';
    $('#language-toggle').setAttribute('aria-label',lang === 'zh' ? 'Switch to English' : '切换到中文');
    $('#paper-search').placeholder=t('搜索论文、关键词…','Search papers, keywords…');
    renderPapers();
    if(openItem) renderDialog(openItem.type,openItem.id);
    try {localStorage.setItem('kai-portfolio-language',lang);} catch (_) {}
  }
  $('#language-toggle').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';applyLanguage();});
  $('#paper-search').addEventListener('input',renderPapers);
  $$('.filter[data-paper-filter]').forEach(button=>button.addEventListener('click',()=>{
    paperFilter=button.dataset.paperFilter;
    $$('[data-paper-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderPapers();
  }));
  $$('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.projectFilter;
    $('.project-grid').dataset.filter=filter;
    $$('[data-project-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $$('.project-card').forEach(card=>{card.hidden=filter!=='all' && card.dataset.category!==filter;});
  }));
  document.addEventListener('click',event=>{
    const project=event.target.closest('[data-project]'); if(project)showDialog('project',project.dataset.project);
    const paper=event.target.closest('[data-paper]'); if(paper)showDialog('paper',paper.dataset.paper);
    const cite=event.target.closest('[data-cite]'); if(cite){showDialog('paper',cite.dataset.cite);const citation=$('.citation-details');if(citation){citation.open=true;citation.scrollIntoView({block:'start'});}}
    const copyCite=event.target.closest('[data-copy-cite]'); if(copyCite)copy(papers.find(p=>p.id===copyCite.dataset.copyCite).bibtex,t('BibTeX 已复制','BibTeX copied'));
  });
  $('#close-dialog').addEventListener('click',()=>$('#detail-dialog').close());
  $('#detail-dialog').addEventListener('close',()=>{document.body.style.overflow='';openItem=null;});
  $('#detail-dialog').addEventListener('click',event=>{if(event.target === $('#detail-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
  $('#copy-email').addEventListener('click',()=>copy('fangkaidd@scut.edu.cn',t('邮箱已复制','Email copied')));
  $('.menu-toggle').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));});
  $$('#navigation a').forEach(link=>link.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}));
  window.addEventListener('resize',()=>{if(window.innerWidth>900){$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}});
  $$('[data-network-view]').forEach(button=>button.addEventListener('click',()=>{
    $('.network-stage').dataset.view=button.dataset.networkView;
    $$('[data-network-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  applyLanguage();
})();
