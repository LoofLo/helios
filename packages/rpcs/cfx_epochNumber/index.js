import {epochTag, cat, or, nul} from '@cfxjs/spec'

export const NAME = 'cfx_epochNumber'

export const schemas = {
  input: [or, [cat, epochTag], nul],
}

export const cache = {
  type: 'ttl',
  ttl: 500,
  key: ({params}) => `${NAME}-${params[0]}`,
}

export const main = async ({f, params}) => {
  return await f({params})
}
