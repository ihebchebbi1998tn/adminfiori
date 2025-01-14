import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  User,
  Menu,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Package, label: 'Produits', id: 'products' },
    { icon: ShoppingCart, label: 'Achats', id: 'orders' },
    { icon: User, label: 'Visiteurs', id: 'visitors' },
    { icon: Users, label: 'Clients', id: 'clients' },
    { icon: Users, label: 'Newsletter', id: 'newsletter' }, // Added Newsletter item
  ];
  
  const handleMenuClick = (id: string) => {
    setActivePage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg hover:bg-white transition-colors"
      >
        <Menu className="w-6 h-6 text-[#5a0c1a]" />
      </button>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed left-64 top-6 -mr-4 z-50 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors transform -translate-x-1/2"
      >
        <ChevronRight className={`w-4 h-4 text-[#5a0c1a] transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full backdrop-blur-xl border-r border-white/20 transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? 'w-20' : 'w-64'} 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gradient-to-b from-[#5a0c1a] to-[#3d0812] text-white`}>
        
        <div className={`flex items-center gap-3 mb-8 p-6 ${isCollapsed ? 'justify-center' : ''}`}>
          <Package className="w-8 h-8 text-white" />
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-white">
              Fiori
            </h1>
          )}
        </div>
        
        <nav className="px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${activePage === item.id 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10 text-white/70 hover:text-white'
                }
                ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? 'w-6 h-6' : ''}`} />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className={`absolute bottom-4 left-0 right-0 mx-3 flex items-center gap-3 px-4 py-3 rounded-lg
            text-white/70 hover:bg-white/10 hover:text-white transition-all group
            ${isCollapsed ? 'justify-center' : ''}`}>
          <LogOut className={`w-5 h-5 ${isCollapsed ? 'w-6 h-6' : ''}`} />
          {!isCollapsed && <span>Déconnexion</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Déconnexion
            </div>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;