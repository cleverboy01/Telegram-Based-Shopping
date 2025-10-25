import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'warehouse';
}

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch (error) {
        console.error('Failed to parse user:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setShowMenu(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav style={{
      padding: '16px 0',
      backgroundColor: '#1e40af',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      fontFamily: 'system-ui, -apple-system, Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🛒 فروشگاه من
        </Link>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link to="/" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '16px',
            transition: 'opacity 0.2s'
          }}>
            خانه
          </Link>
          
          <Link to="/products" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '16px',
            transition: 'opacity 0.2s'
          }}>
            محصولات
          </Link>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            marginRight: '16px',
            paddingRight: '16px',
            borderRight: '1px solid rgba(255,255,255,0.3)',
            position: 'relative'
          }}>
            {user ? (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  👤 {user.name}
                </button>
                
                {showMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    left: '0',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '220px',
                    overflow: 'hidden',
                    zIndex: 100
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#374151'
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{user.email}</div>
                    </div>
                    
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'warehouse' ? '/warehouse/dashboard' : '/dashboard'}
                      onClick={() => setShowMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'background-color 0.2s',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      📊 داشبورد
                    </Link>
                    
                    {user.role === 'customer' && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setShowMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'background-color 0.2s',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          📦 سفارشات
                        </Link>
                        
                        <Link
                          to="/wishlist"
                          onClick={() => setShowMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'background-color 0.2s',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          ❤️ علاقه‌مندی‌ها
                        </Link>
                        
                        <Link
                          to="/cart"
                          onClick={() => setShowMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'background-color 0.2s',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          🛒 سبد خرید
                        </Link>
                      </>
                    )}
                    
                    <div style={{ borderTop: '1px solid #e5e7eb' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'right',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        🚪 خروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#1e40af';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                  >
                    ورود
                  </button>
                </Link>
                
                <Link to="/register">
                  <button style={{
                    backgroundColor: 'white',
                    color: '#1e40af',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  >
                    ثبت‌نام
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
