export default function ContactPage() {
  return (
    <main className="relative w-full flex flex-col pt-32 px-6 lg:px-24 items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-10 rounded-2xl flex flex-col items-center max-w-2xl text-center">
        <h2 className="font-display font-bold text-4xl text-white mb-4">INITIATE // CONTACT</h2>
        <p className="font-sans text-ash text-sm mb-8 leading-relaxed">
          Open to connecting on agentic swarms, data science architectures, and neural systems optimization. 
        </p>
        <div className="flex flex-col gap-6 items-center">
          <a href="mailto:mourya.birru@gmail.com" className="bg-gradient-to-br from-[#A18AFF] to-[#8d7fff] text-obsidian px-8 py-3 rounded-md font-mono text-xs uppercase tracking-widest font-bold hover-lift">
            Transmit Signal
          </a>
          <span className="font-mono text-[10px] text-teal tracking-[0.2em] opacity-60">
            SECURE_CHANNEL: mourya.birru@gmail.com
          </span>
        </div>
      </div>
    </main>
  );
}
