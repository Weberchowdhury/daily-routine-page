import Link from "next/link";

const features = [
  {
    icon: "📖",
    title: "New Lesson",
    description:
      "Record the new Qur'an portion you are memorising today.",
  },
  {
    icon: "🔄",
    title: "Previous Revision",
    description:
      "Keep your previously memorised pages strong through regular revision.",
  },
  {
    icon: "🧠",
    title: "Hifz Revision",
    description:
      "Review completed portions of your Qur'an memorisation.",
  },
  {
    icon: "📿",
    title: "Daily Tilawah",
    description:
      "Track your daily Qur'an recitation and build consistency.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#120d11] text-[#f8e9ef]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-rose-900/20 blur-3xl" />

        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-fuchsia-900/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-rose-950/20 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-[#3b2932] bg-[#120d11]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#fff1f5]"
          >
            Hifz<span className="text-rose-400">Journey</span>
          </Link>

          <Link
            href="/hifz"
            className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-400"
          >
            Open Hifz Tracker
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-rose-400">
            Qur'an Memorisation
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#fff1f5] sm:text-6xl">
            Build your Hifz journey,
            <span className="block text-rose-400">
              one day at a time.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#bfa9b4] sm:text-lg">
            A simple personal space to record your Sabak,
            revision, Tilawah, Nazera reading, and daily
            Qur'an progress.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/hifz"
              className="rounded-xl bg-rose-500 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400"
            >
              Start Today's Hifz
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-[#4a303c] bg-[#21151c] px-6 py-3.5 text-center text-sm font-semibold text-[#d9c3cc] transition hover:border-rose-400/50 hover:bg-[#2a1b24]"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Decorative Ayah Symbol */}
        <div className="absolute right-10 top-20 hidden select-none text-[180px] text-rose-200/[0.025] lg:block">
          ۝
        </div>
      </section>

      {/* Daily Message */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="rounded-3xl border border-[#4a303c] bg-[#21151c]/80 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
              Today's Reminder
            </p>

            <blockquote className="mt-4 text-xl font-semibold leading-8 text-[#f3e3e9] sm:text-2xl">
              "The Qur'an is memorised through consistency,
              patience, revision, and returning to it every day."
            </blockquote>

            <p className="mt-4 text-sm leading-6 text-[#927c86]">
              You do not need a perfect day. You only need to
              keep returning to the Qur'an.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-20 sm:py-24"
      >
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-400">
            Your Daily System
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#fff1f5]">
            Everything you need for your Hifz routine
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#927c86]">
            Keep your daily memorisation and revision organised
            in one simple place.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[#3f2c35] bg-[#1d141a] p-6 transition duration-300 hover:-translate-y-1 hover:border-rose-400/30 hover:bg-[#23171e]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-2xl ring-1 ring-rose-400/10">
                {feature.icon}
              </div>

              <h3 className="mt-5 font-bold text-[#f2e3e8]">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8f7a84]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-[#281720] to-[#1a1117] p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-4xl">📖</p>

            <h2 className="mt-5 text-3xl font-bold text-[#fff1f5]">
              Ready for today's Hifz?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#9b858f]">
              Open your tracker and record what you accomplish
              today.
            </p>

            <Link
              href="/hifz"
              className="mt-7 inline-flex rounded-xl bg-rose-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-rose-400"
            >
              Open Hifz Tracker →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#34232c] py-8 text-center">
        <p className="text-xs text-[#75636c]">
          Hifz Journey • Memorise. Revise. Recite. Repeat.
        </p>
      </footer>
    </main>
  );
}