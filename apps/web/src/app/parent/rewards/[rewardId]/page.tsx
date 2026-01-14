"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Spinner,
  ArrowLeft,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function EditRewardPage({
  params,
}: {
  params: Promise<{ rewardId: string }>;
}) {
  const { rewardId } = use(params);
  const router = useRouter();
  const { data: reward, isLoading } = trpc.reward.get.useQuery({ id: rewardId });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState("50");
  const [iconEmoji, setIconEmoji] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (reward) {
      setName(reward.title);
      setDescription(reward.description || "");
      setPointsCost(reward.pointsCost.toString());
      setIconEmoji(reward.iconEmoji || "");
      setIsActive(reward.isActive);
    }
  }, [reward]);

  const updateReward = trpc.reward.update.useMutation({
    onSuccess: () => {
      router.push("/rewards");
    },
  });

  const deleteReward = trpc.reward.delete.useMutation({
    onSuccess: () => {
      router.push("/rewards");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateReward.mutate({
      id: rewardId,
      title: name.trim(),
      description: description.trim() || null,
      pointsCost: parseInt(pointsCost, 10),
      iconEmoji: iconEmoji || null,
      isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Reward not found</p>
        <Link href="/rewards">
          <Button variant="outline" className="mt-4">Back to Rewards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/rewards">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Reward</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reward Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-20">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <input
                  type="text"
                  value={iconEmoji}
                  onChange={(e) => setIconEmoji(e.target.value)}
                  placeholder="🎁"
                  maxLength={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-2xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Points Cost
              </label>
              <input
                type="number"
                value={pointsCost}
                onChange={(e) => setPointsCost(e.target.value)}
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">
                <span className="font-medium">Reward is active</span>
                <span className="block text-gray-500">
                  Inactive rewards won&apos;t appear in the shop
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        {updateReward.error && (
          <p className="text-sm text-red-600">{updateReward.error.message}</p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={updateReward.isPending}
            isLoading={updateReward.isPending}
          >
            Save Changes
          </Button>
          <Link href="/rewards">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this reward?")) {
                deleteReward.mutate({ id: rewardId });
              }
            }}
            disabled={deleteReward.isPending}
            className="ml-auto"
          >
            Delete Reward
          </Button>
        </div>
      </form>
    </div>
  );
}
