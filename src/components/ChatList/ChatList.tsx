/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useRef, useState } from 'react'
import { query, collection, onSnapshot } from 'firebase/firestore'
import db from '../Firebase/config'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { change } from '../../store/profileSlice'
import { channel } from '../../store/channelSlice'
import useLocalStorage from '../../hooks/use-localstorage'
import githubLogo from './../../assets/github.png'
import linkedinLogo from './../../assets/linkedin.png'

interface IProps {
  navopt?: string
}
interface MapInterface {
  name?: string
}

const ChatList: React.FC<IProps> = (props): JSX.Element => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.change.value)
  const currentChannel = useAppSelector((state) => state.channel.value)
  const [, setLocalS] = useLocalStorage('user', [])
  const [channels, setChannels] = useState([{}])
  const [nav, setNav] = useState(props.navopt)
  const nickNameRef = useRef<HTMLInputElement>(null)
  const menuItems: Array<string> = ['Channels', 'Profile', 'About']
  const q = query(collection(db, 'channels', 'channel-list', 'channel-names'))
  const channelList: Array<MapInterface> = []

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      channelList.push({
        name: doc.data().name,
      })
    })
    channelList.length != channels.length && setChannels(channelList)
  })

  const navChangeHandler = (event: React.MouseEvent<HTMLElement>) => {
    const target = event?.currentTarget as HTMLInputElement
    const option = target.innerText
    option === nav ? setNav('none') : setNav(option)
  }

  const nickSubmitHandler = (event: FormEvent) => {
    event.preventDefault()
    setNav('Channels')
    console.log(nickNameRef.current?.value)
    const nickname: any = nickNameRef.current?.value
    dispatch(change(nickname))
    const lsArray = JSON.parse(localStorage.getItem('user') || '{}')
    lsArray[0].name = nickname
    setLocalS(lsArray)
  }

  const channelChangeHandler = (event: React.MouseEvent<HTMLElement>) => {
    const target = event?.currentTarget as HTMLInputElement
    const option = target.innerText
    dispatch(channel(option))
  }

  return (
    <div className='flex-[2] bg-slate-700 overflow-y-hidden rounded-bl-md rounded-tl-md sm:min-w-[17rem] h-full md:h-full'>
      <nav className='flex justify-center items-center bg-slate-500 h-12 rounded-tl-md'>
        <ul className='flex justify-around w-full'>
          {menuItems.map((item) => (
            <li
              key={Math.random()}
              className={`hover:bg-slate-600 px-4 py-2 mx-1 rounded-md text-gray-300 cursor-pointer ${
                nav == item ? 'bg-slate-600' : 'bg-transparent'
              }`}
              onClick={navChangeHandler}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
      {nav === 'Channels' && (
        <div className='mt-4 flex flex-wrap justify-center mb-4 md:mb-0'>
          {channels.map(
            (item: MapInterface): JSX.Element => (
              <div
                className={`flex flex-col m-1 rounded-xl py-1 px-2 max-w-content cursor-pointer bg-slate-400 hover:bg-slate-500 ${
                  item.name == currentChannel && ' text-gray-200 bg-teal-600'
                }`}
                key={Math.random()}
                onClick={channelChangeHandler}
              >
                <span>{item.name}</span>
              </div>
            ),
          )}
        </div>
      )}
      {nav === 'Profile' && (
        <div className='flex justify-center items-center'>
          <form
            className='flex flex-col justify-center items-center gap-4 my-4 mx-2'
            onSubmit={nickSubmitHandler}
          >
            <label className='flex items-center gap-2 text-gray-100'>
              Name
              <input
                className='outline-none bg-slate-300 text-gray-900 py-px px-1 rounded-md'
                type='text'
                ref={nickNameRef}
                defaultValue={profile}
              />
            </label>
            <button
              className='w-full bg-slate-400 hover:bg-slate-500 rounded-md mb-4 md:mb-0'
              type='submit'
            >
              Set
            </button>
          </form>
        </div>
      )}
      {nav === 'About' && (
        <div className='flex flex-col md:justify-between gap-5 md:gap-0 mb-4 md:mb-0 h-[92%]'>
          <div className='flex flex-wrap justify-center items-center gap-2 mt-4 px-1 text-gray-200'>
            <p className='text-center'>
              <strong className='font-semibold'>Goss&apos;up</strong>&nbsp;is an IRC-Like instant
              messaging app built with <strong className='font-semibold'>React</strong>,
            </p>
            <p className='text-center'>
              styled with <strong className='font-semibold'>TailwindCSS</strong>&nbsp;and its global
              states managed via <strong className='font-semibold'>Redux-Toolkit</strong>. It
              powered by <strong className='font-semibold'>Google&apos;</strong>s{' '}
              <strong className='font-semibold'>Cloud Firestore</strong> for realtime data fetching.
            </p>
          </div>
          <div className='flex flex-col justify-center text-center gap-6'>
            <span className='text-gray-200'>Contact me</span>
            <div className='flex justify-evenly items-center text-gray-200'>
              <span className='cursor-pointer'>
                <a href='https://github.com/atessercan'>
                  <img src={githubLogo} alt='github logo' width={35} />
                </a>
              </span>
              <span className='cursor-pointer'>
                <a href='https://linkedin.com/in/sercanates'>
                  <img src={linkedinLogo} alt='linkedin logo' width={35} />
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatList
