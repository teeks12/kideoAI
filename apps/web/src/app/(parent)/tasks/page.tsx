"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  EmptyState,
  Plus,
  CheckCircle2,
  Clock,
  Coins,
  Users,
  Edit,
  Trash2,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "EXPECTED" | "PAID">("all");
  const utils = trpc.useUtils();

  const { data: tasks, isLoading } = trpc.task.list.useQuery({
    category: filter === "all" ? undefined : filter,
  });

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            Manage tasks and chores for your family
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Tasks
        </Button>
        <Button
          variant={filter === "EXPECTED" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("EXPECTED")}
        >
          Expected
        </Button>
        <Button
          variant={filter === "PAID" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("PAID")}
        >
          Paid
        </Button>
      </div>

      {/* Tasks List */}
      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{task.iconEmoji || "✅"}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge
                      variant={
                        task.category === "PAID" ? "secondary" : "default"
                      }
                    >
                      {task.category === "PAID" ? "Paid" : "Expected"}
                    </Badge>
                    {task.category === "PAID" && (
                      <Badge variant="outline">
                        <Coins className="mr-1 h-3 w-3" />
                        {task.points} pts
                      </Badge>
                    )}
                    {task.timerDurationMinutes && (
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {task.timerDurationMinutes} min
                      </Badge>
                    )}
                  </div>

                  {task.assignments.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>
                        {task.assignments.map((a) => a.kid.name).join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex border-t border-gray-100">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex flex-1 items-center justify-center gap-1 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this task?")) {
                        deleteTask.mutate({ id: task.id });
                      }
                    }}
                    className="flex flex-1 items-center justify-center gap-1 border-l border-gray-100 py-3 text-sm font-medium text-error-600 transition-colors hover:bg-error-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<CheckCircle2 className="h-12 w-12" />}
              title="No tasks yet"
              description="Create your first task to get started"
              action={
                <Link href="/tasks/new">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
