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
  Flame,
  Coins,
  Trophy,
  CheckCircle2,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function KidDetailPage({
  params,
}: {
  params: Promise<{ kidId: string }>;
}) {
  const { kidId } = use(params);
  const { data: kidStats, isLoading } = trpc.kid.getStats.useQuery({ id: kidId });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!kidStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kid not found</p>
        <Link href="/kids">
          <Button variant="outline" className="mt-4">Back to Kids</Button>
        </Link>
      </div>
    );
  }

  const { kid, stats } = kidStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/kids">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{kid.name}</h1>
        </div>
        <Link href={`/kids/${kidId}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar src={kid.avatarUrl} fallback={kid.name} size="xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{kid.name}</h2>
              <p className="text-gray-500">Age {kid.age}</p>
              {kid.pin && (
                <Badge variant="outline" className="mt-2">
                  PIN: {kid.pin}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Coins className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
            <p className="text-2xl font-bold">{kid.pointsBalance}</p>
            <p className="text-sm text-gray-500">Points Balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="mx-auto mb-2 h-8 w-8 text-orange-500" />
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-sm text-gray-500">Current Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <p className="text-2xl font-bold">{stats.totalTasksCompleted}</p>
            <p className="text-sm text-gray-500">Tasks Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="mx-auto mb-2 h-8 w-8 text-purple-500" />
            <p className="text-2xl font-bold">{stats.badgeCount}</p>
            <p className="text-sm text-gray-500">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* More Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Total Points Earned</dt>
              <dd className="text-lg font-semibold">{stats.totalPointsEarned}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Longest Streak</dt>
              <dd className="text-lg font-semibold">{stats.longestStreak} days</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Timed Tasks Completed</dt>
              <dd className="text-lg font-semibold">{stats.timedTasksCompleted}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Rewards Redeemed</dt>
              <dd className="text-lg font-semibold">{stats.redemptionCount}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
