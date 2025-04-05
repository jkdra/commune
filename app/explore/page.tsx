"use client"

import { useState } from "react"
import { categories, groups } from "@/lib/data"
import GroupCard from "@/components/group-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredGroups = groups.filter((group) => {
    // Filter by category if not "all"
    const categoryMatch = activeCategory === "all" || group.categoryId === activeCategory

    // Filter by search query
    const searchMatch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

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
        <h1 className="text-3xl font-bold tracking-tight">Explore Groups</h1>
        <p className="text-muted-foreground">
          Discover and subscribe to clubs, departments, and groups at Irvine Valley College.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No groups found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredGroups.map((group) => (
            <motion.div key={group.id} variants={container} initial="hidden" animate="show">
              <GroupCard group={group} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

