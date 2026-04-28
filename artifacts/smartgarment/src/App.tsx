import { Switch, Route, Router as WouterRouter } from "wouter"
import { FactoryProvider } from "@/lib/factory-context"
import DashboardPage from "@/pages/DashboardPage"
import OrdersPage from "@/pages/OrdersPage"
import OrderTrackingPage from "@/pages/OrderTrackingPage"
import SewingPage from "@/pages/SewingPage"
import HourlyEntryPage from "@/pages/HourlyEntryPage"
import QualityPage from "@/pages/QualityPage"
import DefectsPage from "@/pages/DefectsPage"
import AQLPage from "@/pages/AQLPage"
import CuttingPage from "@/pages/CuttingPage"
import FabricIssuedPage from "@/pages/FabricIssuedPage"
import FinishingPage from "@/pages/FinishingPage"
import InventoryPage from "@/pages/InventoryPage"
import TrimsPage from "@/pages/TrimsPage"
import HRPage from "@/pages/HRPage"
import MachinesPage from "@/pages/MachinesPage"
import ShipmentPage from "@/pages/ShipmentPage"
import ReportsPage from "@/pages/ReportsPage"
import SettingsPage from "@/pages/SettingsPage"
import NotFoundPage from "@/pages/NotFoundPage"

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/orders/tracking" component={OrderTrackingPage} />
      <Route path="/cutting" component={CuttingPage} />
      <Route path="/cutting/fabric-issued" component={FabricIssuedPage} />
      <Route path="/sewing" component={SewingPage} />
      <Route path="/sewing/hourly-entry" component={HourlyEntryPage} />
      <Route path="/quality" component={QualityPage} />
      <Route path="/quality/defects" component={DefectsPage} />
      <Route path="/quality/aql" component={AQLPage} />
      <Route path="/finishing" component={FinishingPage} />
      <Route path="/inventory" component={InventoryPage} />
      <Route path="/inventory/trims" component={TrimsPage} />
      <Route path="/shipment" component={ShipmentPage} />
      <Route path="/hr" component={HRPage} />
      <Route path="/machines" component={MachinesPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}

function App() {
  return (
    <FactoryProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </FactoryProvider>
  )
}

export default App
