import { image108Base64, image109Base64 } from './images'

function str2ab(str: string) {
  // 2 bytes for each char
  const buf = new ArrayBuffer(str.length * 2)
  const bufView = new Uint16Array(buf)
  let index = 0
  for (let i = 0, strLen = str.length; i < strLen; i += 2) {
    const lower = str.charCodeAt(i)
    const upper = str.charCodeAt(i + 1)
    bufView[index] = lower + (upper << 8)
    index++
  }
  return bufView
}

function getPixelData(base64PixelData: string) {
  const pixelDataAsString = window.atob(base64PixelData)
  const pixelData = str2ab(pixelDataAsString)
  return pixelData
}

const image1PixelData = getPixelData(image108Base64)
const image2PixelData = getPixelData(image109Base64)

export function getExampleImage(imageId: string) {
  const width = 256
  const height = 256

  function getPixelData() {
    if (imageId === 'example://1') {
      return image1PixelData
    } else if (imageId === 'example://2') {
      return image2PixelData
    }
    throw 'unknown imageId'
  }

  const image = {
    imageId: imageId,
    minPixelValue: 0,
    maxPixelValue: 257,
    slope: 1.0,
    intercept: 0,
    windowCenter: 127,
    windowWidth: 256,
    getPixelData: getPixelData,
    rows: height,
    columns: width,
    height: height,
    width: width,
    color: false,
    columnPixelSpacing: 0.8984375,
    rowPixelSpacing: 0.8984375,
    sizeInBytes: width * height * 2,
  }

  return {
    promise: new Promise((resolve) => {
      resolve(image)
    }),
    cancelFn: undefined,
  }
}
