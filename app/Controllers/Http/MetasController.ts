import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Config from '@ioc:Adonis/Core/Config'
import Logger from '@ioc:Adonis/Core/Logger'

import MetaImageRepository from 'App/Repositories/MetaImageRespository'

import URI from 'urijs'

export default class MetasController {
  public async index(context: HttpContextContract) {
    const { params, request, response } = context
    const { org_name: orgName, meta_image: metaName } = params

    // Get constants from the configuration file
    const constants = Config.get('constants')

    try {
      Logger.info(`Trying to find an organization with the name \`${orgName}\`.`)

      // Find the organization with the specified name
      const organization = constants.meta.orgs.find((org) => org.short_name === orgName)

      if (!organization) {
        throw new Error(`It was not possible to find an organization with the name \`${orgName}\`.`)
      }

      // Create URL object using organization URL and path
      const url = new URI({ hostname: organization.url, path: request.input('path') })

      // Set default values for image dimensions if not provided
      const { width = 1920, height = 1080 } = request.input('image', {})

      // Create options object for MetaImageService
      const options = {
        pathname: url.pathname(),
        image: {
          type: metaName.split('.')[1] || 'png',
          width: width || 1920,
          height: height || 1080,
        },
        metadata: {
          title: request.input('title') || organization.name,
          hostname: url.hostname(),
          pathname: url.pathname(),
        },
      }

      // Create instance of MetaImageService and retrieve image
      const metaImage = new MetaImageRepository(options)
      const image = await metaImage.getImage()

      Logger.info(`Got image for \`${orgName}\`.`)

      // Set response headers and send the image
      response.header('Cache-Control', 'public, max-age=31536000')
      response.header('Content-Type', `image/${options.image.type}`)
      response.status(200)

      return response.send(image)
    } catch (e) {
      return response.badRequest(e.message)
    }
  }
}
