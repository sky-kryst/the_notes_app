import React from 'react';
import Tile from './tile/tile'

const tiles = (props) => {
  let tiles

  tiles = props.data.map(el => {
    return (<Tile
      key={el._id}
      id={el._id}
      title={el.title}
      body={el.body}
      likes={el.likesCount}
      tLength={props.TLength}
      bLength={props.BLength}
    />)
  })
  
  return tiles
}

export default tiles;