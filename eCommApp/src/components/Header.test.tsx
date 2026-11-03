import { render, screen } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
    it('opens the contact modal from the header menu', async () => {
        const user = userEvent.setup();
        render(<Header />);

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    });

    it('shows confirmation and clears fields after submitting the contact form', async () => {
        const user = userEvent.setup();
        render(<Header />);

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email Address');
        const messageInput = screen.getByLabelText('Message');

        await user.type(nameInput, 'Jane Doe');
        await user.type(emailInput, 'jane@example.com');
        await user.type(messageInput, 'Need help with an order.');
        await user.click(screen.getByRole('button', { name: 'Send' }));

        expect(screen.getByText('Thank you for your message')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(screen.getByLabelText('Email Address')).toHaveValue('');
        expect(screen.getByLabelText('Message')).toHaveValue('');
    });
});
