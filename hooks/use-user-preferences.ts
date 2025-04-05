"use client"

import { useLocalStorage } from "./use-local-storage"
import type { UserPreferences } from "@/lib/types"
import { useToast } from "./use-toast"

const defaultPreferences: UserPreferences = {
  subscribedGroups: ["group8", "group5", "group12"], // Default subscriptions
  interestedEvents: [],
  notInterestedEvents: [],
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>("userPreferences", defaultPreferences)
  const { toast } = useToast()

  // Subscribe to a group
  const subscribeToGroup = (groupId: string, groupName: string) => {
    if (!preferences.subscribedGroups.includes(groupId)) {
      setPreferences({
        ...preferences,
        subscribedGroups: [...preferences.subscribedGroups, groupId],
      })

      toast({
        title: "Subscribed!",
        description: `You'll receive updates from ${groupName}`,
        duration: 3000,
      })
    }
  }

  // Unsubscribe from a group
  const unsubscribeFromGroup = (groupId: string, groupName: string) => {
    setPreferences({
      ...preferences,
      subscribedGroups: preferences.subscribedGroups.filter((id) => id !== groupId),
    })

    toast({
      title: "Unsubscribed",
      description: `You've unsubscribed from ${groupName}`,
      duration: 3000,
    })
  }

  // Toggle event interest
  const toggleEventInterest = (eventId: string, eventTitle: string) => {
    // If already not interested, remove from not interested
    if (preferences.notInterestedEvents.includes(eventId)) {
      setPreferences({
        ...preferences,
        notInterestedEvents: preferences.notInterestedEvents.filter((id) => id !== eventId),
      })

      toast({
        title: "Event Restored",
        description: `${eventTitle} will now appear in your feed`,
        duration: 3000,
      })
    }
    // Otherwise mark as not interested
    else {
      setPreferences({
        ...preferences,
        notInterestedEvents: [...preferences.notInterestedEvents, eventId],
        interestedEvents: preferences.interestedEvents.filter((id) => id !== eventId),
      })

      toast({
        title: "Not Interested",
        description: `${eventTitle} won't appear in your feed`,
        duration: 3000,
      })
    }
  }

  // Check if user is subscribed to a group
  const isSubscribedToGroup = (groupId: string) => {
    return preferences.subscribedGroups.includes(groupId)
  }

  // Check if user is not interested in an event
  const isNotInterestedInEvent = (eventId: string) => {
    return preferences.notInterestedEvents.includes(eventId)
  }

  return {
    preferences,
    subscribeToGroup,
    unsubscribeFromGroup,
    toggleEventInterest,
    isSubscribedToGroup,
    isNotInterestedInEvent,
  }
}

