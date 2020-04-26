import React, { useState } from 'react'

export const PermissionContext = React.createContext({
  permission:'',
  setPermission: () => {},
})

export const PermissionContextProvider = props => {
  const [permission, setPermission] = useState('')

  return (
    <PermissionContext.Provider
      value={{permission: permission,setPermission: val => setPermission(val) }}
    >
      {props.children}
    </PermissionContext.Provider>
  )
}

export default PermissionContext