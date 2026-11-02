import { TextDynamic } from 'abzed-utils';
import { Link } from 'react-router-dom';

// "Prompt? Link" line used under every auth form (e.g. "Don't have an account? Sign up").
export default function AuthLink({ prompt, text, to }) {
    return (
        <TextDynamic
            tagName="p"
            className="txt_875"
            color="var(--color-text-muted)"
            text={
                <>
                    {prompt && `${prompt} `}
                    <Link to={to} className="auth_link">
                        {text}
                    </Link>
                </>
            }
        />
    );
}
