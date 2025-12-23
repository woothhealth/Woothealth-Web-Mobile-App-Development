import React from 'react'
import Image from 'next/image'

const Management = () => {
  return (
    <section className='py-6 md:py-16 px-6 lg:px-[68px] md:px-10 flex flex-col items-center'>
        <h2 className='text-start text-3xl lg:text-3xl mb-6 lg:mb-8'>Our Management Team</h2>
        <div className='flex flex-col gap-10'>
            <div className='grid grid-col-1 md:grid-cols-2 space-y-4'>
                <div className=''>
                    <Image src='/Team_1.png' height={100} width={500} className='h-[28rem]' alt='Team Picture' />
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='text-[#120052]'>
                        <h3 className='text-2xl font-semibold'>Onyekachukwu Chukwudi</h3>
                        <p className='text-lg'>Founder / CEO</p>
                    </div>
                    <div className='flex flex-col gap-3 text-justify'>
                        <p>
                            Onyekachukwu Chukwudi is the Founder and CEO of Woot Health, a digital health insurance company committed to making quality healthcare simple, accessible, and affordable. A graduate of Mathematics and Computer Science from the National Open University of Nigeria, he brings strong analytical and technical insight into building modern health solutions.
                        </p>
                        <p>
                            He also holds a marketing background from HubSpot Academy, equipping him with customer-focused, growth-driven strategies that shape Woot Health’s product design, communication, and user experience.
                        </p>
                        <p>
                            With experience across customer operations, sales development, and health strategy, Onyekachukwu leads Woot Health with a clear mission: to remove complexity from healthcare and put customers first. Known for his calm leadership and commitment to transparency, he drives the development of smart insurance plans, efficient processes, and a trustworthy customer experience.</p>
                    </div>
                </div>
            </div>

            <div className='grid grid-col-1 md:grid-cols-2 space-y-4'>
                <div className='flex justify-end lg:hidden'>
                    <Image src='/Team_2.png' height={100} width={500} className='h-112' alt='Team Picture' />
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='text-[#120052]'>
                        <h3 className='text-2xl font-semibold'>Adediwin Olugbenga</h3>
                        <p className='text-lg'>Co-Founder</p>
                    </div>
                    <div className='flex flex-col gap-3 text-justify'>
                        <p>
                            Mr. Olugbenga Adediwin is a 2001 graduate of Political Science from the University of Jos, Plateau state, Nigeria. He also has an MBA from the University of Hull, United Kingdom in 2007. He began his professional career with Industrial and General Insurance Company Limited in 2002.
                        </p>
                        <p>
                            Mr. Adediwin has worked with companies that are major players in the downstream subsector of the Nigerian oil and gas sector of Nigeria. He began his career in oil and gas at Chevron Oil Nigeria Plc, he later worked with MRS Oil Nigeria Plc, Eterna Plc and KATA TMS Ltd. He is currently the Managing Director, Chief Executive Officer of Energyswitch Allied Oil Services Limited. Mr. Adediwin is married with children.
                        </p>
                    </div>
                </div>
                
                <div className='hidden lg:flex justify-end'>
                    <Image src='/Team_2.png' height={100} width={500} className='h-112' alt='Team Picture' />
                </div>
            </div>

            <div className='grid grid-col-1 md:grid-cols-2 space-y-4'>
                <div className=''>
                    <Image src='/Team_3.png' height={100} width={500} className='h-[28rem]' alt='Team Picture' />
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='text-[#120052]'>
                        <h3 className='text-2xl font-semibold'>Deborah Thompson</h3>
                        <p className='text-lg'>Product Lead</p>
                    </div>
                    <div className='flex flex-col gap-3 text-justify'>
                        <p>
                            Deborah is a product leader with a knack for turning complex healthcare challenges into simple, human-centered solutions. She began her journey in customer support, where she mastered the art of listening deeply, understanding user pain points, and translating them into products that truly serve people.
                        </p>
                        <p>
                            Since transitioning into tech a few years ago, she has led product initiatives that improve care access, streamline provider interactions, and enhance the everyday health experience for thousands of users. At Woot Health, Deborah combines empathy, data-driven thinking, and strategic execution to build products that don’t just work they work beautifully.
                        </p>
                        <p>
                            Whether she’s shaping product vision, simplifying claims workflows, or advocating for better user experiences, Deborah brings clarity, creativity, and a relentless focus on impact to the table.
                        </p>
                    </div>
                </div>
            </div>

            <div className='grid grid-col-1 md:grid-cols-2 space-y-4'>
                <div className='flex lg:hidden'>
                    <Image src='/Team_4.png' height={100} width={500} className='h-112' alt='Team Picture' />
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='text-[#120052]'>
                        <h3 className='text-2xl font-semibold'>Dr. Tracy Isimemhen</h3>
                        <p className='text-lg'>Operations Manager</p>
                    </div>
                    <div className='flex flex-col gap-3 text-justify'>
                        <p>
                            Isimemhen Tracy Okhomoime is an operations leader with over 5 years of experience building and scaling healthcare and health-tech teams and systems. She brings a strong mix of people leadership, growth execution, and operational structure, with a deep understanding of what it takes to turn ambitious ideas into reliable, everyday delivery.
                        </p>
                        <p>
                            She has led market expansion initiatives, built high-performing teams, and designed practical processes that improve onboarding, service quality, and operational flow. Known for her hands-on leadership style, Tracy focuses on clarity, accountability, and collaboration to help teams move fast while staying aligned.
                        </p>
                        <p>
                            As Head of Operations at Woot Health, Tracy leads core operations, provider coordination, and internal workflows, with a clear goal: building systems that scale smoothly and deliver real value to members and partners.
                        </p>
                    </div>
                    <div className='hidden lg:flex justify-end'>
                    <Image src='/Team_4.png' height={100} width={500} className='h-112' alt='Team Picture' />
                </div>
                </div>
                
            </div>

            <div className='grid grid-col-1 md:grid-cols-2 space-y-4'>
                <div className=''>
                    <Image src='/Team5.png' height={100} width={500} className='h-[28rem]' alt='Team Picture' />
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='text-[#120052]'>
                        <h3 className='text-2xl font-semibold'>Josephine Ibukunoluwa</h3>
                        <p className='text-lg'>Customer Service Lead</p>
                    </div>
                    <div className='flex flex-col gap-3 text-justify'>
                        <p>
                            Josephine Ibukunoluwa Eniayeju is an experienced customer success leader with a strong background in retention strategy, client relationship management, and end-to-end customer operations within the health-tech ecosystem. Over the past five years, she has managed high-value portfolios exceeding ₦4.7B, led cross-functional customer teams, and delivered consistently strong retention and revenue outcomes through structured, data-informed execution.
                        </p>
                        <p>
                            She has guided teams, implemented predictive churn frameworks, strengthened service workflows, and deepened executive-level client engagement, ensuring stability, satisfaction, and long-term account growth. Her leadership is rooted in operational excellence, clear communication, and a disciplined approach to customer lifecycle management.
                        </p>
                        <p>
                            Josephine earned a First Class honours degree in Marketing from Lagos State University, where she developed the analytical and strategic foundations that underpin her work today.
                        </p>
                        <p>
                            She is now set to lead Customer Success, Customer Service, and Retention at WootHealth, where she will shape customer operations, enhance service delivery, and support the company’s nationwide growth objectives.
                        </p>
                    </div>
                </div>
            </div>

            <div className='grid grid-col-1 md:grid-cols-2 space-y-4'>
                <div className='flex justify-end lg:hidden'>
                    <Image src='/Team_6.png' height={100} width={500} className='h-112' alt='Team Picture' />
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='text-[#120052]'>
                        <h3 className='text-2xl font-semibold'>Alfred Blessing</h3>
                        <p className='text-lg'>Providers and Tariff Unit Lead</p>
                    </div>
                    <div className='flex flex-col gap-3 text-justify'>
                        <p>
                            Alfred Blessing leads the Providers and Tariff Unit at Woot Health, one of Nigeria’s fastest-growing health insurers. She holds an Accounting degree from Yaba College of Technology and has solid experience in tariff management, provider relations, billing and cost control. Her leadership is organised and service focused. 
                        </p>
                        <p>
                            Beyond her corporate work, she contributes to community development through volunteer activities that support sustainability and hunger-reduction goals.
                        </p>
                        <p>
                            Alfred brings clarity, discipline, and consistent results. Her vision is to build strong partnerships with healthcare providers, deliver exceptional care for every enrollee, and drive lasting value for Woot Health and its network, ensuring seamless, high-quality healthcare experiences.
                        </p>
                    </div>
                </div>
                <div className='hidden lg:flex justify-end'>
                    <Image src='/Team_6.png' height={100} width={500} className='h-112' alt='Team Picture' />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Management