// Factory switcher configuration — all denim pant factories under Armana Group

export interface FactoryConfig {
  id: string
  name: string
  shortName: string
  address: string
  city: string
  user: string
  initials: string
  avatarColor: string // tailwind bg class
  avatarTextColor: string // tailwind text class
  totalLines: number
  activeLines: number
  totalWorkers: number
  workingHours: string
  date: string
}

export const factories: FactoryConfig[] = [
  {
    id: "armana",
    name: "Armana Apparels Ltd.",
    shortName: "Armana",
    address: "Ashulia, Savar, Dhaka",
    city: "Savar, Dhaka",
    user: "Dhanaperumal",
    initials: "DP",
    avatarColor: "bg-emerald-600",
    avatarTextColor: "text-white",
    totalLines: 16,
    activeLines: 12,
    totalWorkers: 680,
    workingHours: "08:00 AM – 07:00 PM",
    date: "March 7, 2026",
  },
  {
    id: "zyta",
    name: "Zyta Apparels Ltd.",
    shortName: "Zyta",
    address: "Mirpur DOHS, Dhaka",
    city: "Mirpur, Dhaka",
    user: "Abhiram",
    initials: "AB",
    avatarColor: "bg-blue-600",
    avatarTextColor: "text-white",
    totalLines: 14,
    activeLines: 11,
    totalWorkers: 590,
    workingHours: "08:00 AM – 07:00 PM",
    date: "March 7, 2026",
  },
  {
    id: "denimach",
    name: "Denimach Ltd.",
    shortName: "Denimach",
    address: "Tongi I/A, Gazipur",
    city: "Gazipur",
    user: "Mallikarjun",
    initials: "MK",
    avatarColor: "bg-purple-600",
    avatarTextColor: "text-white",
    totalLines: 18,
    activeLines: 15,
    totalWorkers: 820,
    workingHours: "08:00 AM – 07:00 PM",
    date: "March 7, 2026",
  },
  {
    id: "denitex",
    name: "Denitex Ltd.",
    shortName: "Denitex",
    address: "EPZ Road, Savar, Dhaka",
    city: "Savar, Dhaka",
    user: "Vishwa",
    initials: "VS",
    avatarColor: "bg-amber-500",
    avatarTextColor: "text-white",
    totalLines: 12,
    activeLines: 10,
    totalWorkers: 510,
    workingHours: "08:00 AM – 07:00 PM",
    date: "March 7, 2026",
  },
]

export const defaultFactory = factories[0]
