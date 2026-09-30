// Script to update remaining translations in LandingPage.jsx
// This file contains the remaining sections that need to be updated

// About Section
const aboutSection = `
      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="section-header">
            <h2>{t('aboutTitle')}</h2>
            <p>{t('aboutSubtitle')}</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <div className="about-item">
                <h3>{t('ourMission')}</h3>
                <p>
                  {t('missionText')}
                </p>
              </div>
              <div className="about-item">
                <h3>{t('ourVision')}</h3>
                <p>
                  {t('visionText')}
                </p>
              </div>
              <div className="about-item">
                <h3>{t('ourValues')}</h3>
                <ul className="values-list">
                  <li><FaHeartbeat className="value-icon" /> {t('patientCenteredCare')}</li>
                  <li><FaShieldAlt className="value-icon" /> {t('trustTransparency')}</li>
                  <li><FaUserMd className="value-icon" /> {t('clinicalExcellence')}</li>
                  <li><FaUsers className="value-icon" /> {t('collaborativeApproach')}</li>
                </ul>
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">{t('healthcareProviders')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">{t('patientsServed')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">{t('medicalSpecialties')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">{t('emergencyCare')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
`;

// CTA Section
const ctaSection = `
      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>{t('ctaTitle')}</h2>
            <p>{t('ctaSubtitle')}</p>
            <div className="cta-buttons">
              <Link to="/patient/register" className="btn-primary">
                {t('getStarted')}
              </Link>
              <Link to="/researcher/register" className="btn-secondary">
                {t('applyResearch')}
              </Link>
            </div>
          </div>
        </div>
      </section>
`;

// Contact Section
const contactSection = `
      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-container">
          <div className="section-header">
            <h2>{t('contactTitle')}</h2>
            <p>{t('contactSubtitle')}</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>{t('ourLocation')}</h4>
                  <p>123 Healthcare Street<br />Medical District, HD 12345</p>
                </div>
              </div>

              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <h4>{t('callUs')}</h4>
                  <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>{t('emailUs')}</h4>
                  <p>contact@hms.com<br />support@hms.com</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder={t('yourName')}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder={t('yourEmail')}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    rows="5"
                    placeholder={t('yourMessage')}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  {t('sendMessage')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
`;

export { aboutSection, ctaSection, contactSection };
