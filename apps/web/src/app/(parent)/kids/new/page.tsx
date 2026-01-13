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

const avatarOptions = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy",
];

export default function NewKidPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [pin, setPin] = useState("");

  const createKid = trpc.kid.create.useMutation({
    onSuccess: () => {
      router.push("/kids");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createKid.mutate({
      name: name.trim(),
      age: parseInt(age, 10),
      avatarUrl: selectedAvatar,
      pin: pin || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/kids">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Kid</h1>
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
                placeholder="Enter kid's name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
                min="1"
                max="18"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
                PIN (optional)
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="4-digit PIN for kid login"
                maxLength={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <p className="mt-1 text-xs text-gray-500">
                Kids can use this PIN to access their dashboard
              </p>
            </div>

            {createKid.error && (
              <p className="text-sm text-red-600">
                {createKid.error.message}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createKid.isPending}
                isLoading={createKid.isPending}
              >
                Add Kid
              </Button>
              <Link href="/kids">
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
