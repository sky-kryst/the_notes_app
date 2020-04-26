import React, { useState } from 'react'

export const RequestsContext = React.createContext({
  isRequests: false,
  requests: [],
  setRequests: () => {},
  setIsRequests: () => {},
})

export const RequestsContextProvider = props => {
  const [requests, setRequests] = useState([])
  const [isRequests, setIsRequests] = useState(false)

  const requestHandler = arr => {
    setRequests(arr)
    if (arr.length > 0) {
      setIsRequests(true)
    } else {
      setIsRequests(false)
    }
  }

  return (
    <RequestsContext.Provider
      value={{
        isRequests: isRequests,
        requests: requests,
        setRequests: arr => requestHandler(arr),
        setIsRequests: setIsRequests,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  )
}

export default RequestsContextProvider
