import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCalendarTask, removeCalendarTask, restoreCalendarTasks, serializeCalendarTasks, updateCalendarTask, type CalendarTask } from "@shared/calendar";

type StudyTask = CalendarTask;

const palette = ["#6869e6", "#45a88b", "#e47c68", "#e8b94c", "#f59a72"];
const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const keyFor = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export default function StudyCalendar() {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Estudo geral");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", subject: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gcm-study-calendar");
      if (saved) setTasks(restoreCalendarTasks(saved));
    } catch { toast.error("Não foi possível recuperar seu calendário."); }
  }, []);

  useEffect(() => { localStorage.setItem("gcm-study-calendar", serializeCalendarTasks(tasks)); }, [tasks]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(month.getFullYear(), month.getMonth(), 1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  }, [month]);

  const addTask = () => {
    if (!title.trim()) return toast.error("Dê um nome para o card antes de criar.");
    setTasks(items => [...items, createCalendarTask({ id: crypto.randomUUID(), title, subject, color: palette[items.length % palette.length] })]);
    setTitle("");
    toast.success("Card criado. Arraste-o para uma data.");
  };

  const dropOnDate = (date: Date) => {
    if (!draggedId) return;
    const dateValue = keyFor(date);
    setTasks(items => updateCalendarTask(items, draggedId, { date: dateValue }));
    setDraggedId(null);
    toast.success(`Card agendado para ${date.toLocaleDateString("pt-BR")}.`);
  };

  const removeTask = (id: string) => setTasks(items => removeCalendarTask(items, id));
  const beginEdit = (task: StudyTask) => { setEditingId(task.id); setEditForm({ title: task.title, subject: task.subject }); };
  const saveEdit = () => { if (!editingId || !editForm.title.trim()) return toast.error("O card precisa ter um título."); setTasks(items => updateCalendarTask(items, editingId, { title: editForm.title.trim(), subject: editForm.subject.trim() || "Estudo geral" })); setEditingId(null); toast.success("Card atualizado."); };
  const pending = tasks.filter(task => !task.date);
  const monthName = month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return <section className="mt-8 rounded-[28px] bg-white p-5 shadow-[0_12px_35px_-24px_#1e2340] sm:p-7" aria-label="Calendário de estudos">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><div className="flex items-center gap-2"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eef0ff] text-[#5b5ce2]"><CalendarDays className="h-5 w-5" /></div><div><h2 className="font-display text-xl font-bold">Calendário de estudos</h2><p className="mt-1 text-xs text-[#8b90a2]">Crie cards na lateral e arraste para o dia certo.</p></div></div></div><div className="flex items-center gap-2 self-end rounded-xl bg-[#f7f8fc] p-1 md:self-auto"><button aria-label="Mês anterior" onClick={() => setMonth(value => new Date(value.getFullYear(), value.getMonth() - 1, 1))} className="grid h-8 w-8 place-items-center rounded-lg text-[#777d90] hover:bg-white hover:text-[#5b5ce2]"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-[130px] text-center text-xs font-bold capitalize text-[#4b5063]">{monthName}</span><button aria-label="Próximo mês" onClick={() => setMonth(value => new Date(value.getFullYear(), value.getMonth() + 1, 1))} className="grid h-8 w-8 place-items-center rounded-lg text-[#777d90] hover:bg-white hover:text-[#5b5ce2]"><ChevronRight className="h-4 w-4" /></button></div></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[250px_1fr]">
      <aside className="rounded-2xl bg-[#f7f8fc] p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9a9faf]">Cards pendentes</p><p className="mt-1 text-xs text-[#777d90]">{pending.length} para organizar</p></div><span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-[#5b5ce2]"><GripVertical className="h-4 w-4" /></span></div><div className="mt-4 space-y-2">{pending.length === 0 ? <div className="rounded-xl border border-dashed border-[#dfe2ee] px-3 py-5 text-center text-xs font-medium text-[#9a9faf]">Crie um card abaixo e arraste para o calendário.</div> : pending.map(task => <div key={task.id} draggable={editingId !== task.id} onDragStart={() => setDraggedId(task.id)} className="group flex cursor-grab items-center gap-2 rounded-xl bg-white p-3 shadow-sm active:cursor-grabbing">{editingId === task.id ? <div className="w-full space-y-2"><input autoFocus value={editForm.title} onChange={event => setEditForm({ ...editForm, title: event.target.value })} className="w-full rounded-lg border-0 bg-[#f7f8fc] px-2 py-1.5 text-xs font-bold outline-none" /><input value={editForm.subject} onChange={event => setEditForm({ ...editForm, subject: event.target.value })} className="w-full rounded-lg border-0 bg-[#f7f8fc] px-2 py-1.5 text-[10px] outline-none" /><div className="flex justify-end gap-2"><button onClick={() => setEditingId(null)} className="text-[10px] font-bold text-[#9a9faf]">Cancelar</button><button onClick={saveEdit} className="rounded-md bg-[#5b5ce2] px-2 py-1 text-[10px] font-bold text-white">Salvar</button></div></div> : <><span className="h-7 w-1 rounded-full" style={{ backgroundColor: task.color }} /><GripVertical className="h-4 w-4 shrink-0 text-[#c1c5d1]" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#4b5063]">{task.title}</p><p className="mt-0.5 truncate text-[10px] text-[#a0a4b5]">{task.subject}</p></div><button aria-label={`Editar ${task.title}`} onClick={() => beginEdit(task)} className="opacity-0 transition group-hover:opacity-100"><Pencil className="h-3.5 w-3.5 text-[#5b5ce2]" /></button><button aria-label={`Excluir ${task.title}`} onClick={() => removeTask(task.id)} className="opacity-0 transition group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5 text-[#e47c68]" /></button></>}</div>)}</div><div className="mt-4 space-y-2 border-t border-[#e6e8f0] pt-4"><input value={title} onChange={event => setTitle(event.target.value)} onKeyDown={event => event.key === "Enter" && addTask()} placeholder="Nome do novo card" className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-xs outline-none ring-1 ring-[#e7e9f1] focus:ring-2 focus:ring-[#b9baff]" /><input value={subject} onChange={event => setSubject(event.target.value)} placeholder="Matéria ou categoria" className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-xs outline-none ring-1 ring-[#e7e9f1] focus:ring-2 focus:ring-[#b9baff]" /><button onClick={addTask} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b5ce2] px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5b5ce225] hover:bg-[#4e50cd]"><Plus className="h-4 w-4" /> Criar card</button></div></aside>
      <div className="min-w-0"><div className="grid grid-cols-7 border-b border-[#eef0f5] pb-2">{weekDays.map(day => <span key={day} className="text-center text-[10px] font-bold tracking-wider text-[#a0a4b5]">{day}</span>)}</div><div className="mt-2 grid grid-cols-7 overflow-hidden rounded-2xl border border-[#eef0f5]">{days.map(date => { const dateKey = keyFor(date); const dayTasks = tasks.filter(task => task.date === dateKey); const inMonth = date.getMonth() === month.getMonth(); const isToday = dateKey === keyFor(today); return <div key={dateKey} onDragOver={event => event.preventDefault()} onDrop={() => dropOnDate(date)} className={`min-h-[92px] border-b border-r border-[#eef0f5] p-1.5 transition sm:min-h-[112px] sm:p-2 ${inMonth ? "bg-white" : "bg-[#fafbfe]"} ${draggedId ? "hover:bg-[#eef0ff]" : ""}`}><div className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${isToday ? "bg-[#5b5ce2] text-white" : inMonth ? "text-[#72788b]" : "text-[#c8cbd5]"}`}>{date.getDate()}</div><div className="mt-1 space-y-1">{dayTasks.map(task => <div key={task.id} className="group flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: task.color }} title={`${task.title} · ${task.subject}`}><span className="truncate">{task.title}</span><button aria-label={`Remover ${task.title}`} onClick={() => setTasks(items => updateCalendarTask(items, task.id, { date: undefined }))} className="ml-auto hidden group-hover:block"><Trash2 className="h-3 w-3" /></button></div>)}</div></div>; })}</div></div>
    </div>
  </section>;
}
