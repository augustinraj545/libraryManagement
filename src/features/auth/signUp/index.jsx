import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'

import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../../hooks/useAuthContext'

import { toast } from 'react-hot-toast'

export default function SignUp() {
  const { session } = useAuthContext()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [msg, setMsg] = useState("");

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/shop");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) return toast.error("Input does not match")

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.error_description || error.message)
    }

    if (!error && data) {
      toast.success(
        "Registration Successful. Check your email to confirm your account"
      );
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-full max-w-xs mx-auto'>
      <form className='w-full flex flex-col gap-2' onSubmit={handleSubmit}>
        <p className='font-bold text-3xl my-4'>New User</p>
        <input type="email" name="name" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required={true} />
        <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required={true} />
        <input type="password" name="password" placeholder='Re-enter Password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={true} />
        <div className='font-mono'>{msg}</div>
        <button className='text-white bg-blue-600 rounded-sm py-2 px-4 font-bold'>Sign Up</button>
        <div>Existing User? <a href='/signin' className='text-blue-600 underline'>Sign In</a></div>
      </form>
    </div>
  )
}
