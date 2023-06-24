import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'

import { toast } from 'react-hot-toast'
import { useAuthContext } from '../../../hooks/useAuthContext'

import { useNavigate } from 'react-router-dom'

import google from '../../../assets/google.png'

export default function SignIn() {
  const { session } = useAuthContext()

  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  useEffect(() => {
    if (session) {
      navigate("/shop");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(error.error_description || error.message)
    }

    if (!error && data) {
      toast.success(
        "Successful!"
      );
      navigate('/shop')
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center h-full max-w-sm mx-auto'>
      <form className='w-full flex flex-col gap-2 border border-white rounded-md p-4 bg-white' onSubmit={handleSubmit}>
        <p className='font-bold text-3xl my-4 text-black'>Welcome Back</p>
        <input type="email" name="name" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required={true} />
        <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required={true} />
        <button className='text-white bg-blue-600 rounded-sm py-2 px-4 font-bold'>Sign In</button>
        <div className='mt-2 text-black'>Are you new here? <a href='/signup' className='ml-[1px] text-blue-600 underline'>Create Account</a></div>
      </form>
      <div className='mt-10'>
        <button onClick={signInWithGoogle} className=' rounded-md p-2 border border-slate-200 bg-white'><img src={google} width={24} height={24} /></button>
      </div>
    </div>
  )
}
