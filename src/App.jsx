import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePages from './Pages/HomePages'
import ProfilePages from './Pages/ProfilePages'
import Navbar from './Elements/Navbar'
import TrashPages from './Pages/TrashPages'


function App() {
  const [newProfile, setNewProfile] = useState(false);
  const [RemoveProfile, setRemoveProfile] = useState(false);
  const [addCard, setAddCard] = useState(false)
  const [OpenCard, setOpenCard] = useState(false);
  const [ProfileId, setProfileId] = useState(localStorage.getItem('profileId') || '');

  return (
    <div className='dark:bg-black bg-white'>
      <Navbar newProfile={newProfile} setNewProfile={setNewProfile} RemoveProfile={RemoveProfile} setRemoveProfile={setRemoveProfile} setProfileId={setProfileId}/>
      <div style={{filter: newProfile || RemoveProfile ? 'blur(5px)' : 'none'}} className='p-4'>
        <Routes>
          <Route path="/" element={<HomePages addCard={addCard} setAddCard={setAddCard} OpenCard={OpenCard} setOpenCard={setOpenCard} ProfileId={ProfileId}/>}></Route>
          <Route path='/Profile' element={<ProfilePages />}></Route>
          <Route path='/Trash' element={<TrashPages />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
