"use client";

export default function ContactClient() {
  return (
    <div className="bg-white/5 p-8 md:p-10 rounded-3xl border border-cream/10">
      <h2 className="font-serif text-2xl mb-6">Envoyez-nous un message</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstname" className="text-sm font-medium tracking-wide text-cream/70">
              Prénom
            </label>
            <input
              type="text" id="firstname" name="firstname" autoComplete="given-name"
              className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30"
              placeholder="Votre prénom"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastname" className="text-sm font-medium tracking-wide text-cream/70">
              Nom
            </label>
            <input
              type="text" id="lastname" name="lastname" autoComplete="family-name"
              className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30"
              placeholder="Votre nom"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium tracking-wide text-cream/70">
            Email
          </label>
          <input
            type="email" id="email" name="email" autoComplete="email"
            className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30"
            placeholder="exemple@email.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium tracking-wide text-cream/70">
            Message
          </label>
          <textarea
            id="message" name="message" rows={4}
            className="w-full bg-sage/50 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-cream focus:ring-1 focus:ring-cream transition-all placeholder-cream/30"
            placeholder="Comment pouvons-nous vous aider ?"
          />
        </div>
        <button
          type="button"
          className="w-full bg-cream text-sage font-bold py-4 rounded-full hover:bg-white transition-all transform hover:scale-[1.02]"
        >
          Envoyer le message
        </button>
      </div>
    </div>
  );
}