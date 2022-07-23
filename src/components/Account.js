import { doc, serverTimestamp, setDoc,getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import {ref,uploadBytesResumable,getDownloadURL} from "firebase/storage"
import {v4} from "uuid"

const Account = () => {
  const { user, logout } = UserAuth();
  const [passowrd,setPassword]=useState('')
  const [data,setData]=useState({})
  const [image,setImage]=useState("")
  const [per,setPer]=useState(null)

  useEffect(() => {
    const uploadFile =()=>{
      const name=image.name+ new Date().getTime()
      const storageRef=ref(storage,name)
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPer(progress)
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
          if(progress===100){alert('image uploaded')}
        }, 
        (error) => console.log(error), 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL)
            setData((prev)=>({...prev,img:downloadURL}))
          });
        }
      );
          };
    image && uploadFile();
  }, [image]);

  const navigate = useNavigate();

  const handleInput= (e)=>{
    const id=e.target.id;
    const value=e.target.value;
    const useremail=user.email;
    setData({...data,[id]:value});
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      await setDoc(doc(db,"users",user.uid+v4()),
      {
        ...data,
        email:user.email,
        timestamp:serverTimestamp()
      },
      navigate('/list'))
    }catch(e){console.log(e)}

  }
  console.log(data)

  return (
    <div className='max-w-[600px] mx-auto my-16 p-4'>
      <h1 className='text-2xl font-bold py-4'>Add Todo</h1>
      <p>User Email: {user && user.email}</p>
      <form>
        <div className='flex flex-col py-2'>
          <label className='py-2 font-medium'>Task</label>
          <input className='border p-3' type='text' placeholder="todo" id="text" onChange={handleInput} />
        </div>
        <div className='flex flex-col py-2'>
          <label className='py-2 font-medium'>Image</label>
          <input className='border p-3' type='file' placeholder="Image" id="image" onChange={e=>setImage(e.target.files[0])}/>
        </div>
      </form>

      <button disabled={per!=null && per<100} onClick={handleSubmit} className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-half p-4 my-2 text-white'>
        Submit
      </button>
      <button onClick={handleLogout} className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-half mx-4 p-4 my-2 text-white'>
        Logout
      </button>
      <Link to='/list' className='underline'>
            List of all todos
          </Link>
    </div>
  );
};

export default Account;
