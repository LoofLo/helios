import {
  base32Address,
  dbid,
  ethHexAddress,
  map,
  string,
} from '@fluent-wallet/spec'

export const NAME = 'wallet_upsertMemo'

export const schemas = {
  input: [
    map,
    {closed: true},
    ['address', base32Address, ethHexAddress],
    ['value', [string, {min: 1}]],
    ['memoId', {optional: true}, dbid],
  ],
}

export const permissions = {
  external: ['popup'],
  db: ['getMemoById', 'getOneMemo', 'getAddressByValue', 't'],
}

export const main = ({
  Err: {InvalidParams},
  db: {getMemoById, getOneMemo, t},
  params: {address, value, memoId},
  network,
}) => {
  if (memoId && !getMemoById(memoId))
    throw InvalidParams(`Invalid memo id ${memoId}`)
  if (getOneMemo({id: [address, value]})) return

  if (memoId) {
    t([{eid: memoId, memo: {address, value, type: network.type}}])
  } else {
    t([
      {
        eid: `memo-${address}-${value}`,
        memo: {address, value, type: network.type},
      },
    ])
  }
}
