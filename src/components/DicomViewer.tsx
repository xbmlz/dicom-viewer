import { Component, createSignal, onMount } from 'solid-js'
import cornerstone, {
  Image,
  ImageLoader,
  ImageLoaderOptions,
} from 'cornerstone-core'
import { getExampleImage } from '../utils/example'


const DicomViewer: Component = () => {
  let imageElement: HTMLDivElement

  const [wwc, setWwc] = createSignal('')

  const [renderTime, setRenderTime] = createSignal('')

  onMount(() => {
    const imageIds: string[] = ['example://1']

    const options: ImageLoaderOptions = {
      renderer: 'webgl',
      desynchronized: true,
      preserveDrawingBuffer: true,
    }

    cornerstone.registerImageLoader('example', getExampleImage as ImageLoader)
    cornerstone.enable(imageElement, options)

    imageIds.forEach((imageId) => {
      cornerstone.loadAndCacheImage(imageId).then((image: Image) => {
        cornerstone.displayImage(imageElement, image)
      })
    })

    // listener
    imageElement.addEventListener('cornerstoneimagerendered', (e) => {
      // @ts-ignore
      const detail = e.detail
      cornerstone.setToPixelCoordinateSystem(
        detail.enabledElement,
        detail.canvasContext
      )
      setWwc(
        detail.viewport.voi.windowWidth + '/' + detail.viewport.voi.windowCenter
      )
      setRenderTime(detail.renderTimeInMs + 'ms')
    })

    // mousedown
    imageElement.addEventListener('mousedown', (e) => {
      let lastX = e.pageX
      let lastY = e.pageY
      // mouse move handler
      const mouseMoveHandler = (e: MouseEvent) => {
        const deltaX = e.pageX - lastX
        const deltaY = e.pageY - lastY
        lastX = e.pageX
        lastY = e.pageY
        let viewport = cornerstone.getViewport(imageElement)
        if (!viewport) return
        viewport.voi.windowWidth += deltaX / viewport.scale
        viewport.voi.windowCenter += deltaY / viewport.scale
        cornerstone.setViewport(imageElement, viewport)
      }
      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }
      // mouse move
      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    })
  })

  return (
    <div style="width:512px; height:512px">
      <div
        class="w-full h-full"
        // @ts-ignore
        ref={imageElement}
        onContextMenu={() => false}
        onMouseDown={() => false}
      ></div>
      <div>WW/WC: {wwc()}</div>
      <div>
        Render Time: {renderTime()}
      </div>
    </div>
  )
}

export default DicomViewer
