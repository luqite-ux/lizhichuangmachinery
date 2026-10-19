import fs from 'node:fs'
const base=process.env.AUDIT_BASE_URL||'http://localhost:3108'
const xml=await (await fetch(base+'/sitemap.xml')).text()
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])
if(urls.length!==new Set(urls).size||!urls.some(u=>new URL(u).pathname==='/zh'))throw Error('Invalid bilingual sitemap')
const results=[]
for(const url of urls){
 const pathname=new URL(url).pathname;const response=await fetch(base+pathname);const html=await response.text();const locale=pathname==='/zh'||pathname.startsWith('/zh/')?'zh':'en'
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
 const languages=[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map(m=>[m[1],m[2]])
 const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]))
 const text=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ')
 const item={pathname,status:response.status,locale,canonical,languages,schemaTypes:scripts.map(s=>s['@type']),title:html.match(/<title>([^<]*)<\/title>/)?.[1],lang:html.match(/<html[^>]*lang="([^"]+)"/)?.[1],companyName:locale==='zh'?text.includes('郑州利之创机械设备有限公司'):text.includes('Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.'),forbidden:/warrant(?:y|ies)|guarantee(?:d)?|质保|保修|质量保证/i.test(text)}
 item.pass=item.status===200&&new URL(item.canonical).href===new URL(url).href&&item.languages.length===3&&item.lang===(locale==='zh'?'zh-CN':'en')&&item.companyName&&!item.forbidden&&scripts.length>=2
 results.push(item)
 console.log(item.pass?'PASS':'FAIL',pathname)
}
fs.mkdirSync('output/zh-review',{recursive:true})
fs.writeFileSync('output/zh-review/html-audit.json',JSON.stringify(results,null,2),'utf8')
if(results.some(r=>!r.pass))process.exitCode=1
