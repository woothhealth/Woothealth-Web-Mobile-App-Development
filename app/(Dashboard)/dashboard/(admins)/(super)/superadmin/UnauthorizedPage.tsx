import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4 py-10'>
      <div className='md:w-3xl w-full p-8'>
        <div className='text-center'>
          <p className='text-sm uppercase tracking-[0.3em] text-red-500 animate-pulse font-semibold'>Unauthorized</p>
          <h1 className='mt-4 text-4xl font-bold text-[#111827]'>Access denied</h1>
          <p className='mt-4 text-base leading-7 text-slate-600'>You do not have permission to view this page. If you believe this is an error, contact your administrator or choose a permitted workflow from the sidebar.</p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Link href='/dashboard/superadmin' className='rounded-[15px] bg-primary px-6 py-3 text-white shadow hover:bg-primary/80'>Go back to Overview</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
