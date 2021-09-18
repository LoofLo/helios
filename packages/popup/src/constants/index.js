export * as RPC_METHODS from './rpcMethods'

const LANGUAGES = ['en', 'zh-CN']
const PASSWORD_REG_EXP = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{8,16}$/
export {LANGUAGES, PASSWORD_REG_EXP}

export const NETWORK_TYPE = {
  CFX: 'cfx',
  ETH: 'eth',
}
