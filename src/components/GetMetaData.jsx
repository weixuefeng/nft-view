import axios from 'axios'

export async function getMetaData(input) {
  const url = input
  try {
    const result = await axios.get(url)
    return result.data
  } catch (e) {
    console.log('error:', e)
    return ''
  }
}
