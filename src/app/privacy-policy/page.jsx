// File: app/privacy-policy/page.jsx

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
const PAGE_PATH = "/privacy-policy";
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;
const BRAND = "YourBrand";

export const metadata = {
  title: `${BRAND} | Privacy Policy`,
  //   description: `${BRAND} respects your privacy. Learn how we collect, use, and protect your personal data, cookies, and analytics settings.`,
  alternates: { canonical: CANONICAL },
  //   robots: { index: true, follow: true },
  openGraph: { title: `${BRAND} | Privacy Policy`, url: CANONICAL },
  twitter: { card: "summary", title: `${BRAND} | Privacy Policy` },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 31, 2025";

  return (
    <main className="container-box section-spacing">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        <h1 className="poetsen text-4xl md:text-5xl text-gradient mt-2">
          Privacy Policy
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your privacy matters. This page explains what we collect, why we
          collect it, and how you can control your information.
        </p>
      </header>

      <div className="prose max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            This Privacy Policy describes how {BRAND} ("we", "us", or "our")
            collects, uses, and protects personal information when you visit{" "}
            <a href={SITE_URL} className="underline">
              {SITE_URL}
            </a>{" "}
            and use our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <ul className="list-disc pl-6">
            <li>Account Data: name, email, and profile details.</li>
            <li>Usage Data: pages viewed, features used, clicks.</li>
            <li>Device Data: IP address, device type, browser.</li>
            <li>
              Transactional Data: subscription status, payment confirmations.
            </li>
            <li>User-Generated Content: inputs, files, feedback.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">3. How We Use Information</h2>
          <ul className="list-disc pl-6">
            <li>Operate and improve services.</li>
            <li>Personalize content and features.</li>
            <li>Process payments and subscriptions.</li>
            <li>Communicate updates and support messages.</li>
            <li>Ensure security and prevent fraud.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">4. Cookies & Tracking</h2>
          <p>
            We use essential cookies to run our site and optional analytics
            cookies to improve performance. You can manage preferences in your
            browser settings.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">5. Your Rights</h2>
          <p>
            You may access, correct, delete, or request a copy of your data.
            Contact us at{" "}
            <a href="mailto:privacy@yourdomain.com" className="underline">
              privacy@yourdomain.com
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">6. Security</h2>
          <p>
            We use industry-standard encryption and security practices. No
            method is 100% secure, but we work hard to protect your information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold">7. Changes</h2>
          <p>
            We may update this Privacy Policy periodically. Any material changes
            will be posted here with a new update date.
          </p>
        </section>

        <section className="mb-2">
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p>
            Questions or requests? Email{" "}
            <a href="mailto:privacy@yourdomain.com" className="underline">
              privacy@yourdomain.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 text-center">
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Contact Support →
        </a>
      </div>
    </main>
  );
}
