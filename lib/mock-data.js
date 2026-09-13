export const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Investigate', href: '/investigate', icon: 'Search' },
  { label: 'Network', href: '/network', icon: 'Share2' },
  { label: 'Alerts', href: '/alerts', icon: 'Bell' },
  { label: 'Data', href: '/data', icon: 'Database' },
]

export const entities = [
  { id: 'rajesh', name: 'Rajesh Kumar', type: 'PERSON', priority: 'HIGH', score: 78, initials: 'RK', aliases: 'R. Kumar, Raj', locations: 'Andheri, Navi Mumbai', phone: '+91 98••• 4412', vehicles: 'MH-01-AB-1234', organizations: 'XYZ Logistics', cases: 'Case #1024, Case #1018' },
  { id: 'amit', name: 'Amit Sharma', type: 'PERSON', priority: 'MEDIUM', score: 64, initials: 'AS' },
  { id: 'vikram', name: 'Vikram Mehta', type: 'PERSON', priority: 'MEDIUM', score: 57, initials: 'VM' },
  { id: 'neha', name: 'Neha Patel', type: 'PERSON', priority: 'LOW', score: 32, initials: 'NP' },
  { id: 'xyz', name: 'XYZ Logistics', type: 'ORGANIZATION', priority: 'MEDIUM', score: 51, initials: 'XL' },
  { id: 'apex', name: 'Apex Trading', type: 'ORGANIZATION', priority: 'LOW', score: 38, initials: 'AT' },
  { id: 'andheri', name: 'Andheri', type: 'LOCATION', priority: 'LOW', score: 20, initials: 'AN' },
  { id: 'navi', name: 'Navi Mumbai', type: 'LOCATION', priority: 'LOW', score: 20, initials: 'NM' },
  { id: 'vehicle', name: 'MH-01-AB-1234', type: 'VEHICLE', priority: 'MEDIUM', score: 44, initials: 'MH' },
  { id: 'phone', name: '+91 98••• 4412', type: 'PHONE', priority: 'LOW', score: 28, initials: 'PH' },
  { id: 'account', name: 'Account ••8842', type: 'ACCOUNT', priority: 'MEDIUM', score: 48, initials: '₹' },
]

export const relationships = [
  ['rajesh', 'xyz', 'WORKS FOR'], ['rajesh', 'amit', 'CALLED'], ['rajesh', 'vehicle', 'OWNS'], ['rajesh', 'phone', 'USES'], ['rajesh', 'andheri', 'LOCATED AT'], ['xyz', 'navi', 'LOCATED AT'], ['amit', 'vikram', 'CALLED'], ['amit', 'andheri', 'LOCATED AT'], ['vikram', 'account', 'TRANSFERRED TO'], ['account', 'apex', 'ASSOCIATED WITH'], ['neha', 'apex', 'WORKED WITH']
]

export const investigations = [
  ['#1024', 'Organized Theft', 'HIGH', 'Rajesh Kumar', '2h ago'],
  ['#1021', 'Financial Fraud', 'MEDIUM', 'Apex Trading', '5h ago'],
  ['#1018', 'Drug Network', 'HIGH', 'Vikram Mehta', 'Yesterday'],
  ['#1014', 'Vehicle Association', 'LOW', 'MH-01-AB-1234', '2d ago'],
]

export const insights = [
  { title: 'Potential Network Influencer', description: 'Rajesh Kumar has unusually high connectivity within Network #12.', priority: 'HIGH', confidence: '91%', timestamp: '12 min ago', source: 'Graph Analysis', stat: 'Influence 0.82' },
  { title: 'Repeated Co-location Pattern', description: 'Person B and Person C were observed at the same locations 8 times within 30 days.', priority: 'MEDIUM', confidence: '84%', timestamp: '1h ago', source: 'Surveillance Records + AI Analysis', stat: '8 occurrences' },
  { title: 'Financial Anomaly', description: '₹8.7L was transferred between 4 connected accounts within 48 hours.', priority: 'MEDIUM', confidence: '89%', timestamp: '3h ago', source: 'Financial Records + AI Analysis', stat: '₹8.7L linked' },
]

export const alerts = [
  { id: 1, title: 'Potential key influencer detected', description: 'Rajesh Kumar shows unusually high connectivity in Network #12.', entity: 'Rajesh Kumar', severity: 'HIGH', time: '2 hours ago', source: 'Graph Analysis', unread: true },
  { id: 2, title: 'Unusual transaction pattern', description: 'Multiple transfers detected between four connected accounts.', entity: 'Network #12', severity: 'HIGH', time: '4 hours ago', source: 'Financial Records', unread: true },
  { id: 3, title: 'New relationship discovered', description: 'A previously unobserved connection has been identified.', entity: 'Person B ↔ Organization X', severity: 'MEDIUM', time: 'Yesterday', source: 'CDR', unread: false },
  { id: 4, title: 'Entity match requires review', description: 'Two records may refer to the same person based on shared identifiers.', entity: 'Amit Sharma', severity: 'LOW', time: 'Yesterday', source: 'Entity Resolution', unread: false },
]

export const evidence = { source: 'Call Detail Record', document: 'CDR_Aug_12_2026.csv', date: '12 Aug 2026', entities: 'Rajesh Kumar · Amit Sharma', relationship: 'CALLED', snippet: 'Communication record detected between the two entities. Call duration: 08:42. Location towers: Andheri East, Mumbai Central.' }
