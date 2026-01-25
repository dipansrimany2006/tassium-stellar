import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseGitHubUrl(input: string): string {
  const trimmed = input.trim()
  // already short format
  if (/^[^/]+\/[^/]+$/.test(trimmed) && !trimmed.includes('.')) {
    return trimmed
  }
  // full url patterns
  const match = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:\/.*)?$/)
  if (match) {
    return match[1]
  }
  return trimmed
}

export function validateAppName(name: string): string | null {
  if (!name) return "App name required"
  if (name.length > 20) return "Max 20 chars"
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return "Lowercase, start with letter, alphanumeric + hyphens only"
  return null
}
