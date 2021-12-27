import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {CloseCircleFilled} from '@fluent-wallet/component-icons'
import {useTranslation} from 'react-i18next'
import Button from '@fluent-wallet/component-button'
import {CopyButton} from '../../components'
import useGlobalStore from '../../stores/index.js'
import {useQuery} from '../../hooks'
import {RPC_METHODS, ROUTES} from '../../constants'
import {request} from '../../utils'
const {CFX_GET_STATUS} = RPC_METHODS
const {HOME} = ROUTES

function Error() {
  const {t} = useTranslation()
  const history = useHistory()
  const {FATAL_ERROR} = useGlobalStore()
  const query = useQuery()
  const urlErrorMsg = query.get('errorMsg') ?? ''
  // type: route,fullNode,inner
  const [errorType, setErrorType] = useState('')
  const [zendeskTimer, setZendeskTimer] = useState(null)

  useEffect(() => {
    if (!FATAL_ERROR && !urlErrorMsg) {
      return setErrorType('route')
    }

    request(CFX_GET_STATUS)
      .then(() => setErrorType('inner'))
      .catch(() => {
        request(CFX_GET_STATUS)
          .then(() => setErrorType('inner'))
          .catch(() => setErrorType('fullNode'))
      })
  }, [FATAL_ERROR, urlErrorMsg])

  useEffect(() => {
    return () => {
      zendeskTimer && clearTimeout(zendeskTimer)
    }
  }, [zendeskTimer])

  // TODO: need put zendesk link together with error message
  const onClickFeedback = () => {
    const timer = setTimeout(() => {
      zendeskTimer && clearTimeout(zendeskTimer)
      setZendeskTimer(null)
      window.open('')
    }, 900)
    setZendeskTimer(timer)
  }

  return errorType ? (
    <div id="errorContainer" className="h-full w-full flex flex-col p-6">
      <div className="flex-1 text-center">
        <CloseCircleFilled
          className={`text-error w-20 h-20 ${
            errorType === 'route' ? 'mt-[108px]' : 'mt-4'
          }mb-6 mx-auto`}
        />
        <p className="text-base font-medium text-black mb-2">
          {t('errorTile')}
        </p>
        <p className="text-gray-60 text-sm">
          {errorType === 'route' ? t('routeError') : t('errorDes')}
        </p>
        {errorType == 'inner' ? (
          <div className="mt-6 text-left">
            <p className="font-medium text-gray-80 text-left text-sm mb-2">
              {t('errorCode')}
            </p>
            <div className="border border-gray-10 rounded bg-gray-4">
              <div className="px-3 pt-4 mb-6 max-h-45 overflow-y-auto no-scroll break-words">
                {FATAL_ERROR || urlErrorMsg}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div>
        {errorType == 'inner' ? (
          <CopyButton
            text={FATAL_ERROR || urlErrorMsg}
            containerClassName=""
            toastClassName="top-4 right-3"
            CopyInner={
              <div
                aria-hidden="true"
                className="text-center text-xs text-primary cursor-pointer"
                onClick={onClickFeedback}
              >
                {t('feedBackCode')}
              </div>
            }
          />
        ) : errorType == 'fullNode' ? (
          <div className="text-center text-xs text-primary cursor-pointer">
            {t('switchNetwork')}
          </div>
        ) : null}
        <Button
          id="setPasswordFormBtn"
          className="w-70 mt-4 mx-auto"
          onClick={() => history.push(HOME)}
        >
          {t('back')}
        </Button>
      </div>
    </div>
  ) : null
}

export default Error
