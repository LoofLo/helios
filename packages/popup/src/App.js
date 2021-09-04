import React, {lazy, Suspense, useEffect, useState} from 'react'
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {ProtectedRoute} from './components'
import {GET_ALL_ACCOUNT_GROUP, GET_WALLET_STATUS} from './constants'
import {useRPC} from '@cfxjs/use-rpc'
import './index.css'

const HomePage = lazy(() => import('./pages/Home'))
const ConfirmSeed = lazy(() => import('./pages/CreateSeed/ConfirmSeed'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const NewSeed = lazy(() => import('./pages/CreateSeed/NewSeed'))
const Unlock = lazy(() => import('./pages/Unlock'))
const Welcome = lazy(() => import('./pages/Welcome'))
const SetPassword = lazy(() => import('./pages/SetPassword'))
const SelectCreateType = lazy(() => import('./pages/SelectCreateType'))
const ImportAccount = lazy(() => import('./pages/ImportAccount'))
const BackupSeed = lazy(() => import('./pages/CreateSeed/BackupSeed'))
const CurrentSeed = lazy(() => import('./pages/CurrentSeed'))
const ErrorPage = lazy(() => import('./pages/Error'))

function App() {
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [errorStatus, setErrorStatus] = useState(false)

  const [accountAvailability, setAccountAvailability] = useState(false)
  const [lockStatus, setLockStatus] = useState(true)

  const {data: accountData, error: accountError} = useRPC(
    [...GET_ALL_ACCOUNT_GROUP],
    {
      type: 'hd',
    },
  )
  const {data: lockData, error: lockError} = useRPC([...GET_WALLET_STATUS])
  useEffect(() => {
    if (accountError || lockError) {
      setLoadingStatus(false)
      setErrorStatus(true)
      return
    }
    if (accountData !== undefined && lockData !== undefined) {
      setAccountAvailability(!!accountData.length)
      setLockStatus(lockData)
      setLoadingStatus(false)
    }
  }, [accountData, accountError, lockData, lockError])

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center"></div>
      }
    >
      <div className="h-150 w-93 m-auto light">
        {loadingStatus ? null : errorStatus ? (
          <ErrorPage />
        ) : (
          <Router>
            <Switch>
              <ProtectedRoute
                hasAccount={accountAvailability}
                isLocked={lockStatus}
                exact
                path="/"
              >
                <HomePage />
              </ProtectedRoute>
              <Route exact path="/create-account-default">
                <CreateAccount />
              </Route>
              <Route exact path="/create-account-current-seed-phrase">
                <CurrentSeed />
              </Route>
              <Route exact path="/create-account-new-seed-phrase">
                <NewSeed />
              </Route>
              <Route exact path="/create-account-backup-seed-phrase">
                <BackupSeed />
              </Route>
              <Route exact path="/create-account-confirm-seed-phrase">
                <ConfirmSeed />
              </Route>
              <Route exact path="/unlock">
                <Unlock />
              </Route>
              <Route exact path="/welcome">
                <Welcome />
              </Route>
              <Route exact path="/set-password">
                <SetPassword />
              </Route>
              <Route exact path="/select-create-type">
                <SelectCreateType />
              </Route>
              <Route exact path="/import-account/:pattern">
                <ImportAccount />
              </Route>
              <Route exact path="/error">
                <ErrorPage />
              </Route>
              <Route path="*">
                <Redirect to="/error" />
              </Route>
            </Switch>
          </Router>
        )}
      </div>
    </Suspense>
  )
}

export default App
