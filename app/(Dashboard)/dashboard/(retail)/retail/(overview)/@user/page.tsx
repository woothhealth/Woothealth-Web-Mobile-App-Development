import { PiHandWaving } from 'react-icons/pi';
import { getCurrentUser } from '@/lib/currentUser';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect('/login');
  }

  const displayName = (user.name || user.email || 'User')?.toString().split(' ')[0];
  const role = user.role || 'retail';

  return (
    <div className="flex px-6 flex-col py-4 md:py-6">
      <h4 className="text-lg">Welcome back,</h4>
      <p className="text-[26px] font-semibold">
        {displayName}
        <PiHandWaving className="inline-flex text-[30px] text-[#FAD416]" />
      </p>
    </div>
  );
}