import React from 'react'
import ChatBox from '../ChatBox/ChatBox'
import ChatList from '../ChatList/ChatList'

const Main: React.FC = () => {
  return (
    <div className=' flex h-full w-full lg:w-11/12 lg:h-[94%] rounded-md '>
      <div className='hidden md:block h-full flex-[2]'>
        <ChatList navopt='Channels' />
      </div>
      <ChatBox />
    </div>
  )
}

export default Main
