"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { groups } from "@/lib/data"
import Link from "next/link"

export default function ProfilePage() {
  const { preferences } = useUserPreferences()

  const subscribedGroups = groups.filter((group) => preferences.subscribedGroups.includes(group.id))

  return (
    <div className="container py-6 space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and view your subscribed groups.</p>
      </section>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>IVC</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>IVC Student</CardTitle>
              <CardDescription>student@ivc.edu</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Student ID</span>
                <span className="text-sm text-muted-foreground">A12345678</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Major</span>
                <span className="text-sm text-muted-foreground">Computer Science</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subscriptions</span>
                <Badge variant="outline">{subscribedGroups.length} Groups</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Subscriptions</CardTitle>
            <CardDescription>Groups you're following</CardDescription>
          </CardHeader>
          <CardContent>
            {subscribedGroups.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">You haven't subscribed to any groups yet</p>
                <Link href="/explore" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="mt-2">
                    Explore Groups
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {subscribedGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <Link href={`/groups/${group.id}`} className="hover:underline">
                      <span className="font-medium">{group.name}</span>
                    </Link>
                    <Badge variant="outline">{group.categoryName}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Notifications</span>
              <Badge>Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Push Notifications</span>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

