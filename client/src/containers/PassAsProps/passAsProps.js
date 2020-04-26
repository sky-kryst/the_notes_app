import React from 'react'
const PassAsProps = (props, values) => WrappedFunc => (
  <WrappedFunc {...props} {...values} />
)

export default PassAsProps
