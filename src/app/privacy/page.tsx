export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white border-4 border-black p-8 md:p-12 neo-box my-10">
      <header className="border-b-4 border-black pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
        <p className="text-xl font-medium text-muted-foreground">Last updated: April 2026</p>
      </header>
      
      <div className="space-y-6 text-lg font-medium">
        <section>
          <h2 className="text-2xl font-black mb-4">1. Information We Collect</h2>
          <p>
            When you use DreamSync, we collect information you provide directly to us including your name, email address (via Firebase Auth), and the resumes (PDFs) you upload for ATS checking. Resumes are temporarily streamed to OpenAI for analysis and are not permanently stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information exclusively to provide our services, such as generating career roadmaps, checking your ATS scores, and securing your account. We never sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">3. Data Security</h2>
          <p>
            Your authentication and account data are securely managed by Firebase and Supabase. While no service is completely secure, we implement standard industry practices to protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our Team page.
          </p>
        </section>
      </div>
    </div>
  );
}
