import BrowserService from './BrowserService'
import View from '@ioc:Adonis/Core/View'

interface ScreenshotConfig {
  url: string
  width?: number
  height?: number
}

export default class ScreenshotService {
  /**
   * Constructs a new instance of the class.
   *
   * @param {ScreenshotConfig} options - The configuration options for the screenshot.
   */
  constructor(private options: ScreenshotConfig) {
    this.options.url = this.options.url.replace(/^\/\//, '')
  }

  /**
   * Capture a screenshot of a webpage.
   *
   * @return {Buffer} The captured screenshot.
   */
  public async capture() {
    const browser = new BrowserService()
    const page = await browser.getPage()

    page.setViewportSize({ width: this.options.width || 1920, height: this.options.height || 1080 })

    await page.goto(this.options.url)
    await page.waitForLoadState('load')

    const screenshot: Buffer = await page.screenshot({
      type: 'png',
    })

    await page.close()
    return screenshot
  }

  /**
   * Mounts the given buffer and data to generate a screenshot.
   *
   * @param {Buffer} buffer - The buffer to be mounted.
   * @param {any} data - Additional data to be used in rendering.
   * @return {Promise<Buffer>} - A promise that resolves to the generated screenshot as a buffer.
   */
  public async mount(buffer: Buffer, data: any) {
    const htmlString = await View.render('meta/image', {
      ...data,
      image: buffer.toString('base64'),
    })

    const browser = new BrowserService()
    const page = await browser.getPage()

    await page.setContent(htmlString)
    await page.waitForLoadState('load')

    page.setViewportSize({ width: this.options.width || 1920, height: this.options.height || 1080 })

    const screenshot: Buffer = await page.screenshot({
      type: 'png',
    })

    return screenshot
  }
}
