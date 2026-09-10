#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ADMIN_ROOT = resolve(ROOT, '..', 'huanqiu-admin')
const TEAM_ID = 'team_v0pxRIIzSUGJleUTRNSz6GS4'
const PROJECT = 'lizhichuangmachinery'
const REPO = 'luqite-ux/lizhichuangmachinery'

for (const path of [join(ROOT, '.env.local'), join(ADMIN_ROOT, '_migrate-batch', '.env')]) {
  if (!existsSync(path)) continue
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/u)) {
    const value = line.trim(); if (!value || value.startsWith('#')) continue
    const index = value.indexOf('='); if (index < 1) continue
    let item = value.slice(index + 1).trim(); if (/^['"]/.test(item)) item = item.slice(1, -1)
    process.env[value.slice(0, index).trim()] ??= item
  }
}
const required = (name) => { const value = process.env[name]?.trim(); if (!value) throw new Error(`${name} is required`); return value }
const vercelToken = required('VERCEL_TOKEN')
const githubToken = required('GITHUB_TOKEN')
const vercelHeaders = { authorization: `Bearer ${vercelToken}`, 'content-type': 'application/json' }
const githubHeaders = { authorization: `Bearer ${githubToken}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' }
const team = (path) => `${path}${path.includes('?') ? '&' : '?'}teamId=${TEAM_ID}`

async function request(url, init = {}, ok = [200, 201]) {
  const response = await fetch(url, init)
  const json = await response.json().catch(() => ({}))
  if (!ok.includes(response.status)) throw new Error(`${init.method || 'GET'} ${new URL(url).pathname} failed with HTTP ${response.status}: ${json.error?.code || json.error?.message || 'unknown'}`)
  return json
}

const user = await request('https://api.github.com/user', { headers: githubHeaders })
if (user.login !== 'luqite-ux') throw new Error(`GitHub identity mismatch: ${user.login}`)
const repository = await request(`https://api.github.com/repos/${REPO}`, { headers: githubHeaders })
if (repository.owner.login !== 'luqite-ux' || repository.default_branch !== 'main') throw new Error('GitHub repository ownership/default branch mismatch')

let project = await request(team(`https://api.vercel.com/v9/projects/${PROJECT}`), { headers: vercelHeaders })
await request(team(`https://api.vercel.com/v9/projects/${project.id}`), { method: 'PATCH', headers: vercelHeaders, body: JSON.stringify({ framework: 'nextjs' }) })
if (project.link?.repo !== PROJECT || project.link?.org !== 'luqite-ux') {
  await request(team(`https://api.vercel.com/v9/projects/${project.id}/link`), { method: 'POST', headers: vercelHeaders, body: JSON.stringify({ type: 'github', repo: REPO }) })
}

const wantedKeys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_TENANT_ID', 'NEXT_PUBLIC_ADMIN_URL', 'NEXT_PUBLIC_SITE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'CAPTCHA_SECRET', 'CAPTCHA_SITE_SCOPE']
const existing = await request(team(`https://api.vercel.com/v9/projects/${project.id}/env`), { headers: vercelHeaders })
for (const key of wantedKeys) {
  for (const item of (existing.envs || []).filter((entry) => entry.key === key)) {
    await request(team(`https://api.vercel.com/v9/projects/${project.id}/env/${item.id}`), { method: 'DELETE', headers: vercelHeaders }, [200])
  }
  await request(team(`https://api.vercel.com/v10/projects/${project.id}/env`), { method: 'POST', headers: vercelHeaders, body: JSON.stringify({ key, value: required(key), type: 'encrypted', target: ['production', 'preview', 'development'] }) })
}

const deployment = await request(team('https://api.vercel.com/v13/deployments'), { method: 'POST', headers: vercelHeaders, body: JSON.stringify({ name: PROJECT, target: 'production', gitSource: { type: 'github', ref: 'main', repoId: repository.id }, projectSettings: { framework: 'nextjs' } }) })
process.stdout.write(`${JSON.stringify({ phase: 'created', deploymentId: deployment.id, url: deployment.url })}\n`)

let current = deployment
for (let attempt = 0; attempt < 90; attempt += 1) {
  current = await request(team(`https://api.vercel.com/v13/deployments/${deployment.id}`), { headers: vercelHeaders })
  if (current.readyState === 'READY' || current.readyState === 'ERROR' || current.readyState === 'CANCELED') break
  if (attempt % 6 === 0) process.stdout.write(`${JSON.stringify({ phase: 'poll', readyState: current.readyState })}\n`)
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 10_000))
}
if (current.readyState !== 'READY') throw new Error(`Production deployment ended in state ${current.readyState}`)

project = await request(team(`https://api.vercel.com/v9/projects/${project.id}`), { headers: vercelHeaders })
const envReadback = await request(team(`https://api.vercel.com/v9/projects/${project.id}/env`), { headers: vercelHeaders })
const configuredKeys = new Set((envReadback.envs || []).flatMap((entry) => entry.target?.includes('production') ? [entry.key] : []))
process.stdout.write(`${JSON.stringify({ phase: 'ready', projectId: project.id, projectName: project.name, framework: project.framework, git: project.link ? { type: project.link.type, org: project.link.org, repo: project.link.repo, productionBranch: project.link.productionBranch } : null, deploymentId: current.id, deploymentUrl: `https://${current.url}`, projectUrl: `https://${PROJECT}.vercel.app`, gitSha: current.meta?.githubCommitSha || current.meta?.gitCommitSha || null, envKeysConfigured: wantedKeys.filter((key) => configuredKeys.has(key)), envKeysComplete: wantedKeys.every((key) => configuredKeys.has(key)) })}\n`)
