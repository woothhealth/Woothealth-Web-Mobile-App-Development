"use client";

import { PiHandWaving } from 'react-icons/pi';

const Page = () => (
  <div className="flex px-6 flex-col py-4 md:py-6">
    <h4 className="text-lg">Welcome back,</h4>
    <p className="text-[24px] font-semibold">
      User
      <PiHandWaving className="inline-flex text-[30px] text-[#FAD416]" />
    </p>
  </div>
);

export default Page;