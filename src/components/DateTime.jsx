import moment from 'moment'

// timestamp using unix timestamp in milliseconds

// Convert timestamp to YYYY-MM-DD HH:MM:SS
export function DateTime(timestamp = Date.now()) {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

export function RelativeTime(timestamp = Date.now()) {
  return moment(timestamp).fromNow()
}
