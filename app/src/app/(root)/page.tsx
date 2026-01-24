import { Button } from "@/components/ui/button";
import { DeployDialog } from "@/components/deploy-dialog";
import { SingleDeploymentCard } from "@/components/cards/single-deployment-card";
import { deployments } from "@/constants";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <p className="text-xl font-semibold uppercase">Your Apps</p>
        <DeployDialog>
          <Button className="p-6 px-8" variant={"outline"}>
            Deploy
          </Button>
        </DeployDialog>
      </div>
      <div className="mt-5 w-full grid grid-cols-3 gap-6">
        {deployments.map((deployment, i) => (
          <SingleDeploymentCard key={i} deployment={deployment} />
        ))}
      </div>
    </div>
  );
}
