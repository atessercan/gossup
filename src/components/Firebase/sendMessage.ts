import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import db from './config'

const sendMessage = async (text: string, channel: string) => {
  const user = await JSON.parse(localStorage.getItem('user') || '{}')
  const name = await user[0].name
  const id = await user[0].localeId
  console.log(user)
  try {
    const docRef = await addDoc(collection(db, 'channels', channel, 'messages'), {
      name: name,
      id: id,
      message: text,
      timestamp: serverTimestamp(),
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default sendMessage
