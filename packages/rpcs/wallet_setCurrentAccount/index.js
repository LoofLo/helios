import {dbid, oneOrMore} from '@fluent-wallet/spec'

export const NAME = 'wallet_setCurrentAccount'

export const schemas = {
  input: [oneOrMore, dbid],
}

export const permissions = {
  external: ['popup'],
  methods: [],
  db: ['setCurrentAccount', 'findAddress', 'findAccount'],
}

export const main = ({
  Err: {InvalidParams},
  db: {setCurrentAccount, findAddress, findAccount},
  params: accounts,
}) => {
  const [account] = accounts.map(accountId => findAccount({accountId}))
  if (!account) throw InvalidParams(`Invalid accountId ${accounts[0]}`)

  const apps = setCurrentAccount(account)

  apps.forEach(({eid, site: {post}}) => {
    if (!post) return
    const addr = findAddress({
      appId: eid,
    })
    post({
      event: 'accountsChanged',
      params: addr.map(a => a.value),
    })
  })
}
