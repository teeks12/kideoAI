"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Avatar,
  Badge,
  Spinner,
  EmptyState,
  Check,
  X,
  CheckCircle2,
  Clock,
  Coins,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function ApprovalsPage() {
  const utils = trpc.useUtils();
  const { data: pendingApprovals, isLoading } =
    trpc.completion.listPending.useQuery();

  const approveCompletion = trpc.completion.approve.useMutation({
    onSuccess: () => {
      utils.completion.listPending.invalidate();
      utils.family.getStats.invalidate();
    },
  });

  const rejectCompletion = trpc.completion.reject.useMutation({
    onSuccess: () => {
      utils.completion.listPending.invalidate();
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-600">
          Review and approve task completions from your kids
        </p>
      </div>

      {pendingApprovals && pendingApprovals.length > 0 ? (
        <div className="space-y-4">
          {pendingApprovals.map((completion) => (
            <Card key={completion.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={completion.kid.avatarUrl}
                      fallback={completion.kid.name}
                      size="lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {completion.task.title}
                      </h3>
                      <p className="text-gray-500">
                        Completed by {completion.kid.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant={
                            completion.task.category === "PAID"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {completion.task.category === "PAID"
                            ? "Paid"
                            : "Expected"}
                        </Badge>
                        {completion.task.category === "PAID" && (
                          <Badge variant="outline">
                            <Coins className="mr-1 h-3 w-3" />
                            {completion.task.points} pts
                          </Badge>
                        )}
                        {completion.timerSession && (
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {Math.floor(
                              completion.timerSession.elapsedSeconds / 60
                            )}{" "}
                            min
                          </Badge>
                        )}
                      </div>
                      {completion.task.description && (
                        <p className="mt-2 text-sm text-gray-500">
                          {completion.task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to reject this task?")
                        ) {
                          rejectCompletion.mutate({
                            completionId: completion.id,
                          });
                        }
                      }}
                      disabled={rejectCompletion.isPending}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      onClick={() =>
                        approveCompletion.mutate({
                          completionId: completion.id,
                        })
                      }
                      disabled={approveCompletion.isPending}
                      isLoading={approveCompletion.isPending}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
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
              title="All caught up!"
              description="No pending approvals right now. Check back later."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
