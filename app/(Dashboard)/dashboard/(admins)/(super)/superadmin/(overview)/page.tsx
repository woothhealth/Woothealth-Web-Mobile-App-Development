import React from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import PieChartWithCustomizedLabel from '../UIs/PieChart'

const Page = () => {
  return (
    <section className='py-4 text-[#000000] px-4'>
      <div className='flex space-x-4'>
        <div className='px-2 flex items-center border border-[#D9D9D9] rounded-[5px] text-[15px]'>
          <FaRegFileAlt className='text-sm' />
        </div>
        <h3 className='font-semibold text-lg'>Claims Status</h3>
      </div>
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <PieChartWithCustomizedLabel isAnimationActive={true}/>
      </div>
    </section>
  )
}

export default Page


// import { getAdminCurrentUser } from '@/lib/adminCurrentUser';
// import { normalizeRole } from '@/lib/permissions';
// import RoleOverview from './RoleOverview';

// const Page = async () => {
//   const user = await getAdminCurrentUser();
//   const role = normalizeRole(user?.role) || 'superadmin';

//   return <RoleOverview role={role} />;
// };

// export default Page;