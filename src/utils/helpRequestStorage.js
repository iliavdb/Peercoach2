const STORAGE_KEY = 'peercoach_hulpvragen'
const MATCH_REQUESTS_STORAGE_KEY = 'peercoach_matchverzoeken'

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

export function loadMatchRequests() {
  try {
    const raw = window.localStorage.getItem(MATCH_REQUESTS_STORAGE_KEY)
    const matchRequests = raw ? JSON.parse(raw) : []

    return Array.isArray(matchRequests) ? matchRequests : []
  } catch {
    return []
  }
}

export function saveMatchRequest(matchRequest) {
  const newMatchRequest = {
    ...matchRequest,
    status: 'pending',
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    aangemaaktOp: new Date().toISOString(),
  }

  try {
    const matchRequests = loadMatchRequests()
    window.localStorage.setItem(
      MATCH_REQUESTS_STORAGE_KEY,
      JSON.stringify([...matchRequests, newMatchRequest]),
    )
    return newMatchRequest
  } catch {
    return false
  }
}

export function updateMatchRequest(id, status) {
  if (!['approved', 'rejected'].includes(status)) return false

  const matchRequests = loadMatchRequests()
  const currentRequest = matchRequests.find(
    (matchRequest) => String(matchRequest.id) === String(id),
  )

  if (!currentRequest || (currentRequest.status ?? 'pending') !== 'pending') return false

  if (status === 'approved') {
    const helpRequest = getHelpRequest(currentRequest.helpRequestId)
    const learnerContact = helpRequest?.contactgegevens
    const coachContact = currentRequest.coachContact

    if (
      !learnerContact?.naam ||
      !learnerContact.email ||
      !coachContact?.naam ||
      !coachContact.email
    ) {
      return false
    }
  }

  try {
    const updatedRequest = {
      ...currentRequest,
      status,
      statusBijgewerktOp: new Date().toISOString(),
    }

    if (status === 'approved') {
      updatedRequest.match = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        helpRequestId: currentRequest.helpRequestId,
        aangemaaktOp: new Date().toISOString(),
      }
    } else {
      delete updatedRequest.match
    }

    const updatedRequests = matchRequests.map((matchRequest) =>
      String(matchRequest.id) === String(id)
        ? updatedRequest
        : matchRequest,
    )
    window.localStorage.setItem(MATCH_REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests))
    return updatedRequest
  } catch {
    return false
  }
}

function saveList(requests) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
    return true
  } catch {
    return false
  }
}
