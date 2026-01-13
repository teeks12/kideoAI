"use client";

import Link from "next/link";
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
  Users,
  CheckCircle2,
  Bell,
  Coins,
  Plus,
  ArrowRight,
  Flame,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } =
    trpc.family.getStats.useQuery();
  const { data: kids, isLoading: kidsLoading } = trpc.kid.list.useQuery();
  const { data: pendingApprovals, isLoading: approvalsLoading } =
    trpc.completion.listPending.useQuery();

  if (statsLoading || kidsLoading || approvalsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your family.
          </p>
        </div>
        <Link href="/kids/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Kid
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary-100 p-3">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.kidsCount || 0}</p>
                <p className="text-sm text-gray-500">Kids</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-success-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.activeTasksCount || 0}
                </p>
                <p className="text-sm text-gray-500">Active Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-warning-100 p-3">
                <Bell className="h-6 w-6 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.pendingApprovalsCount || 0}
                </p>
                <p className="text-sm text-gray-500">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-secondary-100 p-3">
                <Coins className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.totalPointsIssued || 0}
                </p>
                <p className="text-sm text-gray-500">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Kids Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kids</CardTitle>
            <Link href="/kids">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {kids && kids.length > 0 ? (
              <div className="space-y-4">
                {kids.slice(0, 4).map((kid) => (
                  <Link
                    key={kid.id}
                    href={`/kids/${kid.id}`}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={kid.avatarUrl}
                        fallback={kid.name}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{kid.name}</p>
                        <p className="text-sm text-gray-500">
                          {kid.pointsBalance} points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {kid.streak && kid.streak.currentCount > 0 && (
                        <Badge variant="secondary">
                          <Flame className="mr-1 h-3 w-3" />
                          {kid.streak.currentCount} day streak
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="h-12 w-12" />}
                title="No kids yet"
                description="Add your first kid to get started"
                action={
                  <Link href="/kids/new">
                    <Button>
                      <Plus className="h-4 w-4" />
                      Add Kid
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Approvals</CardTitle>
            <Link href="/approvals">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingApprovals && pendingApprovals.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovals.slice(0, 4).map((completion) => (
                  <div
                    key={completion.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={completion.kid.avatarUrl}
                        fallback={completion.kid.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {completion.task.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {completion.kid.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="h-12 w-12" />}
                title="All caught up!"
                description="No pending approvals right now"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
