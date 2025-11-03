import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-card">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-updated">Last updated: November 3, 2025</p>

          <section className="privacy-section">
            <div>
              <h2>1. Introduction</h2>
              <p>
                [Your Company Name] (“we”, “our”, “us”) respects your privacy
                and is committed to protecting your personal data. This Privacy
                Policy explains how we collect, use, disclose, and protect your
                personal data when you use our website or services.
              </p>
            </div>

            <div>
              <h2>2. Data Controller</h2>
              <p>
                The data controller responsible for your personal data is:
                <br />
                <strong>[Your Company Name]</strong> <br />
                [Company Address] <br />
                [Email Address] <br />
                Data Protection Officer (DPO): [Contact Email or Name]
              </p>
            </div>

            <div>
              <h2>3. What Personal Data We Collect</h2>
              <ul>
                <li>Contact data – name, email, phone number</li>
                <li>Technical data – IP address, browser type, OS</li>
                <li>Usage data – pages visited, actions taken</li>
                <li>Cookies and tracking data – analytics and preferences</li>
              </ul>
            </div>

            <div>
              <h2>4. How We Use Your Personal Data</h2>
              <ul>
                <li>To provide and improve our services</li>
                <li>To personalize your experience</li>
                <li>To comply with legal obligations</li>
                <li>
                  For analytics and performance monitoring (only with consent)
                </li>
                <li>To respond to user requests or inquiries</li>
              </ul>
            </div>

            <div>
              <h2>5. Legal Basis for Processing</h2>
              <ul>
                <li>Consent (Art. 6(1)(a))</li>
                <li>Contractual necessity (Art. 6(1)(b))</li>
                <li>Legal obligation (Art. 6(1)(c))</li>
                <li>Legitimate interests (Art. 6(1)(f))</li>
              </ul>
            </div>

            <div>
              <h2>6. Data Retention</h2>
              <p>
                We retain personal data only as long as necessary to fulfill the
                purposes stated above or as required by law.
              </p>
            </div>

            <div>
              <h2>7. Data Sharing and Transfers</h2>
              <p>
                We do not sell your personal data. We may share data with
                trusted service providers (e.g., hosting, analytics) under
                GDPR-compliant agreements. If data is transferred outside the
                EEA, we ensure appropriate safeguards (such as Standard
                Contractual Clauses).
              </p>
            </div>

            <div>
              <h2>8. Your Rights Under GDPR</h2>
              <ul>
                <li>Access to your personal data</li>
                <li>Rectification or erasure (“right to be forgotten”)</li>
                <li>Restriction or objection to processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent at any time</li>
              </ul>
              <p>
                You can exercise these rights by contacting us at{" "}
                <a href="mailto:privacy@[yourcompany].com">
                  privacy@[yourcompany].com
                </a>
                .
              </p>
            </div>

            <div>
              <h2>9. Cookies</h2>
              <p>
                We use cookies for functional, analytical, and marketing
                purposes. You can manage your preferences or withdraw consent at
                any time via our cookie banner or browser settings. For more
                details, see our{" "}
                <a href="/cookie-policy">Cookie Policy</a>.
              </p>
            </div>

            <div>
              <h2>10. Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal data from loss, misuse, or unauthorized
                access.
              </p>
            </div>

            <div>
              <h2>11. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. The latest
                version will always be available at this URL. Changes will take
                effect upon posting.
              </p>
            </div>

            <div>
              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or your data
                rights, please contact our Data Protection Officer:
                <br />
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@[yourcompany].com">
                  privacy@[yourcompany].com
                </a>
                <br />
                <strong>Address:</strong> [Company Address]
              </p>
            </div>
          </section>
        </div>

        <footer className="privacy-footer">
          © {new Date().getFullYear()} [Your Company Name]. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
