import React from 'react'

const Image = (props) =>{
    return(
        <div className={props.css}><img src={props.src} alt=""/></div>
    );
};

export default Image;