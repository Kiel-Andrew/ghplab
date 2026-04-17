import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName('');
        setEmail('');
        setIssue('');
        setIsSubmitted(true);
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="coming-soon">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 320 }}>
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            placeholder="Your Name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsSubmitted(false);
                            }}
                            required
                        />
                        <label htmlFor="contact-email">Email Address</label>
                        <input
                            id="contact-email"
                            type="email"
                            placeholder="Your Email Address"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsSubmitted(false);
                            }}
                            required
                        />
                        <label htmlFor="contact-issue">Issue</label>
                        <textarea
                            id="contact-issue"
                            placeholder="Your Issue"
                            value={issue}
                            onChange={(e) => {
                                setIssue(e.target.value);
                                setIsSubmitted(false);
                            }}
                            rows={5}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                    {isSubmitted && <p role="status" aria-live="polite">Thanks for reaching out. We received your issue.</p>}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
