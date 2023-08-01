import React from 'react'
import { Outlet } from 'react-router-dom';
const EmptyPage = () => {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default EmptyPage