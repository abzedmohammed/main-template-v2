import { TextDynamic } from 'abzed-utils';

// The one shell every auth screen renders in: heading, body, optional footer.
export default function AuthCard({ title, subtitle, children, footer }) {
    return (
        <main className="auth_card">
            <header className="fx_col_center text-center gap-2">
                <TextDynamic
                    tagName="h1"
                    text={title}
                    className="txt_1_875_bold"
                    color="var(--color-text)"
                />
                {subtitle && (
                    <TextDynamic
                        tagName="p"
                        text={subtitle}
                        className="txt_9375"
                        color="var(--color-text-muted)"
                    />
                )}
            </header>

            {children}

            {footer && <footer className="fx_center text-center">{footer}</footer>}
        </main>
    );
}
