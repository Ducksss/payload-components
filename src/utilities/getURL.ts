import canUseDOM from './canUseDOM'

export const normalizeServerURL = (url: string | undefined | null): string | undefined => {
  const trimmedURL = url?.trim()

  if (!trimmedURL) return undefined

  const urlWithProtocol = /^https?:\/\//i.test(trimmedURL) ? trimmedURL : `https://${trimmedURL}`

  try {
    return new URL(urlWithProtocol).origin
  } catch {
    return undefined
  }
}

export const getServerSideURL = () => {
  return (
    normalizeServerURL(process.env.NEXT_PUBLIC_SERVER_URL) ||
    normalizeServerURL(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    'http://localhost:3000'
  )
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return (
    normalizeServerURL(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeServerURL(process.env.NEXT_PUBLIC_SERVER_URL) ||
    getServerSideURL()
  )
}
