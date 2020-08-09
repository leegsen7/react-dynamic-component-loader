import React from 'react'
import PropTypes from 'prop-types'

class AsyncComponent extends React.Component {
  static propTypes = {
    loader: PropTypes.func,
    componentProps: PropTypes.shape(),
  }
  constructor(props) {
    super(props)
    this.state = {
      SelfCompoent: null,
    }
  }
  componentDidMount() {
    this.props.loader().then(res => {
      this.setState({
        SelfCompoent: res?.default || res,
      })
    })
  }
  render() {
    const { SelfCompoent } = this.state
    if (!SelfCompoent) return null
    return <SelfCompoent {...this.props.componentProps} />
  }
}

/**
 * 异步组件加载器
 * @param loader-异步加载的模块方法
 */
export default function (loader) {
  return componentProps => (
    <AsyncComponent
      loader={loader}
      componentProps={componentProps}
    />
  )
}
