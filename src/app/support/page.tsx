
export default function SupportPage() {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '800px' }}>
            <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                How can we help you?
            </h1>

            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { q: "How do I check my renewal status?", a: "You can track your status using your Application Reference Number in the Status page." },
                        { q: "What documents are required for new license?", a: "Citizenship card, medical report, and a passport-sized photo are mandatory." },
                        { q: "Can I pay via eSewa?", a: "Yes, we support eSewa, Khalti, and ConnectIPS for all payments." },
                        { q: "How long does it take to get the smart card?", a: "Usually it takes 7-14 days after approval. You will be notified via SMS." }
                    ].map((faq, i) => (
                        <div key={i} style={{ padding: '24px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>{faq.q}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                background: '#F5F5F7',
                padding: '40px',
                borderRadius: '24px'
            }}>
                <h2 style={{ fontSize: '21px', fontWeight: 600, marginBottom: '8px' }}>Still have questions?</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Our support team is available Sunday to Friday, 10am - 5pm.</p>
                <a href="tel:1111" style={{ color: 'var(--color-primary)', fontSize: '19px', fontWeight: 600 }}>Call 1111</a>
            </div>
        </div>
    );
}
