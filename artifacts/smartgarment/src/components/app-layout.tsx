import { useState, useEffect } from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { useFactory } from "@/lib/factory-context"
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
  ChevronDownCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    icon: Cpu,
    badge: "2",
    badgeVariant: "destructive" as const,
    children: [
      { label: "Line Dashboard", href: "/sewing", icon: BarChart3 },
      { label: "Hourly Entry", href: "/sewing/hourly-entry", icon: ClipboardList },
    ],
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
  const [pathname] = useLocation()
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
  const [pathname] = useLocation()
  const { selectedFactory, factories, setSelectedFactory } = useFactory()
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
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Factory size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sidebar-foreground font-bold text-sm leading-tight truncate">Tracker - Armana</p>
          <p className="text-sidebar-foreground/50 text-xs truncate">Track. Analyze. Improve.</p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md bg-sidebar-accent/60 hover:bg-sidebar-accent transition-colors group">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0", selectedFactory?.userColor)}>
                {selectedFactory?.userInitial}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sidebar-foreground font-medium text-xs truncate">{selectedFactory?.userFull}</p>
                <p className="text-sidebar-foreground/50 text-[9px] truncate">{selectedFactory?.location}</p>
              </div>
              <ChevronDownCircle size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {factories.map((factory) => (
              <DropdownMenuItem
                key={factory.id}
                onClick={() => {
                  setSelectedFactory(factory)
                  onClose?.()
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={cn("w-2 h-2 rounded-full", factory.code === selectedFactory?.code ? "bg-green-400" : "bg-gray-300")} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{factory.userFull}</p>
                  <p className="text-[10px] text-muted-foreground">{factory.location}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

function LiveClock() {
  const [time, setTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return <span className="text-xs text-muted-foreground">--:--:--</span>

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs tabular-nums text-foreground font-medium">{time}</span>
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Live
      </span>
    </div>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pathname] = useLocation()
  const { selectedFactory } = useFactory()

  const currentPage = navItems
    .flatMap((item) => (item.children ? item.children : [item]))
    .find((item) => "href" in item && item.href === pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>

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

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="shrink-0 border-b border-border bg-card px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-foreground">{currentPage?.label ?? "Tracker - Armana"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LiveClock />
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
