/**
 * 设置异步动态导入react组件模块
 * @param options = {
 *   modules-string[]-动态导入react组件
 * }
 * @returns {{visitor: {Program(*, *): void}}}
 */

const loadPath = 'react-dynamic-component-plugin/loader'

module.exports = function asyncLoader(options) {
  const { template } = options
  return {
    visitor: {
      Program(path, state) {
        const {
          modules = [],
        } = state.opts || {}
        const body = path.node.body || []
        body.forEach((item, index) => {
          if (item.type === 'ImportDeclaration' && item.source && modules.includes(item.source.value)) {
            if (item.specifiers[0].type === 'ImportDefaultSpecifier') {
              const name = item.specifiers[0].local.name
              const value = item.source.value
              const chunkName = value.replace(/\//g, '_')
              body[index] = template(`const ${name} = require('${loadPath}').default(() => {
                return require.ensure(['${value}'], require => require('${value}'), ${JSON.stringify(chunkName)})
              })`)()
            }
          }
        })
      },
    },
  }
}
