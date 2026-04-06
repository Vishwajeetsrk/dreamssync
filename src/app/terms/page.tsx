export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white border-4 border-black p-8 md:p-12 neo-box my-10">
      <header className="border-b-4 border-black pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
        <p className="text-xl font-medium text-muted-foreground">Last updated: April 2026</p>
      </header>
      
      <div className="space-y-6 text-lg font-medium">
        <section>
          <h2 className="text-2xl font-black mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using DreamSync, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">2. User Accounts</h2>
          <p>
            You must create an account to access our core AI tools. You are responsible for safeguarding your password and any activities or actions under your password.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">3. Prohibited Uses</h2>
          <p>
            You agree not to use the service for any illegal purposes or to conduct any activity that would violate the rights of others or compromise the security of the application (e.g., attempting to reverse engineer API endpoints).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4">4. Limitations of AI</h2>
          <p>
            The AI-generated roadmaps, portfolio text, and ATS scores provided by DreamSync are for guidance purposes only. We make no guarantees regarding hiring outcomes or the absolute accuracy of the generative models.
          </p>
        </section>
      </div>
    </div>
  );
}
