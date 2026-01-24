export interface ApiKey {
  id: string
  keyType: "api"
  expirySeconds: number
  created: string
  expires: string
  scopes: string[]
  description: string
  userId: string
}

export interface AuthKey {
  id: string
  keyType: "auth"
  expirySeconds: number
  created: string
  expires: string
  capabilities: {
    devices: {
      create: {
        reusable: boolean
        ephemeral: boolean
        preauthorized: boolean
      }
    }
  }
  description: string
  userId: string
}

export type TailscaleKey = ApiKey | AuthKey

export interface KeysResponse {
  keys: TailscaleKey[]
}
