/**
 * Config source: https://git.io/JfefC
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import type { CorsConfig } from '@ioc:Adonis/Core/Cors'

const corsConfig: CorsConfig = {
  origin: true,
  headers: true,
  enabled: false,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  exposeHeaders: [
    'cache-control',
    'content-language',
    'content-type',
    'expires',
    'last-modified',
    'pragma',
  ],
  credentials: true,
  maxAge: 90,
}

export default corsConfig
