import fs from 'node:fs';
import vm from 'node:vm';

// Keep the downloadable citations and no-JavaScript publication list in sync.
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../dist/content.js', import.meta.url), 'utf8'), context);
const papers = context.window.PORTFOLIO_CONTENT.papers;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fs.writeFileSync(new URL('../dist/publications.bib', import.meta.url), papers.filter(p => p.bibtex).map(p => p.bibtex).join('\n\n') + '\n');
const status = { published: '已发表', accepted: '已录用', submitted: '在投' };
const fallback = papers.map(p => `<article class="paper-row"><div class="paper-date"><span class="paper-year">${p.year || 'ONGOING'}</span><span class="paper-status ${p.status}">${p.id === 'P02' ? '预印本' : status[p.status]}</span></div><div class="paper-main"><p class="paper-venue">${escape(p.venue)}</p><h3 class="paper-title">${p.url ? `<a href="${escape(p.url)}">${escape(p.title)}</a>` : escape(p.title)}</h3><p class="paper-authors">${escape(p.authors)}</p><p class="paper-description">${escape(p.summaryZh)}</p><p class="paper-role">${escape(p.roleZh)}</p></div></article>`).join('\n');
const file = new URL('../dist/index.html', import.meta.url);
const html = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, html.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>${fallback}</noscript>`));
console.log(`Prepared ${papers.length} publication records and ${papers.filter(p => p.bibtex).length} public citations.`);
