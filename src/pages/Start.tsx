import { Sidebar } from '@/components/Sidebar.tsx'
import { NavLink } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <Sidebar />

      <div className="text-white w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <NavLink
          to="/chat"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block text-center">
          To Chat Room
        </NavLink>
      </div>
    </div>
  )
}

export default Start
