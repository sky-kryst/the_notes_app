import React from 'react'
import style from './sideNav.module.css'
import Button from '../button/button'
import Image from '../Images/Images'
import Back from '../../../assets/button/back/back1.png'
import Home from '../../../assets/button/home/home1.jpg'

const sideNav = () =>{
    return(
        <div className={style.sideNav}>
            <Button className={style.Button} clicked={()=>window.history.back()}>
                <Image css={style.Back} src={Back}/>
            </Button>
            <Button className={style.Button} clicked={()=>window.history.go('/')}>
                <Image css={style.Home} src={Home}/>
            </Button>
        </div>
    );
};

export default sideNav;