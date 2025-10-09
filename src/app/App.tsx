import Layout from '@/app/layouts'
import { Routes } from '@/app/ui/Routes'
import Theme from '@/shared/ui/template/Theme'
import { BrowserRouter } from 'react-router-dom'
// import { useAlerts } from '@/features/Alert'
import './styles/safelistcss'

function App() {
    // useAlerts()

    return (
        <Theme>
            <BrowserRouter>
                <Layout>
                    <Routes />
                </Layout>
            </BrowserRouter>
        </Theme>
    )
}

export default App
