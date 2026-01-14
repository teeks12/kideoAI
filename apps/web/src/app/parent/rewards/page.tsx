"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  EmptyState,
  Plus,
  Gift,
  Coins,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function RewardsPage() {
  const { data: rewards, isLoading } = trpc.reward.list.useQuery({});

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
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <Link href="/rewards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Reward
          </Button>
        </Link>
      </div>

      {rewards && rewards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <Link key={reward.id} href={`/rewards/${reward.id}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                      {reward.iconEmoji || "🎁"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                      {reward.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {reward.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">
                          <Coins className="mr-1 h-3 w-3" />
                          {reward.pointsCost} pts
                        </Badge>
                        {!reward.isActive && (
                          <Badge variant="error">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Gift className="h-12 w-12" />}
              title="No rewards yet"
              description="Create rewards that kids can redeem with their points"
              action={
                <Link href="/rewards/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Reward
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
