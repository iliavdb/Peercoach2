const STORAGE_KEY = 'peercoach_hulpvragen'

export function loadHelpRequests() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const requests = raw ? JSON.parse(raw) : []

    return Array.isArray(requests) ? requests : []
  } catch {
    return []
  }
}

export function getHelpRequest(id) {
  return loadHelpRequests().find((request) => String(request.id) === String(id))
}

export function saveHelpRequest(request) {
  const newRequest = {
    ...request,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: 'open',
    aangemaaktOp: new Date().toISOString(),
  }

  return saveList([...loadHelpRequests(), newRequest])
}

export function updateHelpRequest(id, changes) {
  const requests = loadHelpRequests()
  const exists = requests.some((request) => String(request.id) === String(id))

  if (!exists) return false

  return saveList(
    requests.map((request) =>
      String(request.id) === String(id) ? { ...request, ...changes } : request,
    ),
  )
}

export function deleteHelpRequest(id) {
  const requests = loadHelpRequests()
  const remaining = requests.filter((request) => String(request.id) !== String(id))

  if (remaining.length === requests.length) return false

  return saveList(remaining)
}

function saveList(requests) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
    return true
  } catch {
    return false
  }
}
