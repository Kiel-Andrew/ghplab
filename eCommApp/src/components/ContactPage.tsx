import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName('');
        setEmail('');
        setIssue('');
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="coming-soon">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 320 }}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Your Issue"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            rows={5}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
