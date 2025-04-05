"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import EventCard from "@/components/event-card"
import { events, groups } from "@/lib/data"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export default function Home() {
  const { preferences } = useUserPreferences()
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [filteredEvents, setFilteredEvents] = useState(events)

  // Filter events based on subscriptions and selected group
  useEffect(() => {
    const subscribedGroups = preferences.subscribedGroups
    const notInterestedEvents = preferences.notInterestedEvents

    let filtered = events.filter((event) => {
      // Filter out events the user is not interested in
      if (notInterestedEvents.includes(event.id)) return false

      // Otherwise, only include events from subscribed groups
      return subscribedGroups.includes(event.groupId)
    })

    // Further filter by selected group if not "all"
    if (selectedGroup !== "all") {
      filtered = filtered.filter((event) => event.groupId === selectedGroup)
    }

    // Sort by start time (upcoming first)
    filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    setFilteredEvents(filtered)
  }, [preferences, selectedGroup])

  // Get subscribed groups for the dropdown
  const subscribedGroups = groups.filter((group) => preferences.subscribedGroups.includes(group.id))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container py-6 space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Commune</h1>
        <p className="text-muted-foreground">Your hub for Irvine Valley College events and activities.</p>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Feed</h2>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {subscribedGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium">No events in your feed</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {selectedGroup === "all" ? "Subscribe to groups to see their events here" : "No events from this group"}
            </p>
            <Link href="/explore">
              <Button variant="outline">Browse Groups</Button>
            </Link>
          </div>
        ) : (
          <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        )}
      </section>

      <section className="space-y-4 border rounded-lg p-6 bg-muted/30">
        <h2 className="text-xl font-semibold">Discover More</h2>
        <p className="text-muted-foreground">
          Explore clubs, academic programs, cultural events, and more happening around campus.
        </p>
        <Link href="/explore">
          <Button className="w-full sm:w-auto mt-2 group">
            Explore Groups
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>
    </div>
  )
}

