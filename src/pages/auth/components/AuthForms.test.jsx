import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import {
    AuthCard,
    AuthLink,
    LoginFormComponent,
    OTPFormComponent,
    PasswordChecklist,
    RegisterFormComponent,
} from '.';

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../../../routes', async () => ({
    ROUTES: (await import('../../../routes/paths')).ROUTES,
}));

function WithForm({ Component, ...props }) {
    const [form] = Form.useForm();
    return <Component form={form} {...props} />;
}

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AuthCard', () => {
    it('renders the title, subtitle, body and footer', () => {
        renderInRouter(
            <AuthCard
                title="Welcome back"
                subtitle="Log in to continue."
                footer={
                    <AuthLink prompt="New here?" text="Sign up" to="/auth/register" />
                }
            >
                <div>form body</div>
            </AuthCard>
        );

        expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(screen.getByText('Log in to continue.')).toBeInTheDocument();
        expect(screen.getByText('form body')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
            'href',
            '/auth/register'
        );
    });
});

describe('LoginFormComponent', () => {
    it('submits email and secret', async () => {
        const onFinish = vi.fn();
        renderInRouter(<WithForm Component={LoginFormComponent} onFinish={onFinish} />);

        await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'Password@123');
        await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

        await waitFor(() =>
            expect(onFinish).toHaveBeenCalledWith(
                { email: 'jane@example.com', secret: 'Password@123' },
                expect.anything()
            )
        );
    });

    it('links to forgot password and sign up', () => {
        renderInRouter(<WithForm Component={LoginFormComponent} onFinish={vi.fn()} />);

        expect(
            screen.getByRole('link', { name: 'Forgot password?' })
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
    });
});

describe('RegisterFormComponent', () => {
    it('does not submit until the terms are accepted', async () => {
        const onFinish = vi.fn();
        renderInRouter(
            <WithForm Component={RegisterFormComponent} onFinish={onFinish} />
        );

        await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

        expect(
            await screen.findByText('Please accept the Terms and Privacy Policy')
        ).toBeInTheDocument();
        expect(onFinish).not.toHaveBeenCalled();
    });
});

describe('OTPFormComponent', () => {
    const renderOtp = (props) =>
        renderInRouter(
            <WithForm
                Component={OTPFormComponent}
                title="Verify it's you"
                setOtp={vi.fn()}
                onFinish={vi.fn()}
                handleResendOtp={vi.fn()}
                maskedEmail="ja****@example.com"
                {...props}
            />
        );

    it('names the email the code was sent to', () => {
        renderOtp({ timer: 0 });

        expect(
            screen.getByText('Enter the 4-digit code we sent to ja****@example.com.')
        ).toBeInTheDocument();
    });

    it('shows the countdown as mm:ss and disables resend while it runs', () => {
        renderOtp({ timer: 300 });

        expect(screen.getByRole('button', { name: 'Resend in 05:00' })).toBeDisabled();
    });

    it('enables resend once the countdown ends', async () => {
        const handleResendOtp = vi.fn();
        renderOtp({ timer: 0, handleResendOtp });

        await userEvent.click(screen.getByRole('button', { name: 'Resend' }));

        expect(handleResendOtp).toHaveBeenCalled();
    });
});

describe('PasswordChecklist', () => {
    const rowFor = (label) => screen.getByText(label).parentElement;

    it('marks only the rules the password meets', () => {
        render(<PasswordChecklist password="abcdefgh" />);

        expect(rowFor('At least 8 characters')).toHaveClass('text-success-emerald');
        expect(rowFor('One uppercase letter')).toHaveClass('text-text-muted');
        expect(rowFor('At least one number')).toHaveClass('text-text-muted');
        expect(rowFor('One special character')).toHaveClass('text-text-muted');
    });

    it('marks every rule for a strong password', () => {
        render(<PasswordChecklist password="Password@123" />);

        for (const label of [
            'At least 8 characters',
            'One uppercase letter',
            'At least one number',
            'One special character',
        ]) {
            expect(rowFor(label)).toHaveClass('text-success-emerald');
        }
    });
});
