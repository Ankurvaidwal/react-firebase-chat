import React, { useState } from 'react'
import "./Login.css"
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import upload from '../../lib/upload';

const Login = () => {

  const [avatar, setAvatar] = useState({
    file: null,
    imgUrl: ''
  })

  const [loading, setLoading] = useState(false);


  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        imgUrl: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],

      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created! Please Login!!")

    } catch (error) {
      console.error(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
      
    }
  }



  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome Back</h2>
        <form action="" onSubmit={handleLogin} autoComplete='off'>
          <input type="text" placeholder='Email' name='email' />
          <input type="password" placeholder='Password' name='password' />
          <button disabled={loading}>{loading ? "loading..." : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account !!</h2>
        <form onSubmit={handleRegister} autoComplete='off'>

          <label htmlFor="file">
            <img src={avatar.imgUrl || './avatar.png'} alt=''></img>
            Upload an Image
          </label>
          <input type="file" id='file' style={{ display: 'none' }} onChange={handleAvatar} />
          <input type="text" placeholder='Username' name='username' />
          <input type="text" placeholder='Email' name='email' />
          <input type="password" placeholder='Password' name='password' />
          <button disabled={loading}>{loading ? "loading..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login