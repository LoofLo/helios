import {expect, describe, it} from '@jest/globals' // prettier-ignore
import {shortenCfxAddress, shortenEthAddress, getEllipsStr} from './'

describe('@cfxjs/shorten-address', function () {
  it('getEllipsStr', async function () {
    expect(getEllipsStr('abcde', 1, 1)).toBe('a...e')
    expect(getEllipsStr('abcde', 3, 2)).toBe('abcde')
    expect(getEllipsStr('abcde', 4, 5)).toBe('abcde')
    expect(() => getEllipsStr(null, 1, 1)).toThrowError('Invalid args')
    expect(() => getEllipsStr('abcde', 1, -1)).toThrowError('Invalid args')
  })

  it('shortenCfxAddress', async function () {
    expect(
      shortenCfxAddress('cfx:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg'),
    ).toBe('cfx:aar...ybjgh4xg')
    expect(
      shortenCfxAddress('cfxtest:aame5p2tdzfsc3zsmbg1urwkg5ax22epg27cnu1rwm'),
    ).toBe('cfxtest:aam...1rwm')
    expect(() =>
      shortenCfxAddress(
        'CFX:TYPE.USER:AARC9ABYCUE0HHZGYRR53M6CXEDGCCRMMYYBJGH4XG',
      ),
    ).toThrowError('Only shorten the conflux address not containing type')
  })

  it('shortenEthAddress', async function () {
    expect(
      shortenEthAddress('0x1036AE28C608e9e7681a1B4886668be0cf934A8a'),
    ).toBe('0x1036...4A8a')
    expect(() => shortenEthAddress('asdasdad')).toThrowError(
      'Invalid ethereum address',
    )
  })
})
