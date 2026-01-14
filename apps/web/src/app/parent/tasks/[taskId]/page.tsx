"use client";

import { use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Spinner,
  Avatar,
  ArrowLeft,
  Clock,
  Coins,
  Users,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = use(params);
  const { data: task, isLoading } = trpc.task.get.useQuery({ id: taskId });

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        </div>
        <Link href={`/tasks/${taskId}/edit`}>
          <Button variant="outline">Edit Task</Button>
        </Link>
      </div>

      {/* Task Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-3xl">
              {task.iconEmoji || "📋"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
              {task.description && (
                <p className="mt-1 text-gray-600">{task.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={task.category === "PAID" ? "secondary" : "outline"}>
                  {task.category}
                </Badge>
                <Badge variant="outline">{task.type}</Badge>
                <Badge variant="outline">{task.schedule}</Badge>
                {!task.isActive && <Badge variant="error">Inactive</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {task.category === "PAID" && (
          <Card>
            <CardContent className="p-4 text-center">
              <Coins className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
              <p className="text-2xl font-bold">{task.points}</p>
              <p className="text-sm text-gray-500">Points</p>
            </CardContent>
          </Card>
        )}

        {task.timerDurationMinutes && (
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-blue-500" />
              <p className="text-2xl font-bold">{task.timerDurationMinutes}</p>
              <p className="text-sm text-gray-500">Minutes</p>
            </CardContent>
          </Card>
        )}

        {task.type === "BEAT_THE_TIMER" && task.bonusPoints > 0 && (
          <Card>
            <CardContent className="p-4 text-center">
              <Coins className="mx-auto mb-2 h-8 w-8 text-green-500" />
              <p className="text-2xl font-bold">+{task.bonusPoints}</p>
              <p className="text-sm text-gray-500">Bonus Points</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assigned Kids */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assigned To
          </CardTitle>
        </CardHeader>
        <CardContent>
          {task.assignments && task.assignments.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {task.assignments.map((assignment: any) => (
                <div
                  key={assignment.kid.id}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2"
                >
                  <Avatar
                    src={assignment.kid.avatarUrl}
                    fallback={assignment.kid.name}
                    size="xs"
                  />
                  <span className="text-sm font-medium">{assignment.kid.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not assigned to any kids</p>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">Requires Approval</dt>
              <dd className="font-medium">{task.requiresApproval ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Counts Toward Streak</dt>
              <dd className="font-medium">{task.countsTowardStreak ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
