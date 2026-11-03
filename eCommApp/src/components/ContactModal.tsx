import { FormEvent, useState } from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName('');
        setEmail('');
        setMessage('');
        setShowConfirmation(true);
    };

    const handleContinue = () => {
        setShowConfirmation(false);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="close-button" aria-label="Close contact form">
                    ×
                </button>
                {showConfirmation ? (
                    <div className="contact-confirmation">
                        <p>Thank you for your message</p>
                        <button onClick={handleContinue}>Continue</button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Contact Us</h2>
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />

                        <label htmlFor="contact-email">Email Address</label>
                        <input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />

                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            required
                        />

                        <button type="submit">Send</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactModal;
