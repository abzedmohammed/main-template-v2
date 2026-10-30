import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
    it('renders the title and value', () => {
        render(<StatCard title="Active users" value="1,284" />);

        expect(screen.getByText('Active users')).toBeInTheDocument();
        expect(screen.getByText('1,284')).toBeInTheDocument();
    });
});
