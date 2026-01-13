"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  ArrowLeft,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function NewRewardPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState("50");
  const [iconEmoji, setIconEmoji] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(true);

  const createReward = trpc.reward.create.useMutation({
    onSuccess: () => {
      router.push("/rewards");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReward.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      pointsCost: parseInt(pointsCost, 10),
      iconEmoji: iconEmoji || undefined,
      quantity: quantity ? parseInt(quantity, 10) : undefined,
      requiresApproval,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/rewards">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Reward</h1>
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
                  placeholder="e.g., Extra Screen Time"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the reward..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Points Cost
                </label>
                <input
                  type="number"
                  value={pointsCost}
                  onChange={(e) => setPointsCost(e.target.value)}
                  min="1"
                  max="10000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Quantity (optional)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  placeholder="Unlimited"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for unlimited redemptions
                </p>
              </div>
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
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">
                <span className="font-medium">Requires parent approval</span>
                <span className="block text-gray-500">
                  You&apos;ll need to approve redemption requests
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        {createReward.error && (
          <p className="text-sm text-red-600">{createReward.error.message}</p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={createReward.isPending}
            isLoading={createReward.isPending}
          >
            Create Reward
          </Button>
          <Link href="/rewards">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
