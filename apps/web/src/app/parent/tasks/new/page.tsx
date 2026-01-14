"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Spinner,
  ArrowLeft,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

const categoryOptions = [
  { value: "EXPECTED", label: "Expected", description: "No points - basic responsibilities" },
  { value: "PAID", label: "Paid", description: "Earns points when completed" },
];

const typeOptions = [
  { value: "INDIVIDUAL", label: "Individual", description: "Mark as done" },
  { value: "TIMED", label: "Timed", description: "Must spend minimum time" },
  { value: "BEAT_THE_TIMER", label: "Beat the Timer", description: "Bonus for finishing early" },
  { value: "FAMILY", label: "Family", description: "Group activity" },
];

const scheduleOptions = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKDAYS", label: "Weekdays" },
  { value: "WEEKENDS", label: "Weekends" },
  { value: "ADHOC", label: "One-time / As needed" },
];

export default function NewTaskPage() {
  const router = useRouter();
  const { data: kids, isLoading: kidsLoading } = trpc.kid.list.useQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"EXPECTED" | "PAID">("EXPECTED");
  const [type, setType] = useState<"INDIVIDUAL" | "TIMED" | "BEAT_THE_TIMER" | "FAMILY">("INDIVIDUAL");
  const [schedule, setSchedule] = useState<"DAILY" | "WEEKDAYS" | "WEEKENDS" | "ADHOC">("DAILY");
  const [points, setPoints] = useState("10");
  const [bonusPoints, setBonusPoints] = useState("5");
  const [timerMinutes, setTimerMinutes] = useState("15");
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [iconEmoji, setIconEmoji] = useState("");

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      router.push("/tasks");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      type,
      schedule,
      points: category === "PAID" ? parseInt(points, 10) : 0,
      bonusPoints: type === "BEAT_THE_TIMER" ? parseInt(bonusPoints, 10) : 0,
      timerDurationMinutes: ["TIMED", "BEAT_THE_TIMER"].includes(type) ? parseInt(timerMinutes, 10) : undefined,
      requiresApproval,
      iconEmoji: iconEmoji || undefined,
      kidIds: selectedKids.length > 0 ? selectedKids : undefined,
    });
  };

  const toggleKid = (kidId: string) => {
    setSelectedKids((prev) =>
      prev.includes(kidId) ? prev.filter((id) => id !== kidId) : [...prev, kidId]
    );
  };

  if (kidsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-20">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <input
                  type="text"
                  value={iconEmoji}
                  onChange={(e) => setIconEmoji(e.target.value)}
                  placeholder="📝"
                  maxLength={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-2xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Make your bed"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details or instructions..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category & Type */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="flex gap-3">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value as any)}
                    className={`flex-1 rounded-lg border-2 p-3 text-left transition-all ${
                      category === opt.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value as any)}
                    className={`rounded-lg border-2 p-3 text-left transition-all ${
                      type === opt.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Schedule
              </label>
              <div className="flex flex-wrap gap-2">
                {scheduleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSchedule(opt.value as any)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      schedule === opt.value
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points & Timer */}
        {(category === "PAID" || ["TIMED", "BEAT_THE_TIMER"].includes(type)) && (
          <Card>
            <CardHeader>
              <CardTitle>Points & Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category === "PAID" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    min="1"
                    max="1000"
                    className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              )}

              {["TIMED", "BEAT_THE_TIMER"].includes(type) && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Timer Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(e.target.value)}
                    min="1"
                    max="120"
                    className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              )}

              {type === "BEAT_THE_TIMER" && category === "PAID" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bonus Points (for beating timer)
                  </label>
                  <input
                    type="number"
                    value={bonusPoints}
                    onChange={(e) => setBonusPoints(e.target.value)}
                    min="0"
                    max="500"
                    className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Assign To</CardTitle>
          </CardHeader>
          <CardContent>
            {kids && kids.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {kids.map((kid) => (
                  <button
                    key={kid.id}
                    type="button"
                    onClick={() => toggleKid(kid.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedKids.includes(kid.id)
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {kid.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No kids added yet.{" "}
                <Link href="/kids/new" className="text-primary-600 hover:underline">
                  Add a kid first
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">
                <span className="font-medium">Requires parent approval</span>
                <span className="block text-gray-500">
                  You&apos;ll need to approve completions before points are awarded
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Submit */}
        {createTask.error && (
          <p className="text-sm text-red-600">{createTask.error.message}</p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={createTask.isPending}
            isLoading={createTask.isPending}
          >
            Create Task
          </Button>
          <Link href="/tasks">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
