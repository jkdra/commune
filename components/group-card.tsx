"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Group } from "@/lib/types"
import { motion } from "framer-motion"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function GroupCard({ group }: { group: Group }) {
  const { isSubscribedToGroup, subscribeToGroup, unsubscribeFromGroup } = useUserPreferences()
  const isSubscribed = isSubscribedToGroup(group.id)
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false)

  const handleSubscribeToggle = () => {
    if (isSubscribed) {
      setShowUnsubscribeConfirm(true)
    } else {
      subscribeToGroup(group.id, group.name)
    }
  }

  const confirmUnsubscribe = () => {
    unsubscribeFromGroup(group.id, group.name)
    setShowUnsubscribeConfirm(false)
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <>
      <motion.div variants={item}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-2">{group.name}</CardTitle>
              <Badge variant="outline">{group.categoryName}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="line-clamp-3 text-sm">{group.description}</p>
            {group.contactEmail && (
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Mail className="h-4 w-4 mr-1" />
                <span>{group.contactEmail}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex justify-between w-full">
              <Link href={`/groups/${group.id}`}>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </Link>
              <Button variant={isSubscribed ? "outline" : "default"} size="sm" onClick={handleSubscribeToggle}>
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

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
    </>
  )
}

