import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import dictionary from '../lib/zh-CN.json' with { type: 'json' }

// Additive migration: never reseed this tenant or replace existing English/editor content.
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).map(line=>{const i=line.indexOf('=');return i>0?[line.slice(0,i),line.slice(i+1).replace(/^['"]|['"]$/g,'')]:[]}).filter(x=>x.length))
const client=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY)
const tenantId=env.NEXT_PUBLIC_TENANT_ID
const {data:tenant,error}=await client.from('tenants').select('*').eq('id',tenantId).single()
if(error||tenant?.domain!=='lzcglobal.com'||tenant?.display_name!=='郑州利之创机械设备有限公司')throw Error('Tenant identity does not match this migration')
const norm=s=>s.replace(/\s+/g,' ').trim().replaceAll('&amp;','&')
const missing=new Set()
const tr=value=>{
 if(Array.isArray(value))return value.map(tr)
 if(typeof value!=='string')return value
 const key=norm(value)
 if(/^&(?:nbsp|amp|lt|gt);$/.test(key))return value
 if(dictionary[key])return dictionary[key]
 if(/[A-Za-z]{3}/.test(key)&&!/^LZC[-\w]*$/.test(key)&&!/^https?:/.test(key))missing.add(key)
 return value
}
const add=map=>map?.zh?map:{...map,zh:tr(map?.en||'')}
const changes=[]
for(const table of ['products','product_categories','articles']){
 const {data:rows,error}=await client.from(table).select('*').eq('tenant_id',tenantId)
 if(error)throw error
 for(const row of rows){const patch={};const fields=table==='articles'?['title','excerpt','content']:table==='products'?['name','description','overview','features','applications','advantages']:['name','description']
 for(const key of fields){const field=key+'_i18n';const source=row[field]||{en:row[key+'_en']||row[key]||''};if(source.zh)continue
 patch[field]=key==='content'?{...source,zh:(source.en||'').replace(/>([^<]+)</g,(match,text)=>'>'+tr(text)+'<')}:add(source)
 }
 if(table==='products'){
   const extra={...row.extra_data};for(const field of ['short_name_i18n','family_i18n','process_steps_i18n','certificate_i18n'])extra[field]=add(extra[field]||{en:''})
   if(!extra.specifications_i18n?.zh)extra.specifications_i18n={...extra.specifications_i18n,zh:Object.fromEntries(Object.entries(extra.specifications||row.specs||{}).map(([key,value])=>[tr(key),tr(value)]))}
   patch.extra_data=extra
 }
 changes.push({table,id:row.id,slug:row.slug,patch,before:row})
 }
}
const settings={
site_title_i18n:'利之创机械 | 湿巾生产与包装设备',
site_tagline_i18n:'湿巾生产与包装设备，从设计到交付的全流程服务',
site_description_i18n:'郑州利之创机械设备有限公司集湿巾生产与包装设备的设计研发、生产调试、销售及售后服务于一体，并提供湿巾项目规划、车间设计及布局、湿巾生产配套信息共享等服务。',
seo_title_i18n:'利之创机械 | 湿巾生产与包装设备',
seo_description_i18n:'了解郑州利之创机械设备有限公司的湿巾生产线、中包包装设备及桶装湿巾复卷机，获取设备选型与项目规划支持。',
seo_keywords_i18n:'湿巾机,湿巾生产线,超迷你湿巾,便携式湿巾,中包机,桶装湿巾复卷机',
contact_address_i18n:'中国河南省郑州市新郑市郭店镇紫荆山南路与轻工路交叉口西300米路北'
}
const tenantPatch={}
for(const [key,value]of Object.entries(settings))if(!tenant[key]?.zh)tenantPatch[key]={...tenant[key],zh:value}
changes.push({table:'tenants',id:tenant.id,patch:tenantPatch,before:tenant})
fs.mkdirSync('.codex-delivery',{recursive:true})
fs.writeFileSync('.codex-delivery/chinese-content-plan.json',JSON.stringify(changes,null,2),'utf8')
if(missing.size){console.log('Missing translations',JSON.stringify([...missing]));process.exit(1)}
if(!process.argv.includes('--apply')){console.log(JSON.stringify({mode:'dry-run',rows:changes.length,existingChinesePreserved:true,defaultLanguage:tenant.default_language}));process.exit(0)}
for(const change of changes){let query=client.from(change.table).update(change.patch).eq('id',change.id);if(change.table!=='tenants')query=query.eq('tenant_id',tenantId);if(change.before.updated_at)query=query.eq('updated_at',change.before.updated_at);const {data,error}=await query.select('id');if(error||data?.length!==1)throw Error('Update failed or concurrent change: '+change.table+'/'+change.id)}
for(const change of changes){let query=client.from(change.table).select('*').eq('id',change.id);if(change.table!=='tenants')query=query.eq('tenant_id',tenantId);const{data,error}=await query.single();if(error)throw error;for(const[field,value]of Object.entries(change.patch))if(JSON.stringify(data[field])!==JSON.stringify(value)&&JSON.stringify(sort(data[field]))!==JSON.stringify(sort(value)))throw Error('Readback mismatch '+change.table+'/'+field)}
function sort(v){return Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,sort(v)])):v}
console.log(JSON.stringify({mode:'applied',rows:changes.length,readback:'PASS',enabledLanguagesUnchanged:true}))
