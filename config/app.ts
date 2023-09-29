import proxyAddr from 'proxy-addr'
import Env from '@ioc:Adonis/Core/Env'
import type { ServerConfig } from '@ioc:Adonis/Core/Server'
import type { LoggerConfig } from '@ioc:Adonis/Core/Logger'
import type { ProfilerConfig } from '@ioc:Adonis/Core/Profiler'
import type { ValidatorConfig } from '@ioc:Adonis/Core/Validator'

export const appKey: string = Env.get('APP_KEY')

export const http: ServerConfig = {
  etag: false,
  subdomainOffset: 2,
  generateRequestId: false,
  allowMethodSpoofing: false,
  jsonpCallbackName: 'callback',
  trustProxy: proxyAddr.compile('loopback'),
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: false,
    sameSite: false,
  },
  forceContentNegotiationTo: 'application/json',
}

export const logger: LoggerConfig = {
  enabled: true,
  name: Env.get('APP_NAME'),
  level: Env.get('LOG_LEVEL', 'info'),
  prettyPrint: Env.get('NODE_ENV') === 'development',
}

export const profiler: ProfilerConfig = {
  enabled: true,
  blacklist: [],
  whitelist: [],
}

export const validator: ValidatorConfig = {}
