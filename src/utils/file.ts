export function readFile(fileHandle: Function = () => {}): Promise<string | null | undefined | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      const size = `(${Math.floor(event.total / 1000)} KB)`
      const progress = `${Math.floor((event.loaded / event.total) * 100)} %`
      console.log(`Loading size: ${size} progress: ${progress}`)
    }
    reader.onload = (event) => {
      resolve(event.target?.result)
    }
    reader.onerror = (err) => {
      reject(err)
    }
    fileHandle(reader)
  })
}

export function selectFile(
  accepts: Array<string> = ['.xml', '.bpmn'],
  multiple: boolean = false
): Promise<FileList | null> {
  if (!document || !(document instanceof Document)) {
    throw new Error('This is not a browser environment')
  }
  const inputElem = document.createElement('input')
  inputElem.setAttribute('type', 'file')
  inputElem.setAttribute('visibility', 'hidden')
  if (Array.isArray(accepts) && accepts.length > 0) {
    inputElem.setAttribute('accept', accepts.join(','))
  }
  if (multiple) {
    inputElem.setAttribute('multiple', `${multiple}`)
  }
  inputElem.click()
  return new Promise((resolve, reject) => {
    inputElem.addEventListener('change', () => {
      if (inputElem.files && inputElem.files.length == 0) {
        reject()
      }
      resolve(inputElem.files)
    })
  })
}

export async function downloadFile(fileName: string, mimeType: string, content: string, charset: string = 'utf-8') {
  if (!document || !(document instanceof Document)) {
    throw new Error('This is not a browser environment')
  }
  const blob = new Blob([content], {
    type: `${mimeType};charset=${charset}`,
  })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = `${fileName}`
  link.click()
  window.URL.revokeObjectURL(link.href)
}

export async function readFileToBlob(file: File, mimeType: string, charset: string = 'utf-8'): Promise<Blob> {
  const content = await readFile((reader: FileReader) => reader.readAsText(file))
  return new Blob([content ?? ''], {
    type: `${mimeType};charset=${charset}`,
  })
}
