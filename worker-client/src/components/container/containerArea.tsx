import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Box } from "lucide-react"
import Image from "next/image"

interface Container {
  name: string
  port: number
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
]

export function ContainerArea() {
  return (
    <div className="border-2 bg-neutral-800 flex flex-col h-[40vh]">
      <div className="overflow-y-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-700">
              <TableHead className="text-neutral-400 flex items-center gap-2">
                <Image src="/TASSIUM.png" alt="Tassium" width={16} height={16} />
                Container
              </TableHead>
              <TableHead className="text-neutral-400">Port</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-scroll">
            {containers.map((container, i) => (
              <TableRow key={i} className="border-b border-neutral-700 hover:bg-neutral-700/50">
                <TableCell className="font-medium flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  {container.name}
                </TableCell>
                <TableCell className="text-neutral-300">{container.port}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
