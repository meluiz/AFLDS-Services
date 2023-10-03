import { ConstantsConfig } from '@ioc:Adonis/Core/Constants'

const constants: ConstantsConfig = {
  meta: {
    orgs: [
      {
        name: 'Frontline News',
        url: 'https://frontline.news',
        short_name: 'flnews',
      },
      {
        name: 'AFLDS',
        short_name: 'aflds',
        url: 'https://frontline.news',
      },
    ],
    image: {
      formats: ['png', 'jpg', 'webp'],
    },
  },
}

export default constants
