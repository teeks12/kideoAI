"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Spinner,
  ArrowLeft,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = use(params);
  const router = useRouter();
  const { data: task, isLoading } = trpc.task.get.useQuery({ id: taskId });
  const { data: kids } = trpc.kid.list.useQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("0");
  const [bonusPoints, setBonusPoints] = useState("0");
  const [timerMinutes, setTimerMinutes] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [iconEmoji, setIconEmoji] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPoints(task.points.toString());
      setBonusPoints(task.bonusPoints.toString());
      setTimerMinutes(task.timerDurationMinutes?.toString() || "");
      setRequiresApproval(task.requiresApproval);
      setIsActive(task.isActive);
      setIconEmoji(task.iconEmoji || "");
    }
  }, [task]);

  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      router.push(`/tasks/${taskId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask.mutate({
      id: taskId,
      title: title.trim(),
      description: description.trim() || null,
      points: parseInt(points, 10),
      bonusPoints: parseInt(bonusPoints, 10),
      timerDurationMinutes: timerMinutes ? parseInt(timerMinutes, 10) : null,
      requiresApproval,
      isActive,
      iconEmoji: iconEmoji || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
        <Link href="/tasks">
          <Button variant="outline" className="mt-4">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/tasks/${taskId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {task.category === "PAID" && (
          <Card>
            <CardHeader>
              <CardTitle>Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {task.type === "BEAT_THE_TIMER" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Bonus Points
                    </label>
                    <input
                      type="number"
                      value={bonusPoints}
                      onChange={(e) => setBonusPoints(e.target.value)}
                      min="0"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {["TIMED", "BEAT_THE_TIMER"].includes(task.type) && (
          <Card>
            <CardHeader>
              <CardTitle>Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(e.target.value)}
                  min="1"
                  className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">
                <span className="font-medium">Requires parent approval</span>
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">
                <span className="font-medium">Task is active</span>
                <span className="block text-gray-500">
                  Inactive tasks won&apos;t appear in kids&apos; task lists
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        {updateTask.error && (
          <p className="text-sm text-red-600">{updateTask.error.message}</p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={updateTask.isPending}
            isLoading={updateTask.isPending}
          >
            Save Changes
          </Button>
          <Link href={`/tasks/${taskId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
