"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { organizations, events } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Globe, Calendar } from "lucide-react"
import EventCard from "@/components/event-card"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function OrganizationPage() {
  const params = useParams()
  const organizationId = params.id as string
  const organization = organizations.find((org) => org.id === organizationId)

  const { isSubscribedToOrganization, subscribeToOrganization, unsubscribeFromOrganization } = useUserPreferences()
  const isSubscribed = organization ? isSubscribedToOrganization(organization.id) : false

  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  // Get events for this organization
  const organizationEvents = events.filter((event) => event.organizerId === organizationId)

  // Split events into upcoming and past
  const now = new Date()
  const upcomingEvents = organizationEvents
    .filter((event) => new Date(event.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const pastEvents = organizationEvents
    .filter((event) => new Date(event.endTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const handleSubscribeToggle = () => {
    if (!organization) return

    if (isSubscribed) {
      setShowUnsubscribeConfirm(true)
    } else {
      subscribeToOrganization(organization.id, organization.name)
    }
  }

  const confirmUnsubscribe = () => {
    if (!organization) return

    unsubscribeFromOrganization(organization.id, organization.name)
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

  if (!organization) {
    return (
      <div className="container py-6 space-y-8 max-w-3xl">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Organization not found</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-8 max-w-3xl">
      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{organization.categoryName}</Badge>
            </div>
          </div>
          <Button variant={isSubscribed ? "outline" : "default"} onClick={handleSubscribeToggle}>
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </div>

        <p className="text-muted-foreground">{organization.description}</p>

        <div className="flex flex-col gap-2">
          {organization.contactEmail && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2" />
              <span>{organization.contactEmail}</span>
            </div>
          )}
          {organization.websiteUrl && (
            <div className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2" />
              <a
                href={organization.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {organization.websiteUrl}
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
                  <EventCard key={event.id} event={event} />
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
                  <EventCard key={event.id} event={event} />
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
              Are you sure you want to unsubscribe from "{organization.name}"? You will no longer receive updates about
              their events.
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

