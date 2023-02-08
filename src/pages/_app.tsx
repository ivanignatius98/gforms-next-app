import "../styles/globals.css"
import { wrapper } from '../store/store'
import type { AppProps } from 'next/app'

const WrappedApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default wrapper.withRedux(WrappedApp)