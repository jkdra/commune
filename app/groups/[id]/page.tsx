"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { groups, events } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Globe, Calendar } from "lucide-react"
import EventCard from "@/components/event-card"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function GroupPage() {
  const params = useParams()
  const groupId = params.id as string
  const group = groups.find((group) => group.id === groupId)

  const { isSubscribedToGroup, subscribeToGroup, unsubscribeFromGroup } = useUserPreferences()
  const isSubscribed = group ? isSubscribedToGroup(group.id) : false

  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  // Get events for this group
  const groupEvents = events.filter((event) => event.groupId === groupId)

  // Split events into upcoming and past
  const now = new Date()
  const upcomingEvents = groupEvents
    .filter((event) => new Date(event.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const pastEvents = groupEvents
    .filter((event) => new Date(event.endTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const handleSubscribeToggle = () => {
    if (!group) return

    if (isSubscribed) {
      setShowUnsubscribeConfirm(true)
    } else {
      subscribeToGroup(group.id, group.name)
    }
  }

  const confirmUnsubscribe = () => {
    if (!group) return

    unsubscribeFromGroup(group.id, group.name)
    setShowUnsubscribeConfirm(false)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (!group) {
    return (
      <div className="container py-6 space-y-8 max-w-3xl">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Group not found</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-8 max-w-3xl">
      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{group.categoryName}</Badge>
            </div>
          </div>
          <Button variant={isSubscribed ? "outline" : "default"} onClick={handleSubscribeToggle}>
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </div>

        <p className="text-muted-foreground">{group.description}</p>

        <div className="flex flex-col gap-2">
          {group.contactEmail && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2" />
              <span>{group.contactEmail}</span>
            </div>
          )}
          {group.websiteUrl && (
            <div className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2" />
              <a
                href={group.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {group.websiteUrl}
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Events</h2>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <h3 className="text-lg font-medium">No upcoming events</h3>
                <p className="text-muted-foreground mt-2">Check back later for new events</p>
              </div>
            ) : (
              <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} hideWhenNotInterested={false} />
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            {pastEvents.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <h3 className="text-lg font-medium">No past events</h3>
              </div>
            ) : (
              <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} hideWhenNotInterested={false} />
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog open={showUnsubscribeConfirm} onOpenChange={setShowUnsubscribeConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Unsubscribe</DialogTitle>
            <p className="mt-2">
              Are you sure you want to unsubscribe from "{group.name}"? You will no longer receive updates about their
              events.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnsubscribeConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnsubscribe}>
              Unsubscribe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

