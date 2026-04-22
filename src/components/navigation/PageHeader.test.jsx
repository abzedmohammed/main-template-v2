import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
    it('renders the header and body text', () => {
        render(<PageHeader header="Dashboard" body="Overview of your metrics" />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Overview of your metrics')).toBeInTheDocument();
    });

    it('hides the action button by default', () => {
        render(<PageHeader header="Dashboard" body="Body" btnText="Save" />);

        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('calls btnFn when the action button is clicked', async () => {
        const btnFn = vi.fn();

        render(
            <PageHeader
                header="Profile"
                body="Edit your info"
                btnText="Save"
                btnFn={btnFn}
                showBtn
            />
        );

        await userEvent.click(screen.getByRole('button', { name: 'Save' }));

        expect(btnFn).toHaveBeenCalledTimes(1);
    });

    it('calls iconClick when the header icon button is pressed', async () => {
        const iconClick = vi.fn();

        render(
            <PageHeader
                header="Events"
                body="List"
                showIcon
                icon={<span data-testid="back-icon">◀</span>}
                iconClick={iconClick}
            />
        );

        await userEvent.click(screen.getByTestId('back-icon'));

        expect(iconClick).toHaveBeenCalledTimes(1);
    });
});
