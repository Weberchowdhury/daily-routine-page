"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "hifz-daily-tracker";

function getToday() {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

const emptyForm = {
  date: getToday(),

  sabak: "",
  satasabak: "",
  amukhta: "",
  dailyTilawah: "",
  extraPrayer: "",
  nazera: "",

  sabakDone: false,
  satasabakDone: false,
  amukhtaDone: false,
  dailyTilawahDone: false,
  extraPrayerDone: false,
  nazeraDone: false,

  notes: "",
};

const tasks = [
  {
    key: "sabak",
    doneKey: "sabakDone",
    title: "New Lesson",
    subtitle: "Sabak",
    icon: "📖",
    placeholder: "e.g. Surah Al-Baqarah, pages 5–6",
  },
  {
    key: "satasabak",
    doneKey: "satasabakDone",
    title: "Previous Revision",
    subtitle: "Satasabak",
    icon: "🔄",
    placeholder: "e.g. Previous pages from the current Juz",
  },
  {
    key: "amukhta",
    doneKey: "amukhtaDone",
    title: "Completed Hifz Revision",
    subtitle: "Amukhta",
    icon: "🧠",
    placeholder: "e.g. Juz 1, pages 1–5",
  },
  {
    key: "dailyTilawah",
    doneKey: "dailyTilawahDone",
    title: "Daily Tilawah",
    subtitle: "Daily Recitation",
    icon: "📿",
    placeholder: "e.g. 10 pages",
  },
  {
    key: "extraPrayer",
    doneKey: "extraPrayerDone",
    title: "Prayer Recitation",
    subtitle: "Tilawah in Extra Prayer",
    icon: "🕌",
    placeholder: "e.g. Surah Al-Mulk",
  },
  {
    key: "nazera",
    doneKey: "nazeraDone",
    title: "Nazera Reading",
    subtitle: "Reading from the Mushaf",
    icon: "👀",
    placeholder: "e.g. 5 pages",
  },
];

const filters = [
  "All",
  "New Lesson",
  "Previous Revision",
  "Completed Hifz Revision",
  "Daily Tilawah",
  "Prayer Recitation",
  "Nazera Reading",
];

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Load saved data
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);

    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);

        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      } catch (error) {
        console.error("Could not load Hifz entries:", error);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.date) {
      alert("Please select a date.");
      return;
    }

    if (editingId) {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.id === editingId
            ? {
                ...form,
                id: editingId,
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
    } else {
      const newEntry = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setEntries((previous) => [newEntry, ...previous]);
    }

    setForm({
      ...emptyForm,
      date: getToday(),
    });

    setEditingId(null);
    setShowForm(false);
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this daily record?"
    );

    if (!confirmed) return;

    setEntries((previous) =>
      previous.filter((entry) => entry.id !== id)
    );
  }

  function handleEdit(entry) {
    setForm({
      ...emptyForm,
      ...entry,
    });

    setEditingId(entry.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancel() {
    setForm({
      ...emptyForm,
      date: getToday(),
    });

    setEditingId(null);
    setShowForm(false);
  }

  function calculateProgress(entry) {
    const completedTasks = tasks.filter(
      (task) => entry[task.doneKey]
    ).length;

    return Math.round((completedTasks / tasks.length) * 100);
  }

  const filteredEntries = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesSearch =
        !searchText ||
        (entry.sabak || "").toLowerCase().includes(searchText) ||
        (entry.satasabak || "").toLowerCase().includes(searchText) ||
        (entry.amukhta || "").toLowerCase().includes(searchText) ||
        (entry.dailyTilawah || "")
          .toLowerCase()
          .includes(searchText) ||
        (entry.extraPrayer || "")
          .toLowerCase()
          .includes(searchText) ||
        (entry.nazera || "").toLowerCase().includes(searchText) ||
        (entry.notes || "").toLowerCase().includes(searchText);

      let matchesFilter = true;

      if (filter !== "All") {
        const selectedTask = tasks.find(
          (task) => task.title === filter
        );

        matchesFilter =
          selectedTask && entry[selectedTask.doneKey];
      }

      return matchesSearch && matchesFilter;
    });
  }, [entries, search, filter]);

  const totalRecords = entries.length;

  const todayRecords = entries.filter(
    (entry) => entry.date === getToday()
  ).length;

  const averageProgress =
    entries.length === 0
      ? 0
      : Math.round(
          entries.reduce(
            (total, entry) => total + calculateProgress(entry),
            0
          ) / entries.length
        );

  return (
    <main className="min-h-screen overflow-hidden bg-[#120d11] text-[#f8e9ef]">
      {/* Background Decoration */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-900/20 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-fuchsia-900/15 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-rose-950/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(190,80,120,0.08),transparent_35%)]" />

        <div className="absolute inset-0 opacity-[0.025]">
          <div className="grid h-full grid-cols-8 gap-8 p-8 text-5xl text-rose-200">
            {Array.from({ length: 80 }).map((_, index) => (
              <span key={index}>۝</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-rose-400">
              Qur'an Memorization
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-[#fff1f5] sm:text-5xl">
              Hifz Journey
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#bfa9b4] sm:text-base">
              Keep track of your daily memorization, revision,
              tilawah, and Qur'an reading.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setForm({
                  ...emptyForm,
                  date: getToday(),
                });
                setShowForm(true);
              }
            }}
            className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-950/40 transition hover:bg-rose-400 hover:shadow-rose-900/50"
          >
            {showForm ? "Close Form" : "+ New Daily Record"}
          </button>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Records"
            value={totalRecords}
            icon="📚"
          />

          <StatCard
            title="Today's Records"
            value={todayRecords}
            icon="🌙"
          />

          <StatCard
            title="Average Progress"
            value={`${averageProgress}%`}
            icon="✨"
          />
        </section>

        {/* Form */}
        {showForm && (
          <section className="mb-10 rounded-3xl border border-[#4a303c] bg-[#21151c]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
                {editingId ? "Edit Record" : "Daily Record"}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#fff1f5]">
                {editingId
                  ? "Update Your Hifz Day"
                  : "Record Your Hifz Day"}
              </h2>

              <p className="mt-2 text-sm text-[#bfa9b4]">
                Record what you studied and mark each task as
                completed.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Date */}
              <div className="mb-7">
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-semibold text-[#ead5dd]"
                >
                  Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#4a303c] bg-[#160f13] px-4 py-3 text-sm text-[#f8e9ef] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 sm:max-w-xs"
                />
              </div>

              {/* Tasks */}
              <div className="grid gap-5 lg:grid-cols-2">
                {tasks.map((task) => (
                  <TaskInput
                    key={task.key}
                    task={task}
                    form={form}
                    handleChange={handleChange}
                  />
                ))}
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-semibold text-[#ead5dd]"
                >
                  Daily Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write anything you want to remember about today's Hifz..."
                  className="w-full resize-none rounded-xl border border-[#4a303c] bg-[#160f13] px-4 py-3 text-sm text-[#f8e9ef] placeholder:text-[#806b75] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-400"
                >
                  {editingId
                    ? "Update Daily Record"
                    : "Save Daily Record"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-[#4a303c] bg-[#2a1b24] px-6 py-3 text-sm font-semibold text-[#d8c2cc] transition hover:bg-[#35222d] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Search & Filter */}
        <section className="mb-8 rounded-2xl border border-[#3d2933] bg-[#1b1218]/80 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="sr-only"
              >
                Search records
              </label>

              <input
                id="search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your Hifz records..."
                className="w-full rounded-xl border border-[#46303a] bg-[#160f13] px-4 py-3 text-sm text-[#f8e9ef] placeholder:text-[#806b75] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="lg:w-72">
              <label
                htmlFor="filter"
                className="sr-only"
              >
                Filter records
              </label>

              <select
                id="filter"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
                className="w-full rounded-xl border border-[#46303a] bg-[#160f13] px-4 py-3 text-sm text-[#f8e9ef] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
              >
                {filters.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-[#1b1218] text-white"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* History */}
        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
                Your Records
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#fff1f5]">
                Hifz History
              </h2>
            </div>

            <p className="text-sm text-[#8f7a84]">
              {filteredEntries.length}{" "}
              {filteredEntries.length === 1
                ? "record"
                : "records"}{" "}
              found
            </p>
          </div>

          {filteredEntries.length === 0 ? (
            <EmptyState
              hasRecords={entries.length > 0}
              onCreate={() => {
                setForm({
                  ...emptyForm,
                  date: getToday(),
                });
                setShowForm(true);
              }}
            />
          ) : (
            <div className="space-y-5">
              {filteredEntries.map((entry) => (
                <HifzEntry
                  key={entry.id}
                  entry={entry}
                  progress={calculateProgress(entry)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#34232c] pt-6 text-center">
          <p className="text-xs text-[#75636c]">
            Hifz Journey • Stay consistent, stay connected
            with the Qur'an.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ================================
   STAT CARD
================================ */

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#3f2934] bg-[#1d131a]/90 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#927c86]">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#fff1f5]">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-2xl ring-1 ring-rose-400/10">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================================
   TASK INPUT
================================ */

function TaskInput({ task, form, handleChange }) {
  return (
    <div className="rounded-2xl border border-[#42303a] bg-[#1a1117] p-5 transition hover:border-[#61404d]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-xl ring-1 ring-rose-400/10">
            {task.icon}
          </div>

          <div>
            <h3 className="font-bold text-[#f8e9ef]">
              {task.title}
            </h3>

            <p className="mt-0.5 text-xs text-[#927c86]">
              {task.subtitle}
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name={task.doneKey}
            checked={form[task.doneKey]}
            onChange={handleChange}
            className="h-5 w-5 cursor-pointer accent-rose-500"
          />

          <span className="hidden text-xs font-semibold text-[#9d8992] sm:block">
            Done
          </span>
        </label>
      </div>

      <input
        type="text"
        name={task.key}
        value={form[task.key]}
        onChange={handleChange}
        placeholder={task.placeholder}
        className="w-full rounded-xl border border-[#3d2b34] bg-[#120d11] px-4 py-3 text-sm text-[#f8e9ef] placeholder:text-[#76636c] outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
      />
    </div>
  );
}

/* ================================
   HIFZ ENTRY
================================ */

function HifzEntry({
  entry,
  progress,
  onEdit,
  onDelete,
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#43303a] bg-[#1d141a]/95 shadow-2xl shadow-black/25 backdrop-blur-xl">
      {/* Entry Header */}
      <div className="border-b border-[#38262f] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
              Daily Record
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#fff1f5]">
              {formatDate(entry.date)}
            </h3>
          </div>

          {/* Progress */}
          <div className="sm:min-w-52">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#a8919b]">
                Daily Progress
              </span>

              <span className="font-bold text-rose-400">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#392630]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {tasks.map((task) => {
          const isDone = entry[task.doneKey];
          const value = entry[task.key];

          return (
            <div
              key={task.key}
              className={`rounded-2xl border p-4 transition ${
                isDone
                  ? "border-rose-500/20 bg-rose-500/5"
                  : "border-[#382831] bg-[#181015]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {task.icon}
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#eee0e6]">
                      {task.title}
                    </p>

                    <p className="text-[11px] text-[#806c76]">
                      {task.subtitle}
                    </p>
                  </div>
                </div>

                {isDone && (
                  <span className="rounded-full bg-rose-500/15 px-2 py-1 text-[10px] font-bold text-rose-400">
                    DONE
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-[#ad98a2]">
                {value || (
                  <span className="italic text-[#685660]">
                    No details added
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {entry.notes && (
        <div className="mx-5 mb-5 rounded-2xl border border-[#382831] bg-[#181015] p-4 sm:mx-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            Daily Notes
          </p>

          <p className="whitespace-pre-wrap text-sm leading-6 text-[#ad98a2]">
            {entry.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-[#38262f] bg-[#181015]/60 p-4 sm:flex-row sm:justify-end">
        <button
          onClick={() => onEdit(entry)}
          className="rounded-xl border border-[#4b3440] px-4 py-2.5 text-sm font-semibold text-[#d5c0ca] transition hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-300"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(entry.id)}
          className="rounded-xl border border-red-900/40 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

/* ================================
   EMPTY STATE
================================ */

function EmptyState({ hasRecords, onCreate }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#4a303c] bg-[#1b1218]/70 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-3xl">
        {hasRecords ? "🔎" : "📖"}
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#f6e8ed]">
        {hasRecords
          ? "No matching records"
          : "No Hifz records yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8e7983]">
        {hasRecords
          ? "Try changing your search or filter."
          : "Start recording your daily Qur'an memorization journey."}
      </p>

      {!hasRecords && (
        <button
          onClick={onCreate}
          className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-400"
        >
          + Create First Record
        </button>
      )}
    </div>
  );
}

/* ================================
   DATE FORMAT
================================ */

function formatDate(date) {
  if (!date) return "Unknown date";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}