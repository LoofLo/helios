import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {LanguageNav, HomeTitle} from '../../components'
import Button from '@fluent-wallet/component-button'
import {ROUTES} from '../../constants'

const {SET_PASSWORD} = ROUTES
const Welcome = () => {
  const {t} = useTranslation()
  const history = useHistory()
  return (
    <div className="bg-secondary h-full">
      <LanguageNav hasGoBack={false} />
      <header className="mt-8">
        <HomeTitle title={t('hello')} subTitle={t('welcome')} />
      </header>
      <main>
        <Button
          className="mt-80 w-70 mx-auto"
          onClick={() => {
            history.push(SET_PASSWORD)
          }}
        >
          {t('create')}
        </Button>
      </main>
    </div>
  )
}

export default Welcome
