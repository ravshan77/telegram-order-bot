import Logo from '@/shared/ui/template/Logo'
import appConfig from '@/app/config/app.config'
import { Link } from 'react-router-dom'

const HeaderLogo = () => {
    return (
        <Link to={appConfig.authenticatedEntryPath}>
            <Logo className="hidden lg:block" size={50}/>
        </Link>
    )
}

export default HeaderLogo
