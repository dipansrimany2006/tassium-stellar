import { Box } from "lucide-react";

interface Container {
  name: string;
  port: number;
}

export function ContainerArea({ containers = [] }: { containers?: Container[] }) {
  if (containers.length === 0) {
    return (
      <div className="border border-neutral-700 bg-neutral-800 p-8 flex items-center justify-center">
        <p className="text-neutral-500 text-sm">No containers running</p>
      </div>
    );
  }

  return (
    <div className="border border-neutral-700 bg-neutral-800 flex flex-col">
      <div className="overflow-y-auto flex-1">
        {containers.map((container, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 border-b border-neutral-700 hover:bg-neutral-700/50"
          >
            <div className="flex items-center gap-2 font-medium">
              <Box className="h-4 w-4" />
              {container.name}
            </div>
            <span className="text-neutral-300">{container.port}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
