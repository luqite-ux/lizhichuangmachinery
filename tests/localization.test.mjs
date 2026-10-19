import test from 'node:test'
import assert from 'node:assert/strict'
import { localizedPath, translateText } from '../lib/localization.ts'

test('language links retain the current product, query and fragment', () => {
  assert.equal(localizedPath('/products/model-a?ref=menu#specs', 'zh'), '/zh/products/model-a?ref=menu#specs')
  assert.equal(localizedPath('/zh/contact?product=model-a', 'en'), '/contact?product=model-a')
  assert.equal(localizedPath('/api/inquiries', 'zh'), '/api/inquiries')
  assert.equal(localizedPath('/images/logo.png', 'zh'), '/images/logo.png')
})

test('company identity uses the original Chinese name and preserves English', () => {
  const name = 'Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.'
  assert.equal(translateText(name, 'zh'), '郑州利之创机械设备有限公司')
  assert.equal(translateText(name, 'en'), name)
  assert.equal(translateText('LZC-LPDT60', 'zh'), 'LZC-LPDT60')
})
