"use client"

import { ChartArea } from '@/components/charts/page';
import { ContainerArea } from '@/components/container/containerArea';
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React, { useState } from 'react'

const Page = () => {
  const [hasData, setHasData] = useState<boolean>(true)
  const incentive_amt = 10;

  if (!hasData) {
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center gap-6'>
        <Image
          src="/TASSIUM.png"
          alt="Tassium"
          width={120}
          height={120}
        />
        <p className='text-neutral-400 text-lg'>No incentive data available</p>
        <Button className="p-6 px-8" variant={"outline"} onClick={() => setHasData(true)}>
          Join
        </Button>
      </div>
    )
  }

  return (
    <div className='w-full h-full max-h-[calc(90vh)] grid grid-cols-9 gap-5'>
      <div className="col-span-3 border-2 bg-neutral-800 flex flex-col h-full justify-center">
        <div className="w-full grid grid-cols-2 items-center justify-items-center p-8">
          <Image
            src="/TASSIUM.png"
            alt="Tassium"
            width={120}
            height={120}
          />
          <span className='text-[100px] font-black'>{incentive_amt}</span>
        </div>
        <Button className="p-6 px-8 m-4" variant={"outline"} disabled>
          Claim
        </Button>
      </div>
      <div className="col-span-6 flex flex-col gap-5 max-h-screen overflow-hidden">
        <ChartArea/>
        <ContainerArea/>
      </div>
    </div>
  )
}

export default Page
