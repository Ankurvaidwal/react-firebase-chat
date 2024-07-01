import React from 'react'
import "./Details.css"
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Details = () => {

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {

    if (!user) return;

    const userDocRef = doc(db, 'users', currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <div className='details'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Hey There I am using react-chat!! </p>
      </div>

      <div className="info">
        <div className="options">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images7.alphacoders.com/132/1325363.png" alt="" />
                <span>photo_1243.png</span>
              </div>
              <img src="./download.png" alt="" className='icon_download' />
            </div>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images7.alphacoders.com/132/1325363.png" alt="" />
                <span>photo_1243.png</span>
              </div>
              <img src="./download.png" alt="" className='icon_download' />
            </div>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images7.alphacoders.com/132/1325363.png" alt="" />
                <span>photo_1243.png</span>
              </div>
              <img src="./download.png" alt="" className='icon_download' />
            </div>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images7.alphacoders.com/132/1325363.png" alt="" />
                <span>photo_1243.png</span>
              </div>
              <img src="./download.png" alt="" className='icon_download' />
            </div>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images7.alphacoders.com/132/1325363.png" alt="" />
                <span>photo_1243.png</span>
              </div>
              <img src="./download.png" alt="" className='icon_download' />
            </div>
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "you are blocked" : isReceiverBlocked ? "user Blocked" : "Block user"
        } </button>
        <button className='logout' onClick={() => auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Details