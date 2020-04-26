import React, {useContext} from 'react';
import css from './pageNo.module.css'
import PageContext from '../../../Context/page'

const PageNo = () => {
    const { page, setPage } = useContext(PageContext)
    
    const inputChangeHandler=e=> setPage(e.target.value)

    return(
        <div className={css.page}>
            Page No: <input type="number" step="1" required min="1"
                onChange={inputChangeHandler} value={page}/>
        </div>

    );
};

export default PageNo;