import {useState} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {convertDataToValue} from '@fluent-wallet/data-format'
import {CaretDownFilled} from '@fluent-wallet/component-icons'
import Link from '@fluent-wallet/component-link'
import Modal from '@fluent-wallet/component-modal'
import {
  CompWithLabel,
  DisplayBalance,
  SearchToken,
  TokenList,
  NumberInput,
} from '../../../components'
import {
  useDbHomeAssets,
  useBalance,
  useCurrentAddress,
  useNetworkTypeIsCfx,
} from '../../../hooks/useApi'
import {validateAddress} from '../../../utils'

const ChooseTokenList = ({open, onClose, onSelectToken}) => {
  const {t} = useTranslation()
  const {data: curAddr} = useCurrentAddress()
  const netId = curAddr.network?.eid
  const {added, native} = useDbHomeAssets()
  const networkTypeIsCfx = useNetworkTypeIsCfx()
  const homeTokenList = [native].concat(added)
  const [searchValue, setSearchValue] = useState('')
  const [tokenList, setTokenList] = useState([...homeTokenList])
  const onChangeValue = value => {
    setSearchValue(value)
    const isValid = validateAddress(value, networkTypeIsCfx, netId)
    if (value === '') setTokenList([...homeTokenList])
    if (isValid) {
      const filterToken = homeTokenList.filter(token => token.address === value)
      setTokenList([...filterToken])
    } else {
      const filterToken = homeTokenList.filter(
        token =>
          token.symbol.toUpperCase().indexOf(value.toUpperCase()) !== -1 ||
          token.name.toUpperCase().indexOf(value?.toUpperCase()) !== -1,
      )
      setTokenList([...filterToken])
    }
  }
  const onCloseTokenList = () => {
    onClose && onClose()
    setSearchValue('')
    setTokenList([...homeTokenList])
  }
  const content = (
    <div className="flex flex-col flex-1">
      <SearchToken value={searchValue} onChange={onChangeValue} />
      <span className="inline-block mt-3 mb-1 text-gray-40 text-xs">
        {t('tokenList')}
      </span>
      <TokenList tokenList={tokenList} onSelectToken={onSelectToken} />
    </div>
  )
  return (
    <Modal
      className="!bg-gray-circles bg-no-repeat w-80 h-[552px]"
      open={open}
      title={t('chooseToken')}
      content={content}
      onClose={onCloseTokenList}
      contentClassName="flex-1 flex"
      id="tokenListModal"
    />
  )
}

ChooseTokenList.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectToken: PropTypes.func.isRequired,
}

function TokenAndAmount({
  selectedToken, // TODO: use token id
  onChangeToken,
  amount,
  onChangeAmount,
  isNativeToken,
  nativeMax,
}) {
  const {t} = useTranslation()
  const [tokenListShow, setTokenListShow] = useState(false)
  const {data: curAddr} = useCurrentAddress()
  const networkId = curAddr.network?.eid
  const address = curAddr.value
  const {symbol, icon, decimals, address: selectedTokenAddress} = selectedToken
  const tokenAddress = isNativeToken ? '0x0' : selectedTokenAddress
  const balance =
    useBalance(address, networkId, tokenAddress)?.[address]?.[tokenAddress] ||
    '0x0'
  const label = (
    <span className="flex items-center justify-between text-gray-60 w-full">
      {t('tokenAndAmount')}
      <span className="flex items-center text-xs">
        {t('available')}
        <DisplayBalance
          maxWidth={140}
          maxWidthStyle="max-w-[140px]"
          balance={balance}
          decimals={decimals}
          className="mx-1 text-xs"
          initialFontSize={12}
          symbol={symbol}
          id="balance"
        />
      </span>
    </span>
  )
  const onClickMax = () => {
    if (isNativeToken) onChangeAmount(nativeMax)
    else onChangeAmount(convertDataToValue(balance, decimals))
  }
  const onSelectToken = token => {
    setTokenListShow(false)
    onChangeToken(token)
  }
  return (
    <CompWithLabel label={label}>
      <div className="flex px-3 h-13 items-center justify-between bg-gray-4 border border-gray-10 rounded">
        <div
          className="flex items-center pr-3 border-r-gray-20 cursor-pointer border-r border-text-20 h-6"
          onClick={() => setTokenListShow(true)}
          id="changeToken"
          aria-hidden="true"
        >
          <img
            className="w-5 h-5 mr-1"
            src={icon || '/images/default-token-icon.svg'}
            alt="logo"
            id="tokenIcon"
          />
          <span className="text-gray-80 mr-2">{symbol}</span>
          <CaretDownFilled className="w-4 h-4 text-gray-60" />
        </div>
        <div className="flex flex-1">
          <NumberInput
            width="w-full bg-transparent"
            bordered={false}
            value={amount}
            decimals={decimals}
            maxLength="22"
            onChange={e => onChangeAmount && onChangeAmount(e.target.value)}
            id="amount"
          />
        </div>
        <Link onClick={onClickMax} id="max">
          {t('max')}
        </Link>
      </div>
      <ChooseTokenList
        open={tokenListShow}
        onClose={() => setTokenListShow(false)}
        onSelectToken={onSelectToken}
      />
    </CompWithLabel>
  )
}

TokenAndAmount.propTypes = {
  selectedToken: PropTypes.object.isRequired,
  onChangeToken: PropTypes.func,
  amount: PropTypes.string,
  onChangeAmount: PropTypes.func,
  isNativeToken: PropTypes.bool,
  nativeMax: PropTypes.string,
}

export default TokenAndAmount
