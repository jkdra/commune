"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import { events } from "@/lib/data"
import type { Event } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, MapPin, Bell, BellOff } from "lucide-react"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import Link from "next/link"

// Universal events for all students
const universalEvents = [
  {
    id: "universal1",
    title: "Spring Break",
    description: "No classes during Spring Break. Campus services may have limited hours.",
    startTime: "2025-04-07T00:00:00",
    endTime: "2025-04-13T23:59:59",
    location: "Irvine Valley College",
    groupId: "academic",
    groupName: "IVC Administration",
    categoryId: "academic",
    categoryName: "Academic Calendar",
    additionalInfo: "Classes resume on April 14, 2025.",
  },
  {
    id: "universal2",
    title: "Final Exams Week",
    description: "Final examinations for Spring 2025 semester.",
    startTime: "2025-05-15T00:00:00",
    endTime: "2025-05-20T23:59:59",
    location: "Irvine Valley College",
    groupId: "academic",
    groupName: "IVC Administration",
    categoryId: "academic",
    categoryName: "Academic Calendar",
    additionalInfo: "Check with your instructors for specific exam times and locations.",
  },
  {
    id: "universal3",
    title: "Spring Semester Ends",
    description: "Last day of the Spring 2025 semester.",
    startTime: "2025-05-21T00:00:00",
    endTime: "2025-05-21T23:59:59",
    location: "Irvine Valley College",
    groupId: "academic",
    groupName: "IVC Administration",
    categoryId: "academic",
    categoryName: "Academic Calendar",
    additionalInfo: "Grades will be posted within one week after the end of the semester.",
  },
]

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showNotInterestedConfirm, setShowNotInterestedConfirm] = useState(false)

  const { preferences, toggleEventInterest, isNotInterestedInEvent } = useUserPreferences()

  // Filter events based on subscriptions and interest
  const filteredEvents = events.filter((event) => {
    // Include events from subscribed groups
    const isFromSubscribedGroup = preferences.subscribedGroups.includes(event.groupId)

    // Exclude events the user is not interested in
    const isNotInterested = preferences.notInterestedEvents.includes(event.id)

    return isFromSubscribedGroup && !isNotInterested
  })

  // Combine filtered events with universal events
  const allEvents = [...filteredEvents, ...universalEvents]

  // Get events for the selected date
  const eventsForDate = date
    ? allEvents.filter((event) => {
        const startDate = new Date(event.startTime)
        const endDate = new Date(event.endTime)

        // Check if the selected date falls within the event's duration
        return (date >= startDate && date <= endDate) || isSameDay(startDate, date)
      })
    : []

  // Function to get events for a specific date (used for calendar decoration)
  const getDayEvents = (day: Date) => {
    return allEvents.filter((event) => {
      const startDate = new Date(event.startTime)
      const endDate = new Date(event.endTime)

      // Check if the day falls within the event's duration
      return (day >= startDate && day <= endDate) || isSameDay(startDate, day)
    })
  }

  const handleInterestToggle = () => {
    if (!selectedEvent) return

    if (isNotInterestedInEvent(selectedEvent.id)) {
      toggleEventInterest(selectedEvent.id, selectedEvent.title)
    } else {
      setShowNotInterestedConfirm(true)
    }
  }

  const confirmNotInterested = () => {
    if (!selectedEvent) return

    toggleEventInterest(selectedEvent.id, selectedEvent.title)
    setShowNotInterestedConfirm(false)
  }

  return (
    <div className="container py-6 space-y-8 max-w-6xl">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
        <p className="text-muted-foreground max-w-3xl">View all upcoming events in a calendar format.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => getDayEvents(date).length > 0,
              }}
              modifiersStyles={{
                hasEvents: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  textDecorationColor: "var(--primary)",
                  textDecorationThickness: "2px",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{date ? <>Events for {format(date, "MMMM d, yyyy")}</> : <>Select a date</>}</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForDate.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No events on this date</h3>
                <p className="text-muted-foreground mt-2">Try selecting a different date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsForDate.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    <Badge>{event.categoryName}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          open={!!selectedEvent}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedEvent(null)
              setShowNotInterestedConfirm(false)
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{selectedEvent.categoryName}</Badge>
                <span className="text-sm text-muted-foreground">
                  By{" "}
                  <Link href={`/groups/${selectedEvent.groupId}`} className="text-primary hover:underline">
                    {selectedEvent.groupName}
                  </Link>
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Start: {format(new Date(selectedEvent.startTime), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      End: {format(new Date(selectedEvent.endTime), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>

              {selectedEvent.additionalInfo && (
                <div>
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <p className="text-sm">{selectedEvent.additionalInfo}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant={isNotInterestedInEvent(selectedEvent.id) ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={handleInterestToggle}
                >
                  {isNotInterestedInEvent(selectedEvent.id) ? (
                    <>
                      <Bell className="h-4 w-4" />
                      Interested
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4" />
                      Not Interested
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Not Interested Confirmation Dialog */}
      <Dialog open={showNotInterestedConfirm} onOpenChange={setShowNotInterestedConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hide this event?</DialogTitle>
            <DialogDescription>
              This event will be hidden from your feed. You can still find it on the group's page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotInterestedConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmNotInterested}>
              Hide Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

