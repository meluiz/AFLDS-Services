import Drive from '@ioc:Adonis/Core/Drive'
import MetaImage from 'App/Models/MetaImage'

import Config from '@ioc:Adonis/Core/Config'
import Logger from '@ioc:Adonis/Core/Logger'

import sharp from 'sharp'
import { Num, Str } from 'melper'

import { ConstantsConfig } from '@ioc:Adonis/Core/Constants'
import ScreenshotService from 'App/Services/ScreenshotService'

interface Image {
  type: string
  width: number
  height: number
}

interface Metadata {
  title: string
  hostname: string
  pathname: string
}

interface MetaImageOptions {
  pathname: string
  image: Image
  metadata: Metadata
}

const tempQueue: string[] = []
export default class MetaImageRepository {
  private rootPath = '/meta'
  private filename: string
  private ext: string

  /**
   * Constructor for the MetaImage class.
   *
   * @param {MetaImageOptions} options - The options object for the MetaImage.
   */
  constructor(private options: MetaImageOptions) {
    const slugifyPath = Str.slugify(this.options.pathname, { lower: true })

    this.ext = this.options.image.type
    this.filename = slugifyPath || 'home'

    this.options.metadata.hostname = this.options.metadata.hostname.replace(/^\/\//, '')
    this.options.metadata.pathname = this.options.metadata.pathname.replace(/^\//, '')
  }

  /**
   * Downloads an image from Drive.
   *
   * @return {Promise<any>} The downloaded image from Drive.
   */
  private async downloadImageFromDrive() {
    return await Drive.get(`${this.rootPath}/${this.filename}.${this.ext}`)
  }

  /**
   * Saves the metadata image.
   *
   * @param {void}
   * @return {Promise<void>}
   */
  private async saveMetaImage() {
    const { title, hostname, pathname } = this.options.metadata
    const metaImage = await this.fetchImageMeta()

    if (!metaImage) {
      const newMetaImage = await MetaImage.create({
        path: this.options.pathname,
        image: this.filename,
        revalidate: Date.now() + Num.toMs('7d'),
        metadata: {
          title,
          hostname,
          pathname,
        },
      })

      return await newMetaImage.save()
    }

    await MetaImage.query()
      .where('path', metaImage.path)
      .update({
        revalidate: Date.now() + Num.toMs('7d'),
        metadata: JSON.stringify({
          title,
          hostname,
          pathname,
        }),
      })
  }

  /**
   * Stores the screenshot image in multiple formats.
   *
   * @param {Buffer} image - The screenshot image to be stored.
   * @return {Promise<void>} - A promise that resolves once the screenshots are stored.
   */
  private async storeScreenshot(image: Buffer) {
    const Sharp = sharp(image)

    const config: ConstantsConfig = Config.get('constants')
    const formats = config.meta.image.formats

    Logger.info(`Storing screenshots for \`${this.options.metadata.title}\`.`)
    for (const format of formats) {
      const options = {
        quality: 90,
      }

      const buffer = await Sharp.toFormat(format, options).toBuffer()
      await Drive.put(`${this.rootPath}/${this.filename}.${format}`, buffer)
    }

    Logger.info(`Stored screenshots for \`${this.options.metadata.title}\`.`)
  }

  /**
   * Takes a screenshot of a webpage using the specified options.
   *
   * @return {Promise<string>} The captured screenshot image as a base64 string.
   */
  public async takeScreenshot() {
    const title = this.options.metadata.title
    const hostname = this.options.metadata.hostname
    const pathname = this.options.metadata.pathname

    const width = this.options.image.width
    const height = this.options.image.height

    tempQueue.push(this.options.pathname)
    const url = `${hostname}/${pathname}`

    Logger.info(`Getting screenshot for \`${this.options.metadata.title}\`.`)
    const screenshot = new ScreenshotService({ url, width, height })
    const screenshotImage = await screenshot.capture()
    const image = await screenshot.mount(screenshotImage, {
      title,
      pathname: `/${pathname}`.replace(/(.*)?\/$/, '$1'),
      hostname: hostname.replace(/(http(s)?):\/\//, ''),
    })

    this.storeScreenshot(image)
    this.saveMetaImage()

    tempQueue.splice(tempQueue.indexOf(this.options.pathname), 1)
    Logger.info(`Got screenshot for \`${this.options.metadata.title}\`.`)
    return image
  }

  /**
   * Private function that revalidates if necessary.
   *
   * @return {Promise<void>} Resolves when revalidation is complete.
   */
  private async revalidateIfNecessary(): Promise<void> {
    const imageMeta = await this.fetchImageMeta()

    if (!imageMeta) {
      throw new Error(
        `Cannot revalidate because no meta image found for \`${this.options.pathname}\`.`
      )
    }

    const time = Date.now()
    const timeDifference = imageMeta.revalidate - time

    const isInTempQueue = tempQueue.includes(this.options.pathname)

    if (timeDifference <= 0 && !isInTempQueue) {
      Logger.info(`Revalidating meta image for \`${this.options.metadata.title}\`.`)
      await this.takeScreenshot()
    }
  }

  /**
   * Fetches the meta data for an image.
   *
   * @return {Promise<MetaImage>} A Promise that resolves to the meta data of the image.
   */
  public async fetchImageMeta() {
    const path = this.options.pathname
    return await MetaImage.findBy('path', path)
  }

  /**
   * Retrieves the image from the specified source.
   *
   * @return {Promise<void>} A promise that resolves when the image is retrieved successfully.
   */
  public async getImage() {
    const imageMeta = await this.fetchImageMeta()

    if (!imageMeta) {
      return this.takeScreenshot()
    }

    this.revalidateIfNecessary()

    return await this.downloadImageFromDrive()
  }
}
