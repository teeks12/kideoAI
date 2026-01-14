"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  EmptyState,
  Avatar,
  Gift,
  Coins,
  Check,
  Clock,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

type Kid = {
  id: string;
  name: string;
  avatarUrl: string | null;
  pointsBalance: number;
};

export default function KidRewardsPage() {
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

  return <RewardsContent kids={kids as Kid[]} />;
}

function RewardsContent({ kids }: { kids: Kid[] }) {
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);
  const kidId = selectedKidId || kids[0]!.id;
  const selectedKid = kids.find((k) => k.id === kidId);

  const { data: rewards, isLoading: rewardsLoading } = trpc.reward.list.useQuery({});
  const { data: redemptions } = trpc.redemption.listForKid.useQuery({ kidId });

  const utils = trpc.useUtils();
  const requestRedemption = trpc.redemption.request.useMutation({
    onSuccess: () => {
      utils.redemption.listForKid.invalidate();
      utils.kid.list.invalidate();
    },
  });

  if (rewardsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const pendingRedemptions = redemptions?.filter((r) => r.status === "PENDING") || [];

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

      {/* Points Balance */}
      {selectedKid && (
        <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100">Your Points</p>
                <p className="text-4xl font-bold">{selectedKid.pointsBalance}</p>
              </div>
              <Coins className="h-12 w-12 text-secondary-200" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Redemptions */}
      {pendingRedemptions.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-900">Pending Requests</h3>
          <div className="space-y-2">
            {pendingRedemptions.map((redemption) => (
              <Card key={redemption.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100 text-xl">
                      {redemption.reward.iconEmoji || "🎁"}
                    </div>
                    <div>
                      <p className="font-medium">{redemption.reward.title}</p>
                      <p className="text-sm text-gray-500">{redemption.pointsSpent} pts</p>
                    </div>
                  </div>
                  <Badge variant="warning">
                    <Clock className="mr-1 h-3 w-3" />
                    Waiting
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Rewards */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-gray-900">Rewards Shop</h3>
        {rewards && rewards.length > 0 ? (
          <div className="grid gap-4">
            {rewards.map((reward) => {
              const canAfford = selectedKid && selectedKid.pointsBalance >= reward.pointsCost;
              const outOfStock = reward.quantity !== null && reward.quantity <= 0;

              return (
                <Card key={reward.id} className={outOfStock ? "opacity-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-3xl">
                        {reward.iconEmoji || "🎁"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                        {reward.description && (
                          <p className="text-sm text-gray-500">{reward.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">
                            <Coins className="mr-1 h-3 w-3" />
                            {reward.pointsCost} pts
                          </Badge>
                          {reward.quantity !== null && (
                            <Badge variant="outline">
                              {reward.quantity} left
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={!canAfford || outOfStock || requestRedemption.isPending}
                        onClick={() =>
                          requestRedemption.mutate({
                            rewardId: reward.id,
                            kidId,
                          })
                        }
                        isLoading={
                          requestRedemption.isPending &&
                          requestRedemption.variables?.rewardId === reward.id
                        }
                      >
                        {outOfStock ? "Out of Stock" : canAfford ? "Redeem" : "Need More"}
                      </Button>
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
                icon={<Gift className="h-12 w-12" />}
                title="No rewards yet"
                description="Ask a parent to add some rewards!"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
