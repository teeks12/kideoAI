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
  Progress,
  Avatar,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  ChevronRight,
  Check,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function KidHomePage() {
  const { data: kids, isLoading: kidsLoading } = trpc.kid.list.useQuery();

  if (kidsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!kids || kids.length === 0) {
    return (
      <EmptyState
        title="No profile found"
        description="Ask a parent to add you to the family"
      />
    );
  }

  return <KidHomeContent kids={kids as Kid[]} />;
}

type Kid = {
  id: string;
  name: string;
  avatarUrl: string | null;
  streak: { currentCount: number } | null;
};

function KidHomeContent({ kids }: { kids: Kid[] }) {
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);

  // Select first kid by default
  const kidId = selectedKidId || kids[0]!.id;

  const { data: tasks, isLoading: tasksLoading } = trpc.task.todayForKid.useQuery({ kidId });
  const { data: kidData, isLoading: kidLoading } = trpc.kid.get.useQuery({ id: kidId });

  const utils = trpc.useUtils();
  const completeTask = trpc.completion.create.useMutation({
    onSuccess: () => {
      utils.task.todayForKid.invalidate();
      utils.kid.get.invalidate();
    },
  });

  if (tasksLoading || kidLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const kid = kidData;
  const completedToday = tasks?.filter((t) => t.isCompletedToday).length || 0;
  const totalToday = tasks?.length || 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Kid Selector (if multiple kids) */}
      {kids.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {kids.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedKidId(k.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                k.id === kidId
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Avatar src={k.avatarUrl} fallback={k.name} size="xs" />
              {k.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats Card */}
      {kid && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={kid.avatarUrl}
                    fallback={kid.name}
                    size="xl"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">Hi, {kid.name}!</h2>
                    <p className="text-white/80">Let&apos;s crush it today!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-secondary-600">
                  <Coins className="h-6 w-6" />
                  {kid.pointsBalance}
                </div>
                <p className="text-sm text-gray-500">Points</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-orange-500">
                  <Flame className="h-6 w-6" />
                  {kid.streak?.currentCount || 0}
                </div>
                <p className="text-sm text-gray-500">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Progress */}
      {totalToday > 0 && (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-gray-700">Today&apos;s Progress</span>
            <span className="text-sm text-gray-500">
              {completedToday}/{totalToday} done
            </span>
          </div>
          <Progress
            value={completedToday}
            max={totalToday}
            variant={completedToday === totalToday ? "success" : "default"}
            size="lg"
          />
        </div>
      )}

      {/* Today's Tasks */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Today&apos;s Tasks</h3>
        {tasks && tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = task.isCompletedToday;
              const isPending =
                task.todayCompletion?.status === "PENDING";

              return (
                <Card
                  key={task.id}
                  className={`transition-all ${
                    isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                          isCompleted
                            ? "bg-success-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6 text-success-600" />
                        ) : (
                          task.iconEmoji || "✅"
                        )}
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${
                            isCompleted
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {task.category === "PAID" && (
                            <Badge variant="secondary" className="text-xs">
                              <Coins className="mr-1 h-3 w-3" />
                              {task.points} pts
                            </Badge>
                          )}
                          {task.timerDurationMinutes && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {task.timerDurationMinutes} min
                            </Badge>
                          )}
                          {isPending && (
                            <Badge variant="warning" className="text-xs">
                              Waiting for approval
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!isCompleted && kidId && (
                        <Button
                          size="sm"
                          onClick={() =>
                            completeTask.mutate({
                              taskId: task.id,
                              kidId,
                            })
                          }
                          disabled={completeTask.isPending}
                          isLoading={
                            completeTask.isPending &&
                            completeTask.variables?.taskId === task.id
                          }
                        >
                          Done!
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={<CheckCircle2 className="h-12 w-12" />}
                title="No tasks for today"
                description="Enjoy your free time!"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
