import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {useState, useEffect} from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Input from '@fluent-wallet/component-input'
import Checkbox from '@fluent-wallet/component-checkbox'
import {useRPC} from '@fluent-wallet/use-rpc'
import {
  CaretDownFilled,
  QuestionCircleOutlined,
} from '@fluent-wallet/component-icons'
import Modal from '@fluent-wallet/component-modal'
import {RPC_METHODS} from '../../constants'
import {NetworkContent} from '../../components'
import {useAccountGroupAddress} from '../../hooks'
const {GET_CURRENT_NETWORK, GET_CURRENT_ACCOUNT} = RPC_METHODS

function ConnectSitesList({networkId}) {
  const {t} = useTranslation()
  const [checkboxStatusObj, setCheckboxStatusObj] = useState({})
  const [allCheckboxStatus, setAllCheckboxStatus] = useState(false)
  const {addressData, accountData} = useAccountGroupAddress(networkId)

  const {data: currentAccount} = useRPC([GET_CURRENT_ACCOUNT], undefined, {
    fallbackData: {},
  })

  const onSelectSingleAccount = accountId => {
    setCheckboxStatusObj({
      ...checkboxStatusObj,
      [accountId]: !checkboxStatusObj[accountId],
    })
  }

  useDeepCompareEffect(() => {
    if (addressData) {
      const ret = {}
      Object.keys(addressData).forEach(k => (ret[k] = false))
      setCheckboxStatusObj({...ret})
      setAllCheckboxStatus(false)
    }
  }, [addressData || {}])

  useDeepCompareEffect(() => {
    if (addressData) {
      const ret = {}
      Object.keys(addressData).forEach(k => (ret[k] = allCheckboxStatus))
      setCheckboxStatusObj({...ret})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressData || {}, allCheckboxStatus])

  return accountData.length ? (
    <>
      <div>
        <div>{t('selectAuthorizedAccounts')}</div>
        <QuestionCircleOutlined onClick={() => window && window.open('')} />
        <Checkbox
          checked={allCheckboxStatus}
          onChange={() => setAllCheckboxStatus(!allCheckboxStatus)}
        >
          {t('selectAll')}
        </Checkbox>
      </div>
      <div>
        {accountData.map(({nickname, account}, groupIndex) => (
          <div key={groupIndex}>
            <p className="text-gray-40 ml-4 mb-1 text-xs">{nickname}</p>
            {account.map(({nickname, eid, address}, accountIndex) => (
              <div
                aria-hidden="true"
                onClick={() => () => {}}
                key={accountIndex}
                className="flex p-3 rounded cursor-pointer"
              >
                <img className="w-5 h-5 mr-2" src="" alt="avatar" />
                <div className="flex-1">
                  <p className="text-xs text-gray-40">{nickname}</p>
                  <p> {address}</p>
                </div>
                <div>
                  {currentAccount.eid && currentAccount.eid === eid ? (
                    <img src="images/location.svg" alt="current address" />
                  ) : null}
                  <Checkbox
                    onChange={() => onSelectSingleAccount(eid)}
                    checked={checkboxStatusObj[eid]}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  ) : null
}
ConnectSitesList.propTypes = {
  networkId: PropTypes.number,
}

function ConnectSite() {
  const [searchContent, setSearchContent] = useState('')
  const [networkShow, setNetworkShow] = useState(false)
  const [networkId, setNetworkId] = useState(null)
  const [searchIcon, setSearchIcon] = useState('')
  const {t} = useTranslation()
  const {data: currentNetworkData} = useRPC([GET_CURRENT_NETWORK])

  const onClickNetworkItem = ({networkId, networkName, icon}) => {
    setNetworkId(networkId)
    setSearchContent(networkName)
    setSearchIcon(icon || '')
    setNetworkShow(false)
  }

  useEffect(() => {
    setSearchIcon(currentNetworkData?.icon || '')
    setSearchContent(currentNetworkData?.name || '')
    setNetworkId(currentNetworkData?.eid || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(currentNetworkData)])

  return currentNetworkData ? (
    <>
      <header>
        <p>{t('connectSite')}</p>
        <div>
          <div />
          <div>
            <img src="" alt="favicon" />
          </div>
          <div />
          <img src="images/paperclip.svg" alt="connecting" />
          <div />
          <div>
            <img className="w-6 h-6" src="images/logo.svg" alt="logo" />
          </div>
          <div />
        </div>
        <p>dapp name</p>
      </header>
      <main>
        <p>{t('selectNetwork')}</p>
        <div
          aria-hidden
          onClick={() => setNetworkShow(true)}
          className="cursor-pointer"
        >
          <Input
            value={searchContent}
            width="w-full box-border"
            readOnly={true}
            className="pointer-events-none"
            suffix={<CaretDownFilled className="w-4 h-4 text-gray-40" />}
            prefix={
              <img
                src={searchIcon || 'images/default-network-icon.svg'}
                alt="network icon"
                className="w-4 h-4"
              />
            }
          />
        </div>
        <ConnectSitesList networkId={networkId} />
        <Modal
          open={networkShow}
          size="small"
          onClose={() => setNetworkShow(false)}
          content={<NetworkContent onClickNetworkItem={onClickNetworkItem} />}
        />
      </main>
      <footer></footer>
    </>
  ) : null
}

export default ConnectSite
