// Factory definitions — 4 denim pant factories with their users and locations

export interface FactoryDef {
  id: string
  name: string
  shortName: string
  address: string
  initials: string         // avatar initials
  avatarColor: string      // tailwind bg class
  avatarHex: string        // hex for inline style fallback
  userName: string
  userRole: string
  totalLines: number
  totalWorkers: number
}

export const factories: FactoryDef[] = [
  {
    id: "armana",
    name: "Armana Apparels",
    shortName: "Armana Apparels",
    address: "Ashulia, Dhaka, Bangladesh",
    initials: "DP",
    avatarColor: "bg-emerald-600",
    avatarHex: "#059669",
    userName: "Dhanaperumal",
    userRole: "Production Manager",
    totalLines: 16,
    totalWorkers: 648,
  },
  {
    id: "zyta",
    name: "Zyta Apparels",
    shortName: "Zyta Apparels",
    address: "Mirpur, Dhaka, Bangladesh",
    initials: "AB",
    avatarColor: "bg-blue-600",
    avatarHex: "#2563EB",
    userName: "Abhiram",
    userRole: "Factory Manager",
    totalLines: 14,
    totalWorkers: 572,
  },
  {
    id: "denimach",
    name: "Denimach Ltd.",
    shortName: "Denimach Ltd.",
    address: "Gazipur, Bangladesh",
    initials: "MK",
    avatarColor: "bg-purple-600",
    avatarHex: "#7C3AED",
    userName: "Mallikarjun",
    userRole: "Operations Head",
    totalLines: 18,
    totalWorkers: 720,
  },
  {
    id: "denitex",
    name: "Denitex Ltd.",
    shortName: "Denitex Ltd.",
    address: "Savar, Dhaka, Bangladesh",
    initials: "VS",
    avatarColor: "bg-amber-600",
    avatarHex: "#D97706",
    userName: "Vishwa",
    userRole: "Plant Manager",
    totalLines: 12,
    totalWorkers: 490,
  },
]

export const defaultFactory = factories[0]
