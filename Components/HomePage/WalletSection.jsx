import React from 'react'
import Image from 'next/image'
import { LuActivity } from 'react-icons/lu'
import { MdOutlineShield, MdOutlineTrendingUp } from 'react-icons/md'
import { GoDotFill } from 'react-icons/go'
import { IoWalletOutline } from 'react-icons/io5'
import { FaRegBell } from 'react-icons/fa6'
import { Reveal } from '@/UI/Reveal'

const advantage = [
    {
        icon: MdOutlineShield,
        title: 'Secure Payment',
        desc: 'Bank-grade encryption'
    },
    {
        icon: LuActivity,
        title: 'Real-Time Tracking',
        desc: 'Monitor every transaction'
    },
    {
        icon: MdOutlineTrendingUp,
        title: 'Transparent Records',
        desc: 'Complete transaction history'
    }
]
const WalletSection = () => {
  return (
    <section className='py-8 lg:px-[68px] md:px-10 px-6'>
        <div className='flex lg:flex-row flex-col justify-center items-center space-y-8'>
            <div className='flex flex-col space-y-5 lg:w-[60%]'>
                <Reveal>
                    <h2 className='text-[#120052] text-[45px] leading-10 lg:text-[48px] font-bold'>Woot Wallet Advantage</h2>
                </Reveal>
                <Reveal>
                    <p className='lg:text-[32px] text-[21px] text-[#49A5EF] lg:max-w-2xl lg:leading-10 leading-8'>Top up your Woot Wallet and take control of your healthcare spending. Add money, Track your balance, and do lots more just from your finger tips.</p>
                </Reveal>
                <Reveal>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-[90%] lg:w-full mx-auto'>
                    {advantage.map((adv, index) => {
                        const first = index === 1;
                        const second = index === 2;
                        return (
                            <div key={index} className='flex gap-3'>
                            <div><adv.icon className={`text-[#10B981] text-3xl ${first ? 'text-[#49A5EF]' : ''} ${second ? 'text-[#8063E8]' : ''}`}/></div>
                            <div>
                                <h3 className='font-bold'>{adv.title}</h3>
                                <p className='text-sm'>{adv.desc}</p>
                            </div>
                        </div>
                    )
                })}
                </div>
                </Reveal>
            </div>
            <div className='lg:w-[40%] relative'>
                <Image src='/Wallet_img.png' alt='WootHealth Wallet Image' width={200} height={100} className='object-cover w-full h-fit' />
                <div className='absolute top-10 lg:top-18 left-0 flex gap-2 lg:gap-4 items-center bg-[rgba(255,255,255,0.75)] rounded-[10px] py-2 px-4 w-fit'>
                    <IoWalletOutline className='text-[#49A5EF] text-lg lg:text-xl'/>
                    <div>
                        <h3 className='text-[10px] lg:text-[12px] font-semibold'>Multiple Top-Up Options</h3>
                        <p className='lg:text-[10px] text-[8px]'>Card <GoDotFill className='inline-flex text-[#D9D9D9]'/> Transfer <GoDotFill className='inline-flex text-[#D9D9D9]'/> USSD</p>
                    </div>
                </div>
                <div className='absolute right-0 top-35 lg:top-54 flex gap-2 lg:gap-4 items-center bg-[rgba(255,255,255,0.75)] rounded-[10px] py-2 px-4 w-fit'>
                    <FaRegBell className='text-[#49A5EF] text-lg lg:text-xl'/>
                    <div>
                        <h3 className='text-[10px] lg:text-[12px] font-semibold'>Instant Alerts</h3>
                        <p className='text-[8px] lg:text-[10px] w-35'>Your wallet was credited with <span className='font-semibold'>#150,000</span></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default WalletSection