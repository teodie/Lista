import * as fs from 'react-native-fs'
import { formatDate_MM_DD_YYYY } from '@/utils/formatDate'

const formateFileName = (name) => {
  const backupDate = formatDate_MM_DD_YYYY(new Date())
  const fnameWitDate = `${name}_${backupDate}.lst`

  return fnameWitDate
}

const saveFileAs = async (filename, data) => {
  try {
    const file = formateFileName(filename)
    const path = `${fs.DownloadDirectoryPath}/${file}`

    console.log(path)
    await fs.writeFile(path, data, 'utf8')
    return true
  } catch (error) {
    console.log(error)
    return false
  }

}

export default saveFileAs