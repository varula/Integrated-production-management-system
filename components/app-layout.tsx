"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { factory } from "@/lib/data"
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
  Factory,
  Shirt,
  ClipboardList,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    badge: "10",
    children: [
      { label: "All Orders", href: "/orders", icon: ClipboardList },
      { label: "Order Tracking", href: "/orders/tracking", icon: BarChart3 },
    ],
  },
  {
    label: "Cutting",
    icon: Scissors,
    badge: null,
    children: [
      { label: "Cutting Plans", href: "/cutting", icon: ClipboardList },
      { label: "Fabric Issued", href: "/cutting/fabric-issued", icon: Warehouse },
    ],
  },
  {
    label: "Sewing Lines",
    href: "/sewing",
    icon: Cpu,
    badge: "2",
    badgeVariant: "destructive" as const,
  },
  {
    label: "Quality Control",
    icon: CheckSquare,
    badge: "3",
    badgeVariant: "destructive" as const,
    children: [
      { label: "Inline QC", href: "/quality", icon: CheckSquare },
      { label: "Defect Analysis", href: "/quality/defects", icon: BarChart3 },
      { label: "AQL Inspection", href: "/quality/aql", icon: ClipboardList },
    ],
  },
  {
    label: "Finishing",
    href: "/finishing",
    icon: Shirt,
    badge: null,
  },
  {
    label: "Inventory",
    icon: Warehouse,
    badge: null,
    children: [
      { label: "Fabric Store", href: "/inventory", icon: Warehouse },
      { label: "Trim Store", href: "/inventory/trims", icon: Package },
    ],
  },
  {
    label: "Shipment",
    href: "/shipment",
    icon: Ship,
    badge: null,
  },
  {
    label: "HR & Workforce",
    href: "/hr",
    icon: Users,
    badge: null,
  },
  {
    label: "Machines",
    href: "/machines",
    icon: Wrench,
    badge: "2",
    badgeVariant: "destructive" as const,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    badge: null,
  },
]

interface NavItemProps {
  item: typeof navItems[0]
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
          <Icon size={18} className="shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <Badge
              variant={item.badgeVariant === "destructive" ? "destructive" : "secondary"}
              className="h-5 min-w-5 px-1.5 text-[10px]"
            >
              {item.badge}
            </Badge>
          )}
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {isOpen && (
          <div className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-0.5">
            {item.children?.map((child) => {
              const ChildIcon = child.icon
              const childActive = pathname === child.href
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors",
                    childActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <ChildIcon size={15} className="shrink-0" />
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
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge
          variant={item.badgeVariant === "destructive" ? "destructive" : "secondary"}
          className="h-5 min-w-5 px-1.5 text-[10px]"
        >
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

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

  const toggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="flex flex-col h-full bg-sidebar w-64 shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Factory size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sidebar-foreground font-bold text-sm leading-tight truncate">SmartGarment</p>
          <p className="text-sidebar-foreground/50 text-xs truncate">{factory.location}</p>
        </div>
      </div>

      {/* Factory badge */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent/60">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-sidebar-foreground/80 text-xs truncate font-medium">{factory.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isOpen={!!openMenus[item.label]}
            onToggle={() => toggle(item.label)}
            onClose={onClose || (() => {})}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
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
        <header className="shrink-0 h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">{currentPage?.label ?? "SmartGarment"}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{factory.shift} &bull; {factory.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                PM
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-tight">Production Mgr.</p>
                <p className="text-xs text-muted-foreground leading-tight">Admin</p>
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
