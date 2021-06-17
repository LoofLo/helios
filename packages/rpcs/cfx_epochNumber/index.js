import {epochTag, zeroOrOne, or, nul} from '@cfxjs/spec'

export const NAME = 'cfx_epochNumber'

export const schemas = {
  input: [or, [zeroOrOne, epochTag], nul],
}

export const permissions = {
  locked: true,
}

export const cache = {
  type: 'ttl',
  ttl: 500,
  key: ({params}) => `EPOCH${params[0]}`,
}

export const main = async ({f, params}) => {
  return await f(params)
}