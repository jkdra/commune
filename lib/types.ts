export interface Event {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  groupId: string
  groupName: string
  categoryId: string
  categoryName: string
  additionalInfo?: string
}

export interface Category {
  id: string
  name: string
}

export interface Group {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  logoUrl?: string
  websiteUrl?: string
  contactEmail?: string
}

export interface UserPreferences {
  subscribedGroups: string[]
  interestedEvents: string[]
  notInterestedEvents: string[]
}

