import fs from 'node:fs';
import vm from 'node:vm';

// Keep citations and the complete no-JavaScript research view in sync.
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../dist/content.js', import.meta.url), 'utf8'), context);
const papers = context.window.PORTFOLIO_CONTENT.papers;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fs.writeFileSync(new URL('../dist/publications.bib', import.meta.url), papers.filter(p => p.bibtex).map(p => p.bibtex).join('\n\n') + '\n');
const status = { published: '已发表', accepted: '已录用', submitted: '在投' };
const fields = [['研究问题','problemZh'],['算法与实现','methodZh'],['实验效果','resultsZh'],['本人工作','contributionZh'],['实验条件','conditionsZh']];
const fallback = papers.map(p => {
  const m=p.journalMetrics;
  const venue=escape(p.venue.replace(/\s*· (submitted|accepted)$/, ''))+(m?`<span class="venue-rating">（JCR ${m.quartile}，IF = ${m.impactFactor}）</span>`:'');
  const details=fields.filter(([,key])=>p[key]).map(([label,key])=>`<section class="research-detail"><h4>${label}</h4><p>${escape(p[key])}</p></section>`).join('');
  const year=p.id==='P07'?'目标 2027':(p.year||'进行中');
  return `<article class="paper-row"><div class="paper-date"><span class="paper-year">${year}</span><span class="paper-status ${p.status}">${p.id === 'P02' ? '预印本' : status[p.status]}</span></div><div class="paper-main"><p class="paper-venue">${venue}</p><h3 class="paper-title">${p.url ? `<a href="${escape(p.url)}">${escape(p.title)}</a>` : escape(p.title)}</h3><p class="paper-authors">${escape(p.authors)}</p><p class="paper-description">${escape(p.summaryZh)}</p>${p.shortResultZh?`<p class="paper-highlight"><span>效果</span>${escape(p.shortResultZh)}</p>`:''}<p class="paper-role">${escape(p.roleZh)}</p><details class="citation-details"><summary>研究介绍</summary>${details}</details></div></article>`;
}).join('\n');
const file = new URL('../dist/index.html', import.meta.url);
const html = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, html.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>${fallback}</noscript>`));
console.log(`Prepared ${papers.length} research records and ${papers.filter(p => p.bibtex).length} public citations.`);
