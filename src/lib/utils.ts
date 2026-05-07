import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function prettifyJson(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return json
  }
}

export function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    POST: 'bg-green-500/10 text-green-500 border-green-500/20',
    PUT: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    PATCH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    DELETE: 'bg-red-500/10 text-red-500 border-red-500/20',
    HEAD: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    OPTIONS: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }
  return colors[method.toUpperCase()] || colors.GET
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
