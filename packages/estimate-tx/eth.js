import BN from 'bn.js'
import {bn16, pre0x} from './util.js'

async function ethEstimateGasAdvance(request, tx) {
  try {
    const estimateRst = await request({
      method: 'eth_estimateGas',
      params: [tx, 'latest'],
    })

    return {gasUsed: estimateRst, gasLimit: estimateRst}
  } catch (err) {
    if (err.message?.includes?.('nonce is too old')) {
      tx.nonce = pre0x(bn16(tx.nonce).addn(1).toString(16))
      return await ethEstimateGasAdvance(request, tx)
    } else {
      throw err
    }
  }
}

export const ethGetFeeData = (
  {gas = '0x5208', gasPrice = '0x1', value = '0x0', tokensAmount = {}} = {},
  {balance = '0x0', tokensBalance = {}} = {},
) => {
  const gasFeeDrip = bn16(gas).mul(bn16(gasPrice))
  const txFeeDrip = gasFeeDrip
  const valueDrip = bn16(value)
  const wholeTxDrip = txFeeDrip.add(valueDrip)
  const balanceDrip = bn16(balance)
  let nativeMaxDrip = balanceDrip.sub(txFeeDrip)
  let restNativeBalanceDrip = nativeMaxDrip.sub(valueDrip)
  const isBalanceEnough = restNativeBalanceDrip.gten(0)
  nativeMaxDrip = nativeMaxDrip.gten(0) ? nativeMaxDrip : new BN(0)
  restNativeBalanceDrip = restNativeBalanceDrip.gten(0)
    ? restNativeBalanceDrip
    : new BN(0)

  const tokensInfo = Object.entries(tokensAmount).reduce(
    (acc, [addr, amount]) => {
      const tokenBalanceStr = tokensBalance[addr] || '0x0'
      const tokenBalance = bn16(tokenBalanceStr)
      const restTokenBalance = tokenBalance.sub(bn16(amount || '0x0'))
      acc[addr] = {
        tokenBalance: tokenBalanceStr,
        restTokenBalance: pre0x(restTokenBalance.toString(16)),
        isTokenBalanceEnough: restTokenBalance.gten(0),
      }
      return acc
    },
    {},
  )

  return {
    balanceDrip: balance,
    gasFeeDrip: pre0x(gasFeeDrip.toString(16)),
    txFeeDrip: pre0x(txFeeDrip.toString(16)),
    wholeTxDrip: pre0x(wholeTxDrip.toString(16)),
    nativeMaxDrip: pre0x(nativeMaxDrip.toString(16)),
    isBalanceEnough,
    restNativeBalanceDrip: pre0x(restNativeBalanceDrip.toString(16)),
    tokens: tokensInfo,
  }
}

export const ethEstimate = async (
  tx = {},
  {
    request,
    toAddressType, // networkId,
    tokensAmount = {},
    isFluentRequest,
    chainIdToGasBuffer = {},
    defaultGasBuffer = 1,
  } = {},
) => {
  // we use non-standard rpcs from fluent wallet like
  // wallet_getBalance
  // wallet_detectAddressType
  if (!isFluentRequest)
    throw new Error(`usage without fluent-wallet provider is not supported yet`)
  let newTx = {...tx}

  // TODO: EIP-1559 support
  let {
    from,
    to,
    gasPrice: customGasPrice,
    gas: customGasLimit,
    nonce: customNonce,
    data,
    value,
  } = newTx

  let gasPrice, nonce

  if (!from) throw new Error(`Invalid from ${from}`)
  if (!to && !data)
    throw new Error(`Invalid tx, to and data are both undefined`)

  const promises = []

  value = value || '0x0'

  // check if to is a contract address if to exits and its type is not provided
  if (to && !toAddressType) {
    promises.push(
      request({
        method: 'wallet_detectAddressType',
        params: {address: to},
      }).then(r => {
        toAddressType = r.type
      }),
    )
  }

  // get native and token balances
  let balances = []
  promises.push(
    request({
      method: 'wallet_getBalance',
      params: {
        users: [from],
        tokens: ['0x0'].concat(Object.keys(tokensAmount)),
      },
    }).then(r => {
      balances = r[from.toLowerCase()]
    }),
  )

  // get gasPrice
  await request({method: 'eth_gasPrice'}).then(r => {
    gasPrice = r
  })

  // get nonce, since it may affect estimateGasAndCollateral result
  if (!nonce) {
    promises.push(
      request({
        method: 'eth_getTransactionCount',
        params: [from, 'pending'],
      }).then(r => {
        nonce = r
      }),
    )
  }

  // wait for all those values
  await Promise.all(promises)

  // simple send tx, gas is 21000
  if (to && (!data || data === '0x')) {
    const clcGasPrice = customGasPrice || gasPrice
    const clcGasLimit = customGasLimit || '0x5208' /* 21000 */
    const ethFeeData = ethGetFeeData(
      {
        gasPrice: clcGasPrice,
        gas: clcGasLimit,
        value,
      },
      {balance: balances['0x0']},
    )
    if (toAddressType === 'user')
      return {
        ...ethFeeData,
        gasPrice,
        gasUsed: '0x5208',
        gasLimit: '0x5208',
        nonce,
        customGasPrice,
        customGasLimit,
        customNonce,
        willPayCollateral: true,
        willPayTxFee: true,
      }
  }

  // delete passed in gas data, since they may affect
  // estimateGasAndCollateral result
  delete newTx.gas
  delete newTx.gasPrice
  newTx.nonce = nonce

  // run estimate
  let [rst, chainId] = await Promise.all([
    ethEstimateGasAdvance(request, newTx),
    request({method: 'eth_chainId'}),
  ])
  const {gasLimit} = rst
  const clcGasPrice = customGasPrice || gasPrice
  const clcGasLimit =
    customGasLimit ||
    pre0x(bn16(gasLimit).muln(chainIdToGasBuffer[chainId] || defaultGasBuffer))

  rst = {
    ...rst,
  }

  if (toAddressType === 'contract') {
    const ethFeeData = ethGetFeeData(
      {
        gasPrice: clcGasPrice,
        gas: clcGasLimit,
        value,
        tokensAmount,
      },
      {balance: balances['0x0'], tokensBalance: balances},
    )
    rst = {
      ...rst,
      ...ethFeeData,
    }
  } else {
    const ethFeeData = ethGetFeeData(
      {
        gasPrice: clcGasPrice,
        gas: clcGasLimit,
        value,
      },
      {balance: balances['0x0']},
    )
    rst = {
      ...rst,
      ...ethFeeData,
      willPayCollateral: true,
      willPayTxFee: true,
    }
  }

  rst.gasPrice = gasPrice
  rst.nonce = newTx.nonce
  rst.customGasPrice = customGasPrice
  rst.customGasLimit = customGasLimit
  rst.customNonce = customNonce

  return rst
}
