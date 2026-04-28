export const factory = {
  name: "Alpha Garment Industries",
  location: "Dhaka, Bangladesh",
  totalLines: 15,
  activeLines: 12,
  totalWorkers: 620,
  shift: "Morning Shift (07:00 - 16:00)",
  date: "March 7, 2026",
}

export const orders = [
  { id: "ORD-9921", buyer: "H&M Group", style: "Slim Fit Jeans", color: "Indigo Blue", size: "S-XXL", qty: 12000, shipped: 4200, balance: 7800, status: "In Production", shipDate: "2026-03-25", line: "L-01", smv: 14.2, priority: "High" },
  { id: "ORD-9934", buyer: "Zara", style: "Skinny Stretch Jeans", color: "Black", size: "XS-XL", qty: 8500, shipped: 0, balance: 8500, status: "In Production", shipDate: "2026-04-05", line: "L-02", smv: 13.8, priority: "High" },
  { id: "ORD-9945", buyer: "Gap Inc.", style: "Cargo Denim Pant", color: "Dark Wash", size: "28-38", qty: 15000, shipped: 2000, balance: 13000, status: "In Production", shipDate: "2026-04-12", line: "L-03", smv: 16.5, priority: "Medium" },
  { id: "ORD-9950", buyer: "Levi Strauss", style: "Jogger Denim", color: "Stone Washed", size: "S-XL", qty: 6000, shipped: 1500, balance: 4500, status: "In Production", shipDate: "2026-04-18", line: "L-04", smv: 12.4, priority: "Medium" },
  { id: "ORD-9962", buyer: "Tommy Hilfiger", style: "Straight Leg Jeans", color: "Light Blue", size: "30-36", qty: 9000, shipped: 0, balance: 9000, status: "Warning", shipDate: "2026-03-30", line: "L-05", smv: 15.0, priority: "Critical" },
  { id: "ORD-9971", buyer: "Calvin Klein", style: "Bootcut Denim", color: "Vintage Blue", size: "XS-XL", qty: 7200, shipped: 3000, balance: 4200, status: "In Production", shipDate: "2026-04-22", line: "L-06", smv: 14.8, priority: "Medium" },
  { id: "ORD-9922", buyer: "Ralph Lauren", style: "Relaxed Fit Jeans", color: "Classic Blue", size: "30-40", qty: 5500, shipped: 800, balance: 4700, status: "Warning", shipDate: "2026-04-02", line: "L-07", smv: 13.2, priority: "High" },
  { id: "ORD-9988", buyer: "Wrangler", style: "Tapered Fit Jeans", color: "Dark Indigo", size: "28-36", qty: 11000, shipped: 5000, balance: 6000, status: "On Track", shipDate: "2026-05-01", line: "L-08", smv: 13.9, priority: "Low" },
  { id: "ORD-9991", buyer: "Lee Jeans", style: "Wide Leg Denim", color: "Medium Wash", size: "24-34", qty: 4200, shipped: 0, balance: 4200, status: "Sampling", shipDate: "2026-05-15", line: "—", smv: 17.1, priority: "Low" },
  { id: "ORD-9994", buyer: "Primark", style: "Mom Jeans", color: "Light Vintage", size: "XS-XL", qty: 18000, shipped: 0, balance: 18000, status: "PP Inspection", shipDate: "2026-05-20", line: "—", smv: 14.6, priority: "Medium" },
]

export const sewingLines = [
  { line: "L-01", order: "ORD-9921", style: "Slim Fit Jeans", status: "RUNNING", efficiency: 82.5, actual: 330, target: 400, operators: 42, machines: 40, downtime: 0, alerts: 0, supervisor: "Karim Rahman" },
  { line: "L-02", order: "ORD-9934", style: "Skinny Stretch Jeans", status: "RUNNING", efficiency: 78.1, actual: 275, target: 350, operators: 38, machines: 36, downtime: 15, alerts: 1, supervisor: "Nusrat Islam" },
  { line: "L-03", order: "ORD-9945", style: "Cargo Denim Pant", status: "WARNING", efficiency: 65.4, actual: 275, target: 420, operators: 45, machines: 42, downtime: 45, alerts: 3, supervisor: "Farhan Ahmed" },
  { line: "L-04", order: "ORD-9950", style: "Jogger Denim", status: "RUNNING", efficiency: 88.9, actual: 338, target: 380, operators: 40, machines: 38, downtime: 0, alerts: 0, supervisor: "Sabrina Akter" },
  { line: "L-05", order: "ORD-9962", style: "Straight Leg Jeans", status: "DOWN", efficiency: 45.2, actual: 180, target: 400, operators: 42, machines: 40, downtime: 120, alerts: 2, supervisor: "Jamal Hossain" },
  { line: "L-06", order: "ORD-9971", style: "Bootcut Denim", status: "RUNNING", efficiency: 79.5, actual: 278, target: 350, operators: 39, machines: 37, downtime: 10, alerts: 0, supervisor: "Rima Begum" },
  { line: "L-07", order: "ORD-9922", style: "Relaxed Fit Jeans", status: "WARNING", efficiency: 72.0, actual: 288, target: 400, operators: 41, machines: 39, downtime: 30, alerts: 1, supervisor: "Touhid Chowdhury" },
  { line: "L-08", order: "ORD-9988", style: "Tapered Fit Jeans", status: "RUNNING", efficiency: 85.3, actual: 307, target: 360, operators: 37, machines: 35, downtime: 5, alerts: 0, supervisor: "Mitu Khatun" },
  { line: "L-09", order: "ORD-9988", style: "Tapered Fit Jeans", status: "RUNNING", efficiency: 81.7, actual: 294, target: 360, operators: 38, machines: 36, downtime: 0, alerts: 0, supervisor: "Rafiq Ullah" },
  { line: "L-10", order: "ORD-9971", style: "Bootcut Denim", status: "RUNNING", efficiency: 76.4, actual: 267, target: 350, operators: 39, machines: 37, downtime: 20, alerts: 1, supervisor: "Parveen Sultana" },
  { line: "L-11", order: "ORD-9945", style: "Cargo Denim Pant", status: "RUNNING", efficiency: 80.2, actual: 337, target: 420, operators: 44, machines: 42, downtime: 0, alerts: 0, supervisor: "Bellal Hossain" },
  { line: "L-12", order: "ORD-9921", style: "Slim Fit Jeans", status: "RUNNING", efficiency: 84.0, actual: 336, target: 400, operators: 41, machines: 40, downtime: 0, alerts: 0, supervisor: "Sumaiya Akter" },
  { line: "L-13", order: "—", style: "Idle", status: "IDLE", efficiency: 0, actual: 0, target: 0, operators: 0, machines: 42, downtime: 0, alerts: 0, supervisor: "—" },
  { line: "L-14", order: "—", style: "Idle", status: "IDLE", efficiency: 0, actual: 0, target: 0, operators: 0, machines: 40, downtime: 0, alerts: 0, supervisor: "—" },
  { line: "L-15", order: "—", style: "Cleaning", status: "MAINTENANCE", efficiency: 0, actual: 0, target: 0, operators: 6, machines: 38, downtime: 240, alerts: 0, supervisor: "Maintenance Team" },
]

export const cuttingData = [
  { id: "CUT-001", order: "ORD-9921", style: "Slim Fit Jeans", fabric: "100% Cotton Denim 12oz", color: "Indigo Blue", plies: 80, layers: 80, cut: 6400, issued: 5800, balance: 600, table: "T-01", marker: "MKR-221", efficiency: 88.5, date: "2026-03-06", status: "Completed" },
  { id: "CUT-002", order: "ORD-9934", style: "Skinny Stretch Jeans", fabric: "98% Cotton 2% Spandex", color: "Black", plies: 100, layers: 100, cut: 8500, issued: 4000, balance: 4500, table: "T-02", marker: "MKR-222", efficiency: 91.2, date: "2026-03-07", status: "In Progress" },
  { id: "CUT-003", order: "ORD-9945", style: "Cargo Denim Pant", fabric: "100% Cotton Canvas 14oz", color: "Dark Wash", plies: 60, layers: 60, cut: 3600, issued: 2000, balance: 1600, table: "T-03", marker: "MKR-223", efficiency: 86.0, date: "2026-03-07", status: "In Progress" },
  { id: "CUT-004", order: "ORD-9950", style: "Jogger Denim", fabric: "Cotton Blend Stretch", color: "Stone Washed", plies: 120, layers: 120, cut: 6000, issued: 4500, balance: 1500, table: "T-04", marker: "MKR-224", efficiency: 93.5, date: "2026-03-05", status: "Completed" },
  { id: "CUT-005", order: "ORD-9962", style: "Straight Leg Jeans", fabric: "100% Cotton Denim 11oz", color: "Light Blue", plies: 90, layers: 90, cut: 4500, issued: 2000, balance: 2500, table: "T-01", marker: "MKR-225", efficiency: 87.3, date: "2026-03-07", status: "In Progress" },
  { id: "CUT-006", order: "ORD-9971", style: "Bootcut Denim", fabric: "Stretch Denim 10oz", color: "Vintage Blue", plies: 75, layers: 75, cut: 3750, issued: 3750, balance: 0, table: "T-02", marker: "MKR-226", efficiency: 90.1, date: "2026-03-04", status: "Completed" },
  { id: "CUT-007", order: "ORD-9922", style: "Relaxed Fit Jeans", fabric: "100% Cotton Denim 13oz", color: "Classic Blue", plies: 55, layers: 55, cut: 2750, issued: 2000, balance: 750, table: "T-03", marker: "MKR-227", efficiency: 84.8, date: "2026-03-07", status: "In Progress" },
  { id: "CUT-008", order: "ORD-9988", style: "Tapered Fit Jeans", fabric: "Premium Denim 12.5oz", color: "Dark Indigo", plies: 110, layers: 110, cut: 8800, issued: 7000, balance: 1800, table: "T-04", marker: "MKR-228", efficiency: 92.0, date: "2026-03-06", status: "Completed" },
]

export const fabricInventory = [
  { id: "FAB-001", name: "100% Cotton Denim 12oz", supplier: "Artistic Denim Mills", color: "Indigo Blue", inStock: 28500, reserved: 18000, available: 10500, unit: "meters", location: "W-A1", reorderPoint: 5000, status: "Adequate" },
  { id: "FAB-002", name: "98% Cotton 2% Spandex", supplier: "Bextex Ltd", color: "Black", inStock: 15000, reserved: 12000, available: 3000, unit: "meters", location: "W-A2", reorderPoint: 4000, status: "Low" },
  { id: "FAB-003", name: "100% Cotton Canvas 14oz", supplier: "Square Textiles", color: "Dark Wash", inStock: 32000, reserved: 22000, available: 10000, unit: "meters", location: "W-B1", reorderPoint: 6000, status: "Adequate" },
  { id: "FAB-004", name: "Cotton Blend Stretch", supplier: "Ha-Meem Denim", color: "Stone Washed", inStock: 9000, reserved: 9000, available: 0, unit: "meters", location: "W-B2", reorderPoint: 3000, status: "Critical" },
  { id: "FAB-005", name: "100% Cotton Denim 11oz", supplier: "Badsha Textile", color: "Light Blue", inStock: 20000, reserved: 15000, available: 5000, unit: "meters", location: "W-C1", reorderPoint: 5000, status: "Adequate" },
  { id: "FAB-006", name: "Stretch Denim 10oz", supplier: "Noman Weaving", color: "Vintage Blue", inStock: 12000, reserved: 8000, available: 4000, unit: "meters", location: "W-C2", reorderPoint: 3500, status: "Adequate" },
  { id: "FAB-007", name: "100% Cotton Denim 13oz", supplier: "Artistic Denim Mills", color: "Classic Blue", inStock: 8500, reserved: 7500, available: 1000, unit: "meters", location: "W-D1", reorderPoint: 4000, status: "Low" },
  { id: "FAB-008", name: "Premium Denim 12.5oz", supplier: "Envoy Textiles", color: "Dark Indigo", inStock: 25000, reserved: 18000, available: 7000, unit: "meters", location: "W-D2", reorderPoint: 5500, status: "Adequate" },
]

export const trimInventory = [
  { id: "TRM-001", name: "YKK Zipper 5cm", type: "Zipper", supplier: "YKK Bangladesh", inStock: 85000, reserved: 60000, available: 25000, unit: "pcs", status: "Adequate" },
  { id: "TRM-002", name: "Copper Rivet 9mm", type: "Rivet", supplier: "Trimworks BD", inStock: 250000, reserved: 200000, available: 50000, unit: "pcs", status: "Adequate" },
  { id: "TRM-003", name: "Denim Button 17mm", type: "Button", supplier: "Fashion Trims", inStock: 45000, reserved: 40000, available: 5000, unit: "pcs", status: "Low" },
  { id: "TRM-004", name: "Poly Thread #69 Indigo", type: "Thread", supplier: "Coats Bangladesh", inStock: 1200, reserved: 900, available: 300, unit: "cones", status: "Adequate" },
  { id: "TRM-005", name: "Care Label", type: "Label", supplier: "TexLabel Ltd", inStock: 120000, reserved: 90000, available: 30000, unit: "pcs", status: "Adequate" },
  { id: "TRM-006", name: "Hangtag Set", type: "Tag", supplier: "PrintPro BD", inStock: 30000, reserved: 28000, available: 2000, unit: "sets", status: "Critical" },
  { id: "TRM-007", name: "Waistband Interfacing", type: "Interlining", supplier: "Vilene BD", inStock: 18000, reserved: 12000, available: 6000, unit: "meters", status: "Adequate" },
  { id: "TRM-008", name: "Back Pocket Tape", type: "Tape", supplier: "RB Trims", inStock: 95000, reserved: 70000, available: 25000, unit: "meters", status: "Adequate" },
]

export const qualityData = [
  { id: "QC-001", order: "ORD-9921", style: "Slim Fit Jeans", line: "L-01", inspector: "Mosharraf Ali", inspectionType: "Inline", inspected: 320, passed: 304, defects: 16, defectRate: 5.0, dhu: 6.2, status: "Pass", date: "2026-03-07", topDefect: "Stitch Skip" },
  { id: "QC-002", order: "ORD-9934", style: "Skinny Stretch Jeans", line: "L-02", inspector: "Nasrin Akter", inspectionType: "Inline", inspected: 270, passed: 249, defects: 21, defectRate: 7.8, dhu: 9.1, status: "Warning", date: "2026-03-07", topDefect: "Broken Stitch" },
  { id: "QC-003", order: "ORD-9945", style: "Cargo Denim Pant", line: "L-03", inspector: "Mosharraf Ali", inspectionType: "End-Line", inspected: 200, passed: 178, defects: 22, defectRate: 11.0, dhu: 13.5, status: "Fail", date: "2026-03-07", topDefect: "Seam Pucker" },
  { id: "QC-004", order: "ORD-9950", style: "Jogger Denim", line: "L-04", inspector: "Sadia Islam", inspectionType: "Final", inspected: 500, passed: 492, defects: 8, defectRate: 1.6, dhu: 1.8, status: "Pass", date: "2026-03-06", topDefect: "Thread End" },
  { id: "QC-005", order: "ORD-9962", style: "Straight Leg Jeans", line: "L-05", inspector: "Nasrin Akter", inspectionType: "Inline", inspected: 150, passed: 131, defects: 19, defectRate: 12.7, dhu: 15.2, status: "Fail", date: "2026-03-07", topDefect: "Waist Band Defect" },
  { id: "QC-006", order: "ORD-9971", style: "Bootcut Denim", line: "L-06", inspector: "Sadia Islam", inspectionType: "End-Line", inspected: 280, passed: 272, defects: 8, defectRate: 2.9, dhu: 3.1, status: "Pass", date: "2026-03-07", topDefect: "Raw Edge" },
  { id: "QC-007", order: "ORD-9922", style: "Relaxed Fit Jeans", line: "L-07", inspector: "Mosharraf Ali", inspectionType: "Inline", inspected: 290, passed: 271, defects: 19, defectRate: 6.6, dhu: 7.9, status: "Warning", date: "2026-03-07", topDefect: "Uneven Seam" },
  { id: "QC-008", order: "ORD-9988", style: "Tapered Fit Jeans", line: "L-08", inspector: "Sadia Islam", inspectionType: "Final", inspected: 600, passed: 596, defects: 4, defectRate: 0.7, dhu: 0.8, status: "Pass", date: "2026-03-06", topDefect: "Loose Button" },
]

export const defectTypes = [
  { name: "Stitch Skip", count: 142, percentage: 24.1 },
  { name: "Broken Stitch", count: 98, percentage: 16.6 },
  { name: "Seam Pucker", count: 87, percentage: 14.8 },
  { name: "Thread End", count: 76, percentage: 12.9 },
  { name: "Raw Edge", count: 65, percentage: 11.0 },
  { name: "Uneven Seam", count: 54, percentage: 9.2 },
  { name: "Waist Band Issue", count: 37, percentage: 6.3 },
  { name: "Others", count: 30, percentage: 5.1 },
]

export const finishingData = [
  { id: "FIN-001", order: "ORD-9921", style: "Slim Fit Jeans", received: 4200, ironed: 4100, tagged: 4050, packed: 3800, cartons: 152, packMethod: "Folded", status: "In Progress", completionRate: 90.5 },
  { id: "FIN-002", order: "ORD-9950", style: "Jogger Denim", received: 1500, ironed: 1500, tagged: 1500, packed: 1500, cartons: 60, packMethod: "Hanger", status: "Completed", completionRate: 100 },
  { id: "FIN-003", order: "ORD-9971", style: "Bootcut Denim", received: 3000, ironed: 2900, tagged: 2850, packed: 2700, cartons: 108, packMethod: "Folded", status: "In Progress", completionRate: 90.0 },
  { id: "FIN-004", order: "ORD-9988", style: "Tapered Fit Jeans", received: 5000, ironed: 5000, tagged: 4950, packed: 4800, cartons: 240, packMethod: "Folded", status: "In Progress", completionRate: 96.0 },
  { id: "FIN-005", order: "ORD-9922", style: "Relaxed Fit Jeans", received: 800, ironed: 780, tagged: 760, packed: 700, cartons: 28, packMethod: "Hanger", status: "In Progress", completionRate: 87.5 },
]

export const shipmentData = [
  { id: "SHP-001", order: "ORD-9950", buyer: "Levi Strauss", style: "Jogger Denim", qty: 1500, cartons: 60, weight: "1,800 kg", volume: "12.6 cbm", port: "Chittagong Port", destination: "Rotterdam, Netherlands", etd: "2026-03-10", eta: "2026-04-02", vessel: "Maersk Sealand", bl: "MSKU2345678", status: "Booking Confirmed", incoterm: "FOB" },
  { id: "SHP-002", order: "ORD-9971", buyer: "Calvin Klein", style: "Bootcut Denim", qty: 2700, cartons: 108, weight: "3,240 kg", volume: "22.7 cbm", port: "Chittagong Port", destination: "New York, USA", etd: "2026-03-15", eta: "2026-04-08", vessel: "Evergreen Marine", bl: "EGLV3456789", status: "Docs Pending", incoterm: "FOB" },
  { id: "SHP-003", order: "ORD-9988", buyer: "Wrangler", style: "Tapered Fit Jeans", qty: 4800, cartons: 240, weight: "7,200 kg", volume: "50.4 cbm", port: "Chittagong Port", destination: "Hamburg, Germany", etd: "2026-03-18", eta: "2026-04-10", vessel: "CMA CGM", bl: "CMAU4567890", status: "Under Stuffing", incoterm: "CIF" },
  { id: "SHP-004", order: "ORD-9921", buyer: "H&M Group", style: "Slim Fit Jeans", qty: 3800, cartons: 152, weight: "5,700 kg", volume: "39.9 cbm", port: "Chittagong Port", destination: "Stockholm, Sweden", etd: "2026-03-25", eta: "2026-04-18", vessel: "MSC", bl: "PENDING", status: "Planning", incoterm: "FOB" },
]

export const operators = [
  { id: "EMP-001", name: "Fatema Begum", line: "L-01", role: "Sewing Operator", skill: "Inseam", grade: "A", attendance: "Present", efficiency: 92.4, experience: "5 yrs", shift: "Morning" },
  { id: "EMP-002", name: "Rashida Khanam", line: "L-01", role: "Sewing Operator", skill: "Waistband", grade: "A", attendance: "Present", efficiency: 88.1, experience: "4 yrs", shift: "Morning" },
  { id: "EMP-003", name: "Khadija Akter", line: "L-02", role: "Sewing Operator", skill: "Pocket", grade: "B+", attendance: "Present", efficiency: 79.3, experience: "3 yrs", shift: "Morning" },
  { id: "EMP-004", name: "Monowara Begum", line: "L-03", role: "Sewing Operator", skill: "Outseam", grade: "B", attendance: "Absent", efficiency: 0, experience: "2 yrs", shift: "Morning" },
  { id: "EMP-005", name: "Shirin Akter", line: "L-04", role: "Quality Inspector", skill: "Inline QC", grade: "A+", attendance: "Present", efficiency: 96.5, experience: "6 yrs", shift: "Morning" },
  { id: "EMP-006", name: "Jahanara Begum", line: "L-05", role: "Sewing Operator", skill: "Bartack", grade: "B+", attendance: "Present", efficiency: 52.1, experience: "2 yrs", shift: "Morning" },
  { id: "EMP-007", name: "Hosne Ara", line: "L-06", role: "Finishing Operator", skill: "Ironing", grade: "A", attendance: "Present", efficiency: 85.6, experience: "4 yrs", shift: "Morning" },
  { id: "EMP-008", name: "Mousumi Khatun", line: "L-07", role: "Sewing Operator", skill: "J-Stitch", grade: "B", attendance: "Late", efficiency: 65.2, experience: "3 yrs", shift: "Morning" },
  { id: "EMP-009", name: "Selina Akter", line: "L-08", role: "Sewing Operator", skill: "Belt Loop", grade: "A", attendance: "Present", efficiency: 89.4, experience: "5 yrs", shift: "Morning" },
  { id: "EMP-010", name: "Anwara Begum", line: "L-09", role: "Cutting Operator", skill: "Straight Knife", grade: "A+", attendance: "Present", efficiency: 94.0, experience: "7 yrs", shift: "Morning" },
  { id: "EMP-011", name: "Nasima Khatun", line: "L-10", role: "Sewing Operator", skill: "Back Rise", grade: "B+", attendance: "Present", efficiency: 81.3, experience: "3 yrs", shift: "Morning" },
  { id: "EMP-012", name: "Roksana Begum", line: "L-11", role: "Sewing Operator", skill: "Front Rise", grade: "B", attendance: "Present", efficiency: 76.8, experience: "2 yrs", shift: "Morning" },
]

export const attendanceSummary = {
  total: 620,
  present: 582,
  absent: 24,
  late: 14,
  presentRate: 93.9,
}

export const machines = [
  { id: "MCH-001", type: "Single Needle", brand: "Juki", model: "DDL-9000", line: "L-01", station: "Inseam", status: "Running", lastService: "2026-02-15", nextService: "2026-05-15" },
  { id: "MCH-002", type: "Overlock 5T", brand: "Pegasus", model: "EX5215", line: "L-01", station: "Outseam", status: "Running", lastService: "2026-02-10", nextService: "2026-05-10" },
  { id: "MCH-003", type: "Flatlock", brand: "Yamato", model: "VF2500", line: "L-02", station: "Waistband", status: "Running", lastService: "2026-01-20", nextService: "2026-04-20" },
  { id: "MCH-004", type: "Bartack", brand: "Brother", model: "LK3-B430", line: "L-03", station: "Belt Loop", status: "Breakdown", lastService: "2026-01-05", nextService: "2026-04-05" },
  { id: "MCH-005", type: "Button Attach", brand: "Juki", model: "MB-373NS", line: "L-04", station: "Button", status: "Running", lastService: "2026-02-28", nextService: "2026-05-28" },
  { id: "MCH-006", type: "Single Needle", brand: "Juki", model: "DDL-9000", line: "L-05", station: "J-Stitch", status: "Breakdown", lastService: "2026-01-10", nextService: "OVERDUE" },
  { id: "MCH-007", type: "Steam Iron", brand: "Sussman", model: "EVI-10", line: "Finishing", station: "Ironing", status: "Running", lastService: "2026-03-01", nextService: "2026-06-01" },
  { id: "MCH-008", type: "Band Knife", brand: "Eastman", model: "BKB-8", line: "Cutting", station: "Band Knife", status: "Running", lastService: "2026-02-20", nextService: "2026-05-20" },
]

export const weeklyOutput = [
  { day: "Mon", output: 21200, target: 24000 },
  { day: "Tue", output: 23100, target: 24000 },
  { day: "Wed", output: 22800, target: 24000 },
  { day: "Thu", output: 24500, target: 24000 },
  { day: "Fri", output: 19800, target: 24000 },
  { day: "Sat", output: 22100, target: 24000 },
]

export const lineEfficiency = [
  { line: "L-01", efficiency: 82.5 },
  { line: "L-02", efficiency: 78.1 },
  { line: "L-03", efficiency: 65.4 },
  { line: "L-04", efficiency: 88.9 },
  { line: "L-05", efficiency: 45.2 },
  { line: "L-06", efficiency: 79.5 },
  { line: "L-07", efficiency: 72.0 },
  { line: "L-08", efficiency: 85.3 },
  { line: "L-09", efficiency: 81.7 },
  { line: "L-10", efficiency: 76.4 },
  { line: "L-11", efficiency: 80.2 },
  { line: "L-12", efficiency: 84.0 },
]
