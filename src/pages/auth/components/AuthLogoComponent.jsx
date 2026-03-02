import { Link } from 'react-router-dom';
import { logo } from '../../../utils';

export default function AuthLogoComponent({ children }) {
    return (
        <div className="h-full fx_col items-center">
            <Link to="/">
                <img src={logo} alt="Logo" />
            </Link>
            {children}
        </div>
    );
}
