/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useRef, useEffect } from 'react'
import { query, collection, onSnapshot, orderBy, limitToLast } from 'firebase/firestore'
import db from '../Firebase/config'
import sendMessage from '../Firebase/sendMessage'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { change } from '../../store/profileSlice'
import ChatList from '../ChatList/ChatList'
interface MapInterface {
  message?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp?: any
  id?: string
  name?: string
}

const ChatBox: React.FC = () => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.change.value)
  const channel = useAppSelector((state) => state.channel.value)
  const [messages, setMessages] = useState([{}])
  const [loadMessages, setLoadMessages] = useState(10)
  const [, setLocalName] = useState('')
  const [localeId, setLocalId] = useState('')
  const textRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const q = query(
    collection(db, 'channels', channel, 'messages'),
    orderBy('timestamp'),
    limitToLast(loadMessages),
  )
  const messagesList: Array<MapInterface> = []

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()

    textRef.current!.value.trim() != '' && sendMessage(textRef.current!.value, channel)
    textRef.current!.value = ''
  }
  const loadMessageHandler = () => {
    setLoadMessages((prev) => prev + 10)
  }

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const dateObj = new Date(doc.data()?.timestamp?.toDate())
      const date = dateObj.toLocaleDateString('en-US')
      const hours = dateObj.getHours()
      const minutes = () => {
        const minute = dateObj.getMinutes()
        if (minute < 10) return `0${minute}`
        else return minute
      }
      const clock = `${hours}:${minutes()}`
      messagesList.push({
        id: doc.data().id,
        name: doc.data().name,
        message: doc.data().message,
        timestamp: `${clock}  ${date}`,
      })
    })
    if (messagesList.length != messages.length || messagesList.length == 1)
      setMessages(messagesList)
  })

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 700)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const name = user[0].name
    const id = user[0].localeId
    setLocalName(name)
    setLocalId(id)
    dispatch(change(name))
  }, [channel])

  return (
    <div className='relative flex-[5] flex flex-col justify-between gap-2 w-full h-full rounded-tr-md rounded-br-md bg-slate-600'>
      <div className='md:hidden left-0'>
        <ChatList navopt='none' />
      </div>
      <div className='flex justify-center items-center text-gray-300 text-center'>
        <p>
          <strong>{profile}</strong>&nbsp;you are in <strong>{channel}</strong>
        </p>
      </div>
      <div className='flex flex-col h-full w-full overflow-y-scroll sm:scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-600'>
        <div
          className='bg-slate-500 text-gray-300 text-center py-1 px-2 mt-2 self-center w-64 cursor-pointer rounded-lg'
          onClick={loadMessageHandler}
        >
          Load More
        </div>
        {messages.map(
          (item: MapInterface): JSX.Element => (
            <div
              ref={bottomRef}
              className={`flex flex-col bg-slate-400 w-64 sm:w-96 mx-2 my-4 sm:m-4 rounded-xl py-1 px-2 gap-1 ${
                item.id == localeId ? 'opacity-70 self-end' : 'opacity-100 self-start'
              }`}
              key={Math.random()}
            >
              <span className='font-semibold'>{item.name}</span>
              <span>{item.message}</span>
              <span className='self-end text-[10px]'>{item.timestamp}</span>
            </div>
          ),
        )}
      </div>
      <form onSubmit={submitHandler}>
        <div className='flex justify-between items-center gap-1 pl-px pr-2 mb-2'>
          <input
            className='h-11 w-full m-1 py-1 px-2 rounded-md bg-slate-700 leading-6 text-gray-300 outline-none'
            type='text'
            placeholder='Type a message'
            // onChange={onChangeHandler}
            ref={textRef}
          />
          <button
            className='w-20 h-11 px-4 py-2 rounded-md bg-slate-400 hover:bg-slate-500 text-gray-100 tracking-wider'
            type='submit'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
export default ChatBox
