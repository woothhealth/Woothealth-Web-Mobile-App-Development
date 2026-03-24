import SecurityPanel from "./SecurityPanel"

interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  browser: string;
  osName: string;
}

interface SecurityTabProps {
  sessions: Session[];
  onPasswordChange: (newPassword: string, confirmPassword: string) => Promise<void>;
  onRemoveSession: (sessionId: string) => Promise<void>;
}

export default function SecurityTab({ sessions, onPasswordChange, onRemoveSession }: SecurityTabProps) {
  return (
    <section className='flex flex-col space-y-6 lg:w-[55%] md:mx-auto h-fit px-3 md:px-0'>
      <div className='flex flex-col space-y-6 bg-[#FFFFFF] rounded-xl p-6'>
        <div>
          <h3 className="text-xl font-semibold">Security</h3>
          <p className='text-[15px]'>Manage your account settings and preferences</p>
        </div>
        <div>
          <SecurityPanel onPasswordChange={onPasswordChange} />
        </div>
      </div>

      <div className='flex flex-col space-y-6 bg-[#FFFFFF] rounded-xl p-6'>
        <h3 className="text-xl font-semibold">Devices and Activities</h3>
        <div className='flex flex-col space-y-4'>
          {sessions.map((session) => (
            <div
              key={session.id}
              className='flex border border-[#D9D9D9] rounded-[10px] py-4 px-6 justify-between items-center'
            >
              <div className='flex space-x-4 flex-1'>
                <div className='bg-[#49A5EF1A] p-3 rounded-[5px] h-fit'>
                  {session.browser.toLowerCase().includes('safari') ? '📱' : '💻'}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <p className='text-[15px] font-semibold'>{session.deviceName}</p>
                    {session.isCurrent && (
                      <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>Current</span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600'>{session.location}</p>
                  <p className='text-xs text-gray-500 mt-1'>
                    IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => onRemoveSession(session.id)}
                  className='text-base text-[#EF4444] font-semibold hover:text-red-600 transition-colors'
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No active sessions</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}