interface MetaImage {
  formats: string[]
}

interface Meta {
  orgs: string[]
  image: MetaImage
}

declare module '@ioc:Adonis/Core/Constants' {
  interface ConstantsConfig {
    meta: Meta
  }
}
