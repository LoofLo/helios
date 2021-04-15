import React from 'react'
import PropTypes from 'prop-types'
import {useRPC} from '@cfxjs/doc-use-rpc'
import {useSpec} from '@cfxjs/doc-use-spec'

const Var = 'var'

const renderParams = (rpcName, {children, ...params}, path = [0]) => {
  const {k} = params
  if (children?.length) {
    return (
      <Param
        key={k || path}
        hasChildren
        rpcName={rpcName}
        {...params}
        path={path}
      >
        {children.map((c, idx) =>
          renderParams(rpcName, {...c, parentK: k}, [...path, idx]),
        )}
      </Param>
    )
  }

  return (
    <Param
      key={k || path}
      hasChildren={false}
      rpcName={rpcName}
      path={path}
      {...params}
    />
  )
}

export const Parameters = ({parameters, rpcName}) => {
  let params = parameters
  const {schemas} = useRPC(rpcName)
  const {doc} = useSpec(rpcName, {schema: schemas?.input})
  params = doc || params

  return (
    <section className="parameters">
      <h4>Parameters</h4>
      <form id={`rpc-form-${rpcName}`}>
        <table>
          <caption>
            {`Parameters of RPC method `}
            <Var>{rpcName}</Var>
          </caption>
          <tbody>{renderParams(rpcName, params)}</tbody>
        </table>
      </form>
    </section>
  )
}

const Doc = ({doc}) => <p>{doc}</p>
const Type = ({type}) => <Var>{type}</Var>
const DataEntry = ({htmlElement, rpcName, id, ...props}) => {
  const Tag = htmlElement?.el || 'input'
  return (
    <Tag
      id={id}
      form={`rpc-form-${rpcName}`}
      type={htmlElement?.type || 'text'}
      {...props}
    />
  )
}

const Validator = ({valid, error, empty}) => {
  return <p>{empty ? '' : valid ? 'Valid!' : error}</p>
}

const obj = <Var>object</Var>

const ParamWithChildren = ({type, children, rpcName, k, kv, path}) => {
  const legendOpts = {or: 'one of', and: 'all of', map: <>{obj} with keys</>}
  const entryId = `${rpcName}-${kv && k}-entry`
  const mapKey = (
    <label htmlFor={entryId}>
      <Var>{k}</Var>
    </label>
  )

  return (
    <tr className="paramwithchildren">
      {path.length > 1 && <td>{k || path[path.length - 1]}</td>}
      <td>
        <fieldset>
          <legend>
            {kv && (
              <>
                {mapKey} {`: `} {legendOpts[type]}
              </>
            )}
            {!kv && legendOpts[type]}
          </legend>
          <table>
            {/* <caption>caption</caption> */}
            <tbody>{children}</tbody>
          </table>
        </fieldset>
      </td>
    </tr>
  )
}

const ChildParam = ({kv, parentK, value, rpcName, k, path}) => {
  const pathId = (k || parentK || '') + '-' + path.join('-')
  const entryId = `${rpcName}-${pathId}-entry`
  const name = <Var>{k || path[path.length - 1]}</Var>
  const {setData, data, valid, error} = useSpec(entryId, {
    schema: value?.schema,
  })

  return (
    <tr className="childparam">
      <td>
        {kv && <Var>{k}</Var>}
        {!kv && <Var>{path[path.length - 1]}</Var>}
      </td>
      <td>
        <fieldset>
          <legend>
            <label htmlFor={entryId}>{name}</label>
          </legend>
          <table>
            {/* <caption>caption</caption> */}
            <tbody>
              <tr key="type">
                <td>Type</td>
                <td>
                  <Type {...value} />
                </td>
              </tr>
              <tr key="doc">
                <td>Doc</td>
                <td>
                  <Doc {...value} />
                </td>
              </tr>
              <tr key="data-entry">
                <td>Entry</td>
                <td>
                  <DataEntry
                    onChange={e => setData(e.target.value)}
                    value={data === null ? '' : data}
                    rpcName={rpcName}
                    id={entryId}
                    {...value}
                  />
                </td>
              </tr>
              <tr key="validator">
                <td>Validation</td>
                <td>
                  <Validator
                    empty={data === null || data === ''}
                    valid={valid ?? true}
                    error={error ?? []}
                    {...value}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </td>
    </tr>
  )
}

const Param = ({hasChildren, ...props}) => {
  if (hasChildren) return <ParamWithChildren {...props} />
  return <ChildParam {...props} />
}

Doc.propTypes = {
  doc: PropTypes.string.isRequired,
}
Type.propTypes = {
  type: PropTypes.string.isRequired,
}
DataEntry.propTypes = {
  id: PropTypes.string.isRequired,
  rpcName: PropTypes.string.isRequired,
  htmlElement: PropTypes.shape({
    el: PropTypes.string,
    type: PropTypes.string,
  }),
}
DataEntry.defaulProps = {
  htmlElement: {
    el: 'input',
    type: 'text',
  },
}
Parameters.propTypes = {
  parameters: PropTypes.object.isRequired,
  rpcName: PropTypes.string.isRequired,
}
Param.propTypes = {
  hasChildren: PropTypes.bool.isRequired,
}
ChildParam.propTypes = {
  rpcName: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.number).isRequired,
  k: PropTypes.string,
  kv: PropTypes.bool,
  parentK: PropTypes.string,
  value: PropTypes.object.isRequired,
}
ChildParam.defaultProps = {
  k: undefined,
  kv: undefined,
  parentK: undefined,
}
ParamWithChildren.propTypes = {
  path: PropTypes.arrayOf(PropTypes.number).isRequired,
  k: PropTypes.string,
  kv: PropTypes.bool,
  rpcName: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['map', 'or', 'and']).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}
ParamWithChildren.defaultProps = {
  k: undefined,
  kv: undefined,
  parentK: undefined,
}
Validator.propTypes = {
  valid: PropTypes.bool.isRequired,
  error: PropTypes.array.isRequired,
  empty: PropTypes.bool.isRequired,
}
