import {dbid, catn} from '@cfxjs/spec'

export const NAME = 'wallet_setCurrentNetwork'

export const schemas = {
  input: [catn, ['networkId', dbid]],
}

export const permissions = {
  external: ['popup'],
  methods: [],
  db: ['setCurrentNetwork', 'getNetworkById'],
}

export const main = ({
  Err: {InvalidParams},
  db: {setCurrentNetwork, getNetworkById},
  params: networks,
}) => {
  const [network] = networks
  if (!getNetworkById(network))
    throw InvalidParams(`Invalid networkId ${network}`)

  const apps = setCurrentNetwork(network)
  apps.forEach(
    ({currentNetwork, site: {post}}) =>
      post &&
      post({
        event: 'chainChanged',
        params: currentNetwork.chainId,
      }),
  )
}