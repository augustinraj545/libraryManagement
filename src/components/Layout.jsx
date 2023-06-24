import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className='flex-[1] text-white'>
                <Outlet />
            </div>
        </>
    )
}
export default Layout