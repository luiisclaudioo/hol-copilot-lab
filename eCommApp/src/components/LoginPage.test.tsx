import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage';

const renderLoginPage = () =>
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<p>Admin destination</p>} />
            </Routes>
        </MemoryRouter>
    );

describe('LoginPage', () => {
    it('shows an error for invalid credentials', () => {
        renderLoginPage();

        fireEvent.change(screen.getByPlaceholderText('Username'), {
            target: { value: 'user' }
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'wrong' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to the admin page for valid credentials', () => {
        renderLoginPage();

        fireEvent.change(screen.getByPlaceholderText('Username'), {
            target: { value: 'admin' }
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'admin' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Admin destination')).toBeInTheDocument();
    });
});
