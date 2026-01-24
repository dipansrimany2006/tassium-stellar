"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ApiKey, AuthKey } from "@/types/api"

interface ApiKeyTableProps {
  keys: ApiKey[]
}

export function ApiKeyTable({ keys }: ApiKeyTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Scopes</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Expires</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No API keys found
            </TableCell>
          </TableRow>
        ) : (
          keys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="font-mono text-xs">{key.id}</TableCell>
              <TableCell>{key.description}</TableCell>
              <TableCell>{key.scopes.join(", ")}</TableCell>
              <TableCell>{new Date(key.created).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(key.expires).toLocaleDateString()}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

interface AuthKeyTableProps {
  keys: AuthKey[]
}

export function AuthKeyTable({ keys }: AuthKeyTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Reusable</TableHead>
          <TableHead>Ephemeral</TableHead>
          <TableHead>Preauthorized</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Expires</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              No auth keys found
            </TableCell>
          </TableRow>
        ) : (
          keys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="font-mono text-xs">{key.id}</TableCell>
              <TableCell>{key.description}</TableCell>
              <TableCell>{key.capabilities.devices.create.reusable ? "Yes" : "No"}</TableCell>
              <TableCell>{key.capabilities.devices.create.ephemeral ? "Yes" : "No"}</TableCell>
              <TableCell>{key.capabilities.devices.create.preauthorized ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(key.created).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(key.expires).toLocaleDateString()}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
