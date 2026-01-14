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

const avatarOptions = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oscar",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Mia",
];

export default function EditKidPage({
  params,
}: {
  params: Promise<{ kidId: string }>;
}) {
  const { kidId } = use(params);
  const router = useRouter();
  const { data: kid, isLoading } = trpc.kid.get.useQuery({ id: kidId });

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (kid) {
      setName(kid.name);
      setSelectedAvatar(kid.avatarUrl || avatarOptions[0]);
      setPin(kid.pin || "");
    }
  }, [kid]);

  const updateKid = trpc.kid.update.useMutation({
    onSuccess: () => {
      router.push(`/kids/${kidId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateKid.mutate({
      id: kidId,
      name: name.trim(),
      avatarUrl: selectedAvatar,
      pin: pin || null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!kid) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kid not found</p>
        <Link href="/kids">
          <Button variant="outline" className="mt-4">Back to Kids</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/kids/${kidId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit {kid.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kid Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <div className="flex flex-wrap gap-3">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`h-16 w-16 overflow-hidden rounded-full border-4 transition-all ${
                      selectedAvatar === avatar
                        ? "border-primary-500 ring-2 ring-primary-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={avatar} alt="Avatar option" className="h-full w-full" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                PIN
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="4-digit PIN"
                maxLength={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Kids can use this PIN to access their dashboard
              </p>
            </div>

            {updateKid.error && (
              <p className="text-sm text-red-600">{updateKid.error.message}</p>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={updateKid.isPending}
                isLoading={updateKid.isPending}
              >
                Save Changes
              </Button>
              <Link href={`/kids/${kidId}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
