import Layout from '@/app/layouts'
import { Routes } from '@/app/ui/Routes'
import Theme from '@/shared/ui/template/Theme'
import { BrowserRouter } from 'react-router-dom'
// import { useAlerts } from '@/features/Alert'
import './styles/safelistcss'
import { ItemMapProvider, QueryProvider } from './providers'

function App() {
    // useAlerts()

    return (
        <Theme>
            <QueryProvider>
                <BrowserRouter>
                    <Layout>
                        <ItemMapProvider>
                            <Routes />
                        </ItemMapProvider>
                    </Layout>
                </BrowserRouter>
            </QueryProvider>
        </Theme>
    )
}

export default App
