import '../styles/globals.css'
import { VotingProvider } from '../context/Voter'
import NavigationBar from '../components/Topbar/NavigationBar.jsx'

const MyApp = ({ Component, pageProps }) => {
  return (
    <VotingProvider>
      <div>
        <NavigationBar />
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </VotingProvider>
  )
}

export default MyApp; 


