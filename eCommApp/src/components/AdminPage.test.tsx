import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminPage from './AdminPage';

const renderAdminPage = () =>
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>
    );

describe('AdminPage', () => {
    it('shows no active sale initially', () => {
        renderAdminPage();

        expect(screen.getByText('Welcome to the admin portal.')).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('applies a valid sale percentage', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '25');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('shows an error for invalid input', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, 'not-a-number');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('ends an active sale and resets the input', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        await user.clear(input);
        await user.type(input, '10');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(input).toHaveValue('0');
    });

    it('updates the input value when edited', () => {
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        fireEvent.change(input, { target: { value: '15' } });

        expect(input).toHaveValue('15');
    });
});
