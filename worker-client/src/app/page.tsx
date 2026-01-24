"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiKeyTable, AuthKeyTable } from "@/components/KeysTable"
import type { ApiKey, AuthKey, TailscaleKey } from "@/types/api"

export default function Home() {
  const [apiAccessToken, setApiAccessToken] = useState("")
  const [tailnetId, setTailnetId] = useState("")
  const [keys, setKeys] = useState<TailscaleKey[]>([])
  const [apiPopoverOpen, setApiPopoverOpen] = useState(false)
  const [tailnetPopoverOpen, setTailnetPopoverOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const apiKeys = keys.filter((k): k is ApiKey => k.keyType === "api")
  const authKeys = keys.filter((k): k is AuthKey => k.keyType === "auth")

  const fetchKeys = async () => {
    if (!apiAccessToken || !tailnetId) {
      alert("Please set both API key and Tailnet ID first")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/tailscale/keys", {
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          "X-Tailnet-Id": tailnetId,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch keys")
      const data = await res.json()
      setKeys(data.keys || [])
    } catch (err) {
      console.error(err)
      alert("Failed to fetch keys")
    } finally {
      setLoading(false)
    }
  }

  const createAuthKey = async () => {
    if (!apiAccessToken || !tailnetId) {
      alert("Please set both API key and Tailnet ID first")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/tailscale/keys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
          "X-Tailnet-Id": tailnetId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyType: "auth",
          capabilities: {
            devices: {
              create: {
                reusable: false,
                ephemeral: false,
                preauthorized: false,
              },
            },
          },
        }),
      })
      if (!res.ok) throw new Error("Failed to create auth key")
      const data = await res.json()
      alert(`Auth key created: ${data.key}`)
      fetchKeys()
    } catch (err) {
      console.error(err)
      alert("Failed to create auth key")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiToken = () => {
    setApiPopoverOpen(false)
  }

  const handleSaveTailnetId = () => {
    setTailnetPopoverOpen(false)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tailscale Keys</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchKeys} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button variant="outline" onClick={createAuthKey} disabled={loading}>
            Create Auth Key
          </Button>
          <Popover open={tailnetPopoverOpen} onOpenChange={setTailnetPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">Add Tailnet ID</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter your Tailnet ID (found in Tailscale admin console)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tailnet-id">Tailnet ID</Label>
                  <Input
                    id="tailnet-id"
                    placeholder="eg. example.com"
                    value={tailnetId}
                    onChange={(e) => setTailnetId(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveTailnetId} className="w-full">
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={apiPopoverOpen} onOpenChange={setApiPopoverOpen}>
            <PopoverTrigger asChild>
              <Button>Insert API Key</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Visit{" "}
                    <a
                      href="https://tailscale.com/console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      https://tailscale.com/console
                    </a>{" "}
                    &gt; Settings &gt; Keys &gt; Create API key
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">Paste API key here:</Label>
                  <Input
                    id="api-key"
                    placeholder="eg. tikahodkosfkp-fdnkjnojk-jfknfk"
                    value={apiAccessToken}
                    onChange={(e) => setApiAccessToken(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveApiToken} className="w-full">
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList>
          <TabsTrigger value="auth">Auth Key List</TabsTrigger>
          <TabsTrigger value="api">API Key List</TabsTrigger>
        </TabsList>
        <TabsContent value="auth" className="mt-4">
          <div className="border rounded-lg">
            <AuthKeyTable keys={authKeys} />
          </div>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <div className="border rounded-lg">
            <ApiKeyTable keys={apiKeys} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
