import {useRef} from 'react'
import PropTypes from 'prop-types'
import {useFontSize} from '../hooks'
import {formatBalance} from '@fluent-wallet/data-format'

function DisplayBalance({
  maxWidth = 175,
  balance,
  maxWidthStyle = 'max-w-[175px]',
  className = '',
  initialFontSize = 14,
  symbol,
}) {
  const displayBalance = isNaN(Number(balance))
    ? balance
    : formatBalance(balance)
  const balanceRef = useRef()
  const hiddenRef = useRef()
  useFontSize(balanceRef, hiddenRef, maxWidth, displayBalance, initialFontSize)
  return (
    <div
      className={`text-gray-80 font-mono font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis relative ${maxWidthStyle} ${className}`}
    >
      <span ref={balanceRef}>{displayBalance}</span>
      {symbol && ` ${symbol}`}
      <span ref={hiddenRef} className="invisible absolute left-0">
        {displayBalance}
      </span>
    </div>
  )
}

DisplayBalance.propTypes = {
  maxWidth: PropTypes.number.isRequired,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidthStyle: PropTypes.string,
  className: PropTypes.string,
  initialFontSize: PropTypes.number,
  symbol: PropTypes.string,
}

export default DisplayBalance
