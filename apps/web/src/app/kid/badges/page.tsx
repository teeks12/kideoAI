"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Spinner,
  EmptyState,
  Avatar,
  Award,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

type Kid = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export default function KidBadgesPage() {
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

  return <BadgesContent kids={kids as Kid[]} />;
}

function BadgesContent({ kids }: { kids: Kid[] }) {
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);
  const kidId = selectedKidId || kids[0]!.id;

  const { data: kidData, isLoading } = trpc.kid.get.useQuery({ id: kidId });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const badges = kidData?.badges || [];

  return (
    <div className="space-y-6 pb-20">
      {/* Kid Selector */}
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

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <Award className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Badges</h1>
        <p className="text-gray-500">
          {badges.length} badge{badges.length !== 1 ? "s" : ""} earned
        </p>
      </div>

      {/* Badges Grid */}
      {badges.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {badges.map((kidBadge: any) => (
            <Card key={kidBadge.id} className="overflow-hidden">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-3xl shadow-lg">
                  {kidBadge.badge.iconEmoji || "🏆"}
                </div>
                <h3 className="font-semibold text-gray-900">
                  {kidBadge.badge.name}
                </h3>
                {kidBadge.badge.description && (
                  <p className="mt-1 text-xs text-gray-500">
                    {kidBadge.badge.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Earned {new Date(kidBadge.earnedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Award className="h-12 w-12" />}
              title="No badges yet"
              description="Complete tasks and build streaks to earn badges!"
            />
          </CardContent>
        </Card>
      )}

      {/* Badge Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="mb-2 font-semibold text-gray-900">How to Earn Badges</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>🎯 Complete your first task</li>
            <li>🔥 Build a 7-day streak</li>
            <li>⏱️ Beat the timer on timed tasks</li>
            <li>💯 Reach 100 total points</li>
            <li>👨‍👩‍👧‍👦 Complete family tasks together</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
