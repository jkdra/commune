"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, BellOff, Bell } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Event } from "@/lib/types"
import { motion } from "framer-motion"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EventCardProps {
  event: Event
  hideWhenNotInterested?: boolean // Only hide on feed pages, not on group pages
}

export default function EventCard({ event, hideWhenNotInterested = true }: EventCardProps) {
  const { isSubscribedToGroup, isNotInterestedInEvent, toggleEventInterest } = useUserPreferences()

  const isSubscribed = isSubscribedToGroup(event.groupId)
  const isNotInterested = isNotInterestedInEvent(event.id)

  const [showDetails, setShowDetails] = useState(false)
  const [showNotInterestedConfirm, setShowNotInterestedConfirm] = useState(false)

  const now = new Date()
  const isUpcoming = new Date(event.startTime) > now
  const isOngoing = new Date(event.startTime) <= now && new Date(event.endTime) >= now

  const handleInterestToggle = () => {
    if (isNotInterested) {
      toggleEventInterest(event.id, event.title)
    } else {
      setShowNotInterestedConfirm(true)
    }
  }

  const confirmNotInterested = () => {
    toggleEventInterest(event.id, event.title)
    setShowNotInterestedConfirm(false)
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // If the event is marked as not interested and we're not showing details and hideWhenNotInterested is true, don't render
  if (isNotInterested && !showDetails && hideWhenNotInterested) {
    return null
  }

  return (
    <>
      <motion.div variants={item}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-2">{event.title}</CardTitle>
              <Badge
                variant={isOngoing ? "default" : "outline"}
                className={isOngoing ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {isOngoing ? "Ongoing" : event.categoryName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {isUpcoming ? (
                  <span>Starts {format(new Date(event.startTime), "MMM d, h:mm a")}</span>
                ) : isOngoing ? (
                  <span>Ends {format(new Date(event.endTime), "MMM d, h:mm a")}</span>
                ) : (
                  <span>Ended {format(new Date(event.endTime), "MMM d, h:mm a")}</span>
                )}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <span>By </span>
                <Link href={`/groups/${event.groupId}`} className="ml-1 text-primary hover:underline">
                  {event.groupName}
                </Link>
              </div>
              <p className="line-clamp-2 mt-2">{event.description}</p>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex justify-between w-full">
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)}>
                View More
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isNotInterested ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleInterestToggle}
                    >
                      {isNotInterested ? (
                        <>
                          <Bell className="h-4 w-4" />
                          <span className="hidden sm:inline">Interested</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4" />
                          <span className="hidden sm:inline">Not Interested</span>
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isNotInterested ? "Show in feed" : "Hide from feed"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Event Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={isOngoing ? "default" : "outline"} className={isOngoing ? "bg-green-500" : ""}>
                {isOngoing ? "Ongoing" : event.categoryName}
              </Badge>
              <span className="text-sm text-muted-foreground">
                By{" "}
                <Link href={`/groups/${event.groupId}`} className="text-primary hover:underline">
                  {event.groupName}
                </Link>
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm">Start: {format(new Date(event.startTime), "MMM d, yyyy h:mm a")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="text-sm">End: {format(new Date(event.endTime), "MMM d, yyyy h:mm a")}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm">{event.description}</p>
            </div>

            {event.additionalInfo && (
              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                <p className="text-sm">{event.additionalInfo}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant={isNotInterested ? "default" : "outline"}
                onClick={handleInterestToggle}
                className="flex items-center gap-2"
              >
                {isNotInterested ? (
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
    </>
  )
}

