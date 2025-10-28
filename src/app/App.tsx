import Layout from '@/app/layouts'
import { Routes } from '@/app/ui/Routes'
import { Toaster } from 'react-hot-toast'
import Theme from '@/shared/ui/template/Theme'
import { BrowserRouter } from 'react-router-dom'
import './styles/safelistcss'
import 'react-datepicker/dist/react-datepicker.css'
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
            <Toaster position="top-center" reverseOrder={false} />
        </Theme>
    )
}

export default App
