
"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "my-learning-journal";

const emptyForm = {
  topic: "",
  category: "Web Development",
  learned: "",
  confused: "",
  remember: "",
  next: "",
};

const categories = [
  "Web Development",
  "Next.js",
  "React",
  "JavaScript",
  "English",
  "Philosophy",
  "Other",
];

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Add or update entry
  function handleSubmit(event) {
    event.preventDefault();

    if (!form.topic.trim() || !form.learned.trim()) {
      alert("Please enter a topic and what you learned.");
      return;
    }

    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                ...form,
              }
            : entry
        )
      );

      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...form,
      };

      setEntries((prev) => [newEntry, ...prev]);
    }

    setForm(emptyForm);
    setShowForm(false);
  }

  // Delete entry
  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );

    if (!confirmed) return;

    setEntries((prev) =>
      prev.filter((entry) => entry.id !== id)
    );
  }

  // Edit entry
  function handleEdit(entry) {
    setForm({
      topic: entry.topic,
      category: entry.category,
      learned: entry.learned,
      confused: entry.confused,
      remember: entry.remember,
      next: entry.next,
    });

    setEditingId(entry.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Cancel editing
  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  // Search and filter
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesCategory =
        filter === "All" || entry.category === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        entry.topic.toLowerCase().includes(searchText) ||
        entry.learned.toLowerCase().includes(searchText) ||
        entry.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [entries, search, filter]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-lime-400">
                My Learning Journey
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Learning Journal
              </h1>

              <p className="mt-2 max-w-xl text-sm text-zinc-400">
                Write down what you learn, what confuses you,
                and what you want to learn next.
              </p>
            </div>

            <button
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowForm(true);
              }}
              className="rounded-xl bg-lime-400 px-5 py-3 font-bold text-zinc-950 transition hover:bg-lime-300"
            >
              + New Entry
            </button>

          </div>
        </div>
      </header>


      {/* ================= MAIN CONTENT ================= */}

      <div className="mx-auto max-w-6xl px-5 py-8">


        {/* ================= STATISTICS ================= */}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">

          <StatCard
            title="Total Entries"
            value={entries.length}
            description="Things you have recorded"
          />

          <StatCard
            title="Topics"
            value={
              new Set(
                entries.map((entry) => entry.category)
              ).size
            }
            description="Different learning areas"
          />

          <StatCard
            title="Latest Entry"
            value={
              entries.length > 0
                ? formatDate(entries[0].date)
                : "No entries"
            }
            description="Your most recent note"
          />

        </section>


        {/* ================= FORM ================= */}

        {showForm && (
          <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-lime-400">
                  {editingId ? "EDIT ENTRY" : "NEW ENTRY"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {editingId
                    ? "Update your learning"
                    : "What did you learn today?"}
                </h2>
              </div>

              <button
                onClick={handleCancel}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                Cancel
              </button>

            </div>


            <form onSubmit={handleSubmit} className="space-y-6">


              {/* Topic + Category */}

              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="Topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. Next.js Server Components"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-lime-400"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

              </div>


              {/* What I learned */}

              <Textarea
                label="What did you learn?"
                name="learned"
                value={form.learned}
                onChange={handleChange}
                placeholder="Write what you learned today..."
              />


              {/* What confused me */}

              <Textarea
                label="What confused you?"
                name="confused"
                value={form.confused}
                onChange={handleChange}
                placeholder="Write anything you don't understand yet..."
              />


              {/* What to remember */}

              <Textarea
                label="What do you want to remember?"
                name="remember"
                value={form.remember}
                onChange={handleChange}
                placeholder="Write the important ideas you don't want to forget..."
              />


              {/* What next */}

              <Textarea
                label="What should you learn next?"
                name="next"
                value={form.next}
                onChange={handleChange}
                placeholder="Write your next learning goal..."
              />


              {/* Submit */}

              <button
                type="submit"
                className="w-full rounded-xl bg-lime-400 px-5 py-3.5 font-bold text-zinc-950 transition hover:bg-lime-300 sm:w-auto"
              >
                {editingId ? "Update Entry" : "Save Entry"}
              </button>

            </form>

          </section>
        )}


        {/* ================= SEARCH ================= */}

        <section className="mb-6">

          <div className="flex flex-col gap-3 md:flex-row">

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your learning..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-lime-400"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-lime-400"
            >
              <option value="All">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

        </section>


        {/* ================= LEARNING HISTORY ================= */}

        <section>

          <div className="mb-5 flex items-end justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-lime-400">
                Your Progress
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Learning History
              </h2>
            </div>

            <p className="text-sm text-zinc-500">
              {filteredEntries.length}{" "}
              {filteredEntries.length === 1
                ? "entry"
                : "entries"}
            </p>

          </div>


          {/* Empty state */}

          {filteredEntries.length === 0 ? (

            <EmptyState
              hasEntries={entries.length > 0}
              onNewEntry={() => setShowForm(true)}
            />

          ) : (

            <div className="space-y-5">

              {filteredEntries.map((entry) => (

                <article
                  key={entry.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 sm:p-6"
                >

                  {/* Entry header */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <div className="mb-2 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                          {entry.category}
                        </span>

                        <span className="text-xs text-zinc-500">
                          {formatDate(entry.date)}
                        </span>

                      </div>

                      <h3 className="text-xl font-bold">
                        {entry.topic}
                      </h3>

                    </div>


                    {/* Buttons */}

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(entry)}
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(entry.id)
                        }
                        className="rounded-lg border border-red-900/50 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                      >
                        Delete
                      </button>

                    </div>

                  </div>


                  {/* Entry information */}

                  <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <InfoBox
                      title="What I learned"
                      content={entry.learned}
                    />

                    <InfoBox
                      title="What confused me"
                      content={entry.confused}
                    />

                    <InfoBox
                      title="What I want to remember"
                      content={entry.remember}
                    />

                    <InfoBox
                      title="What I should learn next"
                      content={entry.next}
                    />

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        My Learning Journal — Keep learning. Keep growing.
      </footer>

    </main>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {description}
      </p>

    </div>
  );
}


/* =====================================================
   INPUT
===================================================== */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-lime-400"
      />

    </div>
  );
}


/* =====================================================
   TEXTAREA
===================================================== */

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-lime-400"
      />

    </div>
  );
}


/* =====================================================
   INFORMATION BOX
===================================================== */

function InfoBox({
  title,
  content,
}) {
  if (!content?.trim()) {
    return null;
  }

  return (
    <div className="rounded-xl bg-zinc-950 p-4">

      <h4 className="mb-2 text-sm font-semibold text-lime-400">
        {title}
      </h4>

      <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-400">
        {content}
      </p>

    </div>
  );
}


/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  hasEntries,
  onNewEntry,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-5 py-16 text-center">

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
        📚
      </div>

      <h3 className="text-lg font-bold">
        {hasEntries
          ? "No entries found"
          : "Your learning journal is empty"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        {hasEntries
          ? "Try another search term or category."
          : "Start recording what you learn today. Your future self will thank you."}
      </p>

      {!hasEntries && (
        <button
          onClick={onNewEntry}
          className="mt-5 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-lime-300"
        >
          Create First Entry
        </button>
      )}

    </div>
  );
}


/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

