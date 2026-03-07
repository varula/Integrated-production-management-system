"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useFactory } from "@/lib/factory-context"
import { factories, type FactoryDef } from "@/lib/factories"
import {
  LayoutDashboard,
  ShoppingBag,
  Scissors,
  Cpu,
  CheckSquare,
  Package,
  Ship,
  Warehouse,
  Users,
  Wrench,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Shirt,
  ClipboardList,
  Building2,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null },
  {
    label: "Orders", icon: ShoppingBag, badge: "12",
    children: [
      { label: "All Orders",      href: "/orders",           icon: ClipboardList },
      { label: "Order Tracking",  href: "/orders/tracking",  icon: BarChart3     },
    ],
  },
  {
    label: "Cutting", icon: Scissors, badge: null,
    children: [
      { label: "Cutting Plans",   href: "/cutting",                icon: ClipboardList },
      { label: "Fabric Issued",   href: "/cutting/fabric-issued",  icon: Warehouse     },
    ],
  },
  { label: "Sewing Lines", href: "/sewing", icon: Cpu, badge: "2", badgeVariant: "destructive" as const },
  {
    label: "Quality Control", icon: CheckSquare, badge: "3", badgeVariant: "destructive" as const,
    children: [
      { label: "Inline QC",        href: "/quality",          icon: CheckSquare   },
      { label: "Defect Analysis",  href: "/quality/defects",  icon: BarChart3     },
      { label: "AQL Inspection",   href: "/quality/aql",      icon: ClipboardList },
    ],
  },
  { label: "Finishing",    href: "/finishing",  icon: Shirt,       badge: null },
  {
    label: "Inventory", icon: Warehouse, badge: null,
    children: [
      { label: "Fabric Store",  href: "/inventory",        icon: Warehouse },
      { label: "Trim Store",    href: "/inventory/trims",  icon: Package   },
    ],
  },
  { label: "Shipment",     href: "/shipment",   icon: Ship,        badge: null },
  { label: "HR & Workforce",href: "/hr",        icon: Users,       badge: null },
  { label: "Machines",     href: "/machines",   icon: Wrench,      badge: "2", badgeVariant: "destructive" as const },
  { label: "Reports",      href: "/reports",    icon: BarChart3,   badge: null },
]

// ── Factory Switcher Dropdown ───────────────────────────────────────────────
function FactorySwitcher() {
  const { active, setActive, all } = useFactory()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-md bg-sidebar-accent/60 hover:bg-sidebar-accent transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span className="flex-1 text-left text-sidebar-foreground/85 text-xs font-semibold truncate">{active.name}</span>
        <ChevronDown size={13} className={cn("text-sidebar-foreground/50 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-full z-50 bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
          {all.map((f) => {
            const isActive = f.id === active.id
            return (
              <button
                key={f.id}
                onClick={() => { setActive(f); setOpen(false) }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors",
                  isActive && "bg-muted/40"
                )}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: f.avatarHex }}
                >
                  {f.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{f.address}</p>
                </div>
                {isActive && <Check size={13} className="text-primary shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Live Clock ────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1 border border-border">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-xs font-mono font-semibold text-foreground tabular-nums">{time}</span>
      <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Live</span>
    </div>
  )
}

// ── Nav Item ────────────────────────────────────────────────────────────────
type NavItemType = typeof navItems[0]
interface NavItemProps {
  item: NavItemType
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

function NavItem({ item, isOpen, onToggle, onClose }: NavItemProps) {
  const pathname = usePathname()
  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon

  const isActive = hasChildren
    ? item.children?.some((c) => c.href === pathname)
    : item.href === pathname

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          )}
        >
          <Icon size={17} className="shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <Badge
              variant={(item.badgeVariant === "destructive" ? "destructive" : "secondary")}
              className="h-4 min-w-4 px-1 text-[9px]"
            >
              {item.badge}
            </Badge>
          )}
          {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {isOpen && (
          <div className="mt-0.5 ml-4 pl-3.5 border-l border-sidebar-border space-y-0.5">
            {item.children?.map((child) => {
              const ChildIcon = child.icon
              const childActive = pathname === child.href
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors",
                    childActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <ChildIcon size={14} className="shrink-0" />
                  {child.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon size={17} className="shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge
          variant={(item.badgeVariant === "destructive" ? "destructive" : "secondary")}
          className="h-4 min-w-4 px-1 text-[9px]"
        >
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

// ── Sidebar ─────────────────────────────────────────────────────────────────
export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navItems.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((c) => c.href === pathname)
        if (isActive) initial[item.label] = true
      }
    })
    return initial
  })

  const toggle = (label: string) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <aside className="flex flex-col h-full bg-sidebar w-64 shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        {/* AG logo block */}
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0 text-white font-black text-base tracking-tight">
          AG
        </div>
        {/* Brand text */}
        <div className="flex flex-col min-w-0">
          <p className="text-sidebar-foreground font-bold leading-tight truncate" style={{ fontSize: "15.5px", letterSpacing: "-0.02em" }}>
            Armana Group
          </p>
          <p className="text-sidebar-foreground/45 truncate" style={{ fontSize: "10px" }}>
            Ashulia, Dhaka, Bangladesh
          </p>
          <p className="font-semibold truncate" style={{ fontSize: "10px", color: "oklch(0.6 0.18 250)" }}>
            Integrated Production Management System
          </p>
        </div>
      </div>

      {/* Factory Switcher */}
      <div className="px-3 py-2.5 border-b border-sidebar-border">
        <p className="text-[9px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold px-1 mb-1.5">Switch Factory</p>
        <FactorySwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isOpen={!!openMenus[item.label]}
            onToggle={() => toggle(item.label)}
            onClose={onClose ?? (() => {})}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings size={15} />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

// ── App Layout ───────────────────────────────────────────────────────────────
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { active } = useFactory()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const currentPage = navItems
    .flatMap((item) => (item.children ? item.children : [item]))
    .find((item) => "href" in item && item.href === pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex h-full w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 h-16 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
          {/* Left: hamburger + factory header */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors shrink-0"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 size={18} className="text-primary shrink-0" />
              <div className="min-w-0">
                {/* Factory name — changes on switch */}
                <h1 className="font-bold text-foreground leading-tight truncate" style={{ fontSize: "15.5px", letterSpacing: "-0.01em" }}>
                  {active.name}
                </h1>
                {/* Address line */}
                <p className="text-muted-foreground leading-tight truncate" style={{ fontSize: "10px" }}>
                  {active.address}
                </p>
                {/* System label */}
                <p className="font-semibold leading-tight" style={{ fontSize: "10px", color: "oklch(0.52 0.18 250)" }}>
                  Integrated Production Management System
                </p>
              </div>
            </div>
          </div>

          {/* Right: clock + page title + alerts + user */}
          <div className="flex items-center gap-3 shrink-0">
            <LiveClock />

            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-foreground">{currentPage?.label ?? "Dashboard"}</p>
              <p className="text-[10px] text-muted-foreground">08:00 AM – 07:00 PM &bull; Mar 7, 2026</p>
            </div>

            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </button>

            {/* User avatar — changes with factory */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all"
                style={{ backgroundColor: active.avatarHex }}
              >
                {active.initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold leading-tight">{active.userName}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{active.userRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
