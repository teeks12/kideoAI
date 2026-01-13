"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  Avatar,
  Badge,
  Spinner,
  EmptyState,
  Progress,
  Plus,
  Users,
  Flame,
  Coins,
  Trophy,
  ArrowRight,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function KidsPage() {
  const { data: kids, isLoading } = trpc.kid.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kids</h1>
          <p className="text-gray-600">Manage your children&apos;s profiles</p>
        </div>
        <Link href="/kids/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Kid
          </Button>
        </Link>
      </div>

      {kids && kids.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kids.map((kid) => (
            <Card key={kid.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={kid.avatarUrl}
                      fallback={kid.name}
                      size="xl"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {kid.name}
                      </h3>
                      {kid.dateOfBirth && (
                        <p className="text-sm text-gray-500">
                          Age{" "}
                          {Math.floor(
                            (Date.now() - new Date(kid.dateOfBirth).getTime()) /
                              (365.25 * 24 * 60 * 60 * 1000)
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-secondary-600">
                        <Coins className="h-5 w-5" />
                        {kid.pointsBalance}
                      </div>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-500">
                        <Flame className="h-5 w-5" />
                        {kid.streak?.currentCount || 0}
                      </div>
                      <p className="text-xs text-gray-500">Day Streak</p>
                    </div>
                  </div>

                  {kid.streak && kid.streak.currentCount > 0 && (
                    <div className="mb-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-gray-500">
                          Streak Progress to 7 days
                        </span>
                        <span className="font-medium">
                          {Math.min(kid.streak.currentCount, 7)}/7
                        </span>
                      </div>
                      <Progress
                        value={Math.min(kid.streak.currentCount, 7)}
                        max={7}
                        variant="warning"
                      />
                    </div>
                  )}

                  <Link href={`/kids/${kid.id}`}>
                    <Button variant="outline" className="w-full">
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="No kids yet"
              description="Add your first child to get started"
              action={
                <Link href="/kids/new">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add Kid
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
