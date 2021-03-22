import spec from './src/spec.js'

import {
  randomHexAddress,
  randomPrivateKey,
  validatePrivateKey,
} from '@cfxjs/account'
import {validateMnemonic, generateMnemonic} from 'bip39'
import {validateBase32Address, randomBase32Address} from '@cfxjs/base32-address'

export const {
  hexAddress,
  hexAccountAddress,
  hexContractAddress,
  mnemonic,
} = spec.defRestSchemas({
  validatePrivateKey,
  randomHexAddress,
  randomPrivateKey,
  validateMnemonic,
  generateMnemonic,
})

export const defBase32AddressSchema = (...args) => {
  return spec.defBase32AddressSchema(
    validateBase32Address,
    randomBase32Address,
    ...args,
  )
}

export const defRestSchemas = spec.defRestSchemas
export const anyp = spec.anyp
export const some = spec.some
export const number = spec.number
export const integer = spec.integer
export const intp = spec.intp
export const posInt = spec.posInt
export const negInt = spec.negInt
export const natInt = spec.natInt
export const pos = spec.pos
export const neg = spec.neg
export const float = spec.float
export const doublep = spec.doublep
export const booleanp = spec.booleanp
export const stringp = spec.stringp
export const ident = spec.ident
export const simpleIdent = spec.simpleIdent
export const qualifiedIdent = spec.qualifiedIdent
export const keywordp = spec.keywordp
export const symbolp = spec.symbolp
export const uuidp = spec.uuidp
export const uri = spec.uri
export const inst = spec.inst
export const seqable = spec.seqable
export const indexed = spec.indexed
export const mapp = spec.mapp
export const objp = spec.objp
export const vectorp = spec.vectorp
export const list = spec.list
export const seq = spec.seq
export const char = spec.char
export const setp = spec.setp
export const nil = spec.nil
export const falsep = spec.falsep
export const truep = spec.truep
export const zero = spec.zero
export const coll = spec.coll
export const empty = spec.empty
export const associative = spec.associative
export const sequentialp = spec.sequentialp
export const regexp = spec.regexp
export const gt = spec.gt
export const gte = spec.gte
export const lt = spec.lt
export const lte = spec.lte
export const eq = spec.eq
export const neq = spec.neq
export const any = spec.any
export const string = spec.string
export const int = spec.int
export const double = spec.double
export const boolean = spec.boolean
export const keyword = spec.keyword
export const symbol = spec.symbol
export const uuid = spec.uuid
export const qualifiedSymbol = spec.qualifiedSymbol
export const qualifiedKeyword = spec.qualifiedKeyword
export const oneOrMore = spec.oneOrMore
export const plus = spec.plus
export const zeroOrMore = spec.zeroOrMore
export const asterisk = spec.asterisk
export const zeroOrOne = spec.zeroOrOne
export const questionMark = spec.questionMark
export const repeat = spec.repeat
export const cat = spec.cat
export const alt = spec.alt
export const catn = spec.catn
export const altn = spec.altn
export const and = spec.and
export const or = spec.or
export const orn = spec.orn
export const not = spec.not
export const map = spec.map
export const closed = spec.closed
export const optional = spec.optional
export const obj = spec.obj
export const vector = spec.vector
export const arr = spec.arr
export const sequential = spec.sequential
export const set = spec.set
// export const enum = spec.enum
export const maybe = spec.maybe
export const tuple = spec.tuple
export const multi = spec.multi
export const re = spec.re
export const fn = spec.fn
export const ref = spec.ref
// export const function = spec.function
export const schema = spec.schema
export const mapOf = spec.mapOf
export const objOf = spec.objOf
export const f = spec.f
export const raw = spec.raw - schema
export const validate = spec.validate
export const explain = spec.explain
export const k = spec.k
export const password = spec.password
