type ImageFormat = 'avif' | 'jpeg' | 'jpg' | 'png' | 'svg' | 'webp'

interface Image {
  formats: ImageFormat[]
}

interface Organization {
  name: string
  short_name: string
  url: string
}

interface Meta {
  orgs: Organization[]
  image: Image
}

declare module '@ioc:Adonis/Core/Constants' {
  interface ConstantsConfig {
    meta: Meta
  }
}
