"use client";

import DataView from "@/components/cards/data-view";
import { ChartArea } from "@/components/charts/page";
import { ContainerArea } from "@/components/container/containerArea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [hasData, setHasData] = useState<boolean>(true);

  // Worker data
  const credits = 1250;
  const ipAddress = "100.75.8.67";
  const status: "up" | "down" = "up";

  if (!hasData) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
        <Image src="/TASSIUM.png" alt="Tassium" width={120} height={120} />
        <p className="text-neutral-400 text-lg">No incentive data available</p>
        <Button
          className="p-6 px-8"
          variant={"outline"}
          onClick={() => setHasData(true)}
        >
          Join
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-9 gap-5">
      <div className="col-span-3 h-full">
        <DataView credits={credits} ipAddress={ipAddress} status={status} />
      </div>

      <div className="col-span-6 flex flex-col gap-5 max-h-screen overflow-hidden">
        <ChartArea />
      </div>
      <div className="w-full col-span-9">
        <ContainerArea />
      </div>
    </div>
  );
};

export default Page;
