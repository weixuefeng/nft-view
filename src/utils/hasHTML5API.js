const Version = 'beta'

function hasShare() {
  if ('share' in navigator) {
    return true
  } else {
    return false
  }
}

function hasVibrate() {
  if (navigator.vibrate) {
    return true
  } else {
    return false
  }
}

export { Version, hasShare, hasVibrate }
