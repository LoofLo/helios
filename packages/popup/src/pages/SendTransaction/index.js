import {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {
  formatHexToDecimal,
  convertDataToValue,
  convertValueToData,
} from '@fluent-wallet/data-format'
import Button from '@fluent-wallet/component-button'
import Alert from '@fluent-wallet/component-alert'
import txHistoryChecker from '@fluent-wallet/tx-history-checker'
import {TitleNav, AccountDisplay} from '../../components'
import {useTxParams, useEstimateTx, useCheckBalanceAndGas} from '../../hooks'
import {
  ToAddressInput,
  TokenAndAmount,
  CurrentNetworkDisplay,
} from './components'
import useGlobalStore from '../../stores'
import {validateAddress} from '../../utils'
import {useNetworkTypeIsCfx, useCurrentAddress} from '../../hooks/useApi'
import {ROUTES} from '../../constants'
const {HOME, CONFIRM_TRANSACTION} = ROUTES

function SendTransaction() {
  const {t} = useTranslation()
  const history = useHistory()
  const {
    toAddress,
    sendAmount,
    sendToken,
    setToAddress,
    setSendAmount,
    setSendToken,
    setGasPrice,
    setGasLimit,
    setNonce,
    setStorageLimit,
    clearSendTransactionParams,
  } = useGlobalStore()
  const {data: curAddr} = useCurrentAddress()
  const type = curAddr.network?.type
  const netId = curAddr.network?.netId
  const accountId = curAddr.account?.eid
  const nickname = curAddr.account?.nickname
  const address = curAddr.value
  const {address: tokenAddress, decimals} = sendToken
  const networkTypeIsCfx = useNetworkTypeIsCfx()
  const [addressError, setAddressError] = useState('')
  const [balanceError, setBalanceError] = useState('')
  const [hasNoTxn, setHasNoTxn] = useState(false)
  const nativeToken = curAddr.network?.ticker || {}
  const isNativeToken = !tokenAddress
  const params = useTxParams()
  const estimateRst =
    useEstimateTx(
      params,
      !isNativeToken
        ? {[tokenAddress]: convertValueToData(sendAmount, decimals)}
        : {},
    ) || {}
  const {gasPrice, gasLimit, storageCollateralized, nonce, nativeMaxDrip} =
    estimateRst
  useEffect(() => {
    setGasPrice(formatHexToDecimal(gasPrice))
    setGasLimit(formatHexToDecimal(gasLimit))
    setNonce(formatHexToDecimal(nonce))
    setStorageLimit(formatHexToDecimal(storageCollateralized))
  }, [
    gasPrice,
    gasLimit,
    nonce,
    storageCollateralized,
    setGasPrice,
    setGasLimit,
    setNonce,
    setStorageLimit,
  ])
  const errorMessage = useCheckBalanceAndGas(estimateRst, sendAmount)
  useEffect(() => {
    sendAmount && setBalanceError(errorMessage)
  }, [errorMessage, sendAmount])

  useEffect(() => {
    txHistoryChecker({
      address: toAddress,
      type: type,
      chainId: netId,
    })
      .then(data => {
        setHasNoTxn(!data)
      })
      .catch(e => {
        console.log('tx history checker error: ', e)
        setHasNoTxn(false)
      })
  }, [netId, toAddress, type])

  const onChangeToken = token => {
    setSendToken(token)
  }
  const onChangeAmount = amount => {
    setSendAmount(amount)
  }
  const onChangeAddress = address => {
    setToAddress(address)
    if (!validateAddress(address, networkTypeIsCfx, netId)) {
      if (networkTypeIsCfx) {
        // TODO i18n
        setAddressError('Please enter validate cfx address')
      } else {
        setAddressError('Please enter validate hex address')
      }
    } else {
      setAddressError('')
    }
  }
  useEffect(() => {
    if (nativeToken.symbol && !tokenAddress) setSendToken(nativeToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(nativeToken)])

  return (
    <div className="flex flex-col h-full bg-blue-circles bg-no-repeat bg-bg">
      <TitleNav
        title={t('sendTransaction')}
        onGoBack={() => clearSendTransactionParams()}
      />
      <div className="flex mt-1 mb-3 mx-4 justify-between items-center z-20">
        <AccountDisplay
          accountId={accountId}
          nickname={nickname}
          address={address}
        />
        <CurrentNetworkDisplay
          name={curAddr.network?.name}
          icon={curAddr.network?.icon}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between rounded-t-xl bg-gray-0 px-3 py-4">
        <div className="flex flex-col">
          <ToAddressInput
            address={toAddress}
            onChangeAddress={onChangeAddress}
            errorMessage={addressError}
          />
          <TokenAndAmount
            selectedToken={sendToken}
            amount={sendAmount}
            onChangeAmount={onChangeAmount}
            onChangeToken={onChangeToken}
            isNativeToken={isNativeToken}
            nativeMax={convertDataToValue(nativeMaxDrip, decimals)}
          />
          <span className="text-error text-xs inline-block mt-2">
            {balanceError}
          </span>
        </div>
        <div className="flex flex-col">
          {hasNoTxn && (
            <Alert
              open={hasNoTxn}
              closable={false}
              width="w-full"
              type="warning"
              content={t('noTxnWarning')}
              className="flex-shrink-0"
            />
          )}
          <div className="w-full flex px-1 mt-6">
            <Button
              variant="outlined"
              className="flex-1 mr-3"
              onClick={() => {
                clearSendTransactionParams()
                history.push(HOME)
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              disabled={
                !!addressError || !!balanceError || !toAddress || !sendAmount
              }
              onClick={() => history.push(CONFIRM_TRANSACTION)}
              className="flex-1"
            >
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendTransaction
