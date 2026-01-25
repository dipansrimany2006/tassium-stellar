import { Box } from "lucide-react";
import Image from "next/image";

interface Container {
  name: string;
  port: number;
}

const containers: Container[] = [
  { name: "nginx-proxy", port: 8080 },
  { name: "postgres-db", port: 5432 },
  { name: "redis-cache", port: 6379 },
  { name: "nginx-proxy", port: 8080 },
  { name: "postgres-db", port: 5432 },
  { name: "redis-cache", port: 6379 },
  { name: "nginx-proxy", port: 8080 },
  { name: "postgres-db", port: 5432 },
  { name: "redis-cache", port: 6379 },
];

export function ContainerArea() {
  return (
    <div className="border border-neutral-700 bg-neutral-800 flex flex-col">
      {/* Header */}
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
