import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from './input';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import store from '@/redux/Store';

const Login = () => {
    const dispatch = useDispatch()
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {user}= useSelector(store=>store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('https://satyam-chat.onrender.com/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate("/");
                toast.success(res.data.message);
                setInput({ email: "", password: "" });
            } else {
                toast.error(res.data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        if(user){
            navigate("/")
        }
    })

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <form onSubmit={loginHandler} className='bg-white shadow-lg rounded-lg p-8 w-96'>
                <div className='mb-6 text-center'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-1'>Satyam Chat</h1>
                    <hr />
                    <p className='text-gray-500 mt-3'>Login to connect with your friends</p>
                </div>
                
                <div className='mb-4'>
                    <label className='font-medium text-gray-700'>Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                </div>
                
                <div className='mb-6'>
                    <label className='font-medium text-gray-700'>Password</label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                </div>

                {
                    loading ? (
                        <Button className='w-full flex items-center justify-center bg-yellow-700 text-white p-2 rounded-md shadow hover:bg-yellow-800 transition duration-200'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className='w-full bg-yellow-700 text-white p-2 rounded-md shadow hover:bg-yellow-800 transition duration-200'>
                           Login
                        </Button>
                    )
                }

                <span className="text-sm mt-4 text-gray-600 block text-center">
                    Create New Account
                    <Link to="/signup" className="text-blue-600 hover:underline ml-1">
                        SignUp
                    </Link>
                </span>
            </form>
        </div>
    );
}

export default Login;
