import React, {useState} from 'react'

export const PageContext = React.createContext({
  page:"1",
  updatePage: () => {},
})

export const PageContextProvider = props=> {
  const [page,setPage]=useState("1")
  return (
    <PageContext.Provider value={{
        page: page, setPage: val=>setPage(val)
      }}>
        {props.children}
    </PageContext.Provider>
  )
}

export default PageContext