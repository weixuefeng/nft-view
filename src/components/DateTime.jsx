import moment from 'moment'

// timestamp using unix timestamp in milliseconds

// Convert timestamp to YYYY-MM-DD HH:MM:SS
export function DateTime(timestamp = Date.now(), timezone = false) {
  if (timezone) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss UTCZZ').slice(0, -2)
  }
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

export function RelativeTime(timestamp = Date.now(), suffix = true) {
  if (suffix) {
    return moment(timestamp).fromNow()
  }
  return moment(timestamp).fromNow(true)
}
