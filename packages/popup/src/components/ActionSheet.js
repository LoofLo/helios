import PropTypes from 'prop-types'
import {useClickAway} from 'react-use'
import {CloseOutlined} from '@fluent-wallet/component-icons'
import {useRef} from 'react'
import {useSlideAnimation} from '../hooks'

const ActionSheet = ({
  onClose,
  showActionSheet = false,
  title,
  children = null,
  HeadContent = null,
}) => {
  const animateStyle = useSlideAnimation(showActionSheet)
  const ref = useRef(null)

  useClickAway(ref, e => {
    onClose && onClose(e)
  })

  if (!animateStyle) {
    return null
  }
  return (
    <div>
      <div
        className={`z-20 bg-bg rounded-t-xl px-3 pt-4 pb-7 absolute w-93 bottom-0 overflow-y-auto no-scroll ${animateStyle} h-125`}
        ref={ref}
      >
        <div className="ml-3 pb-1">
          <p className="text-base text-gray-80 font-medium">{title}</p>
          <HeadContent />
        </div>
        <CloseOutlined
          onClick={onClose}
          className="w-5 h-5 text-gray-60 cursor-pointer absolute top-3 right-3"
        />
        {children}
      </div>
      <div className="absolute inset-0 z-10" />
    </div>
  )
}

ActionSheet.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  showActionSheet: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  HeadContent: PropTypes.elementType,
}
export default ActionSheet
