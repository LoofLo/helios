import create from 'zustand'

const defaultSendTransactionParams = {
  toAddress: '',
  sendAmount: '',
  gasPrice: '',
  gasLimit: '',
  nonce: '',
  sendToken: {symbol: 'CFX', icon: '', decimals: 18},
  allowance: '',
  customAllowance: '',
}

const useGlobalStore = create(set => ({
  FATAL_ERROR: '',
  setFatalError: e => set({FATAL_ERROR: e?.message || e}),
  // value
  createdGroupName: '',
  createdSeedPhase: '',
  createdPassword: '',
  createdMnemonic: '',
  recommendPermissionLimit: '10000000000000000',
  customPermissionLimit: '0',
  ...defaultSendTransactionParams,

  // logic
  setCreatedPassword: createdPassword => set({createdPassword}),
  setCreatedGroupName: createdGroupName => set({createdGroupName}),
  setCreatedSeedPhase: createdSeedPhase => set({createdSeedPhase}),
  setCreatedMnemonic: createdMnemonic => set({createdMnemonic}),

  setToAddress: toAddress => set({toAddress}),
  setSendAmount: sendAmount => set({sendAmount}),
  setGasPrice: gasPrice => set({gasPrice}),
  setGasLimit: gasLimit => set({gasLimit}),
  setAllowance: allowance => set({allowance}),
  setCustomAllowance: customAllowance => set({customAllowance}),
  setNonce: nonce => set({nonce}),
  setSendToken: sendToken => set({sendToken}),
  clearSendTransactionParams: () => set({...defaultSendTransactionParams}),
  setRecommendPermissionLimit: recommendPermissionLimit =>
    set({recommendPermissionLimit}),
  setCustomPermissionLimit: customPermissionLimit =>
    set({customPermissionLimit}),
}))

export default useGlobalStore
