<template>
  <div id="app">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="./assets/blackBgLogo.png" alt="FLEXPRESS Logo" class="logo" />
        <h1 class="brand-name">FLEXPRESS</h1>
        <p class="brand-subtitle">Delivery Management</p>
      </div>
      
      <nav>
        <ul>
          <li>
            <router-link to="/" class="nav-link">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ajouter-journee" class="nav-link">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Ajouter Journée</span>
            </router-link>
          </li>
          <li>
            <router-link to="/livreurs" class="nav-link">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Livreurs</span>
            </router-link>
          </li>
          <li>
            <router-link to="/motors" class="nav-link">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Motors</span>
            </router-link>
          </li>
          <li>
            <router-link to="/inventaire" class="nav-link">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Inventaire</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="contact-info">
          <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span class="phone-number">22 749 748</span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1f2937;
  min-height: 100vh;
  background: #f5f7fa;
  width: 100%;
}

.sidebar {
  width: 280px;
  min-width: 280px;
  flex-shrink: 0;
  background: white;
  padding: 0;
  min-height: 100vh;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo-section {
  padding: 2rem 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  border-bottom: 4px solid rgba(255, 255, 255, 0.2);
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
  border-radius: 50%;
  object-fit: cover;
}

.brand-name {
  color: white;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

nav {
  flex: 1;
  padding: 1.5rem 0;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

nav li {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.5rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #F4B942;
  transform: translateX(-100%);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover {
  background: #fef9f0;
  color: #F4B942;
  padding-left: 2rem;
}

.nav-link:hover::before {
  transform: translateX(0);
}

.nav-link.router-link-exact-active {
  background: linear-gradient(90deg, rgba(244, 185, 66, 0.15) 0%, rgba(244, 185, 66, 0.05) 100%);
  color: #F4B942;
  font-weight: 700;
  padding-left: 2rem;
}

.nav-link.router-link-exact-active::before {
  transform: translateX(0);
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.nav-link:hover .nav-icon,
.nav-link.router-link-exact-active .nav-icon {
  transform: scale(1.1);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 2px solid #f3f4f6;
  background: #fafafa;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #F4B942;
  box-shadow: 0 2px 8px rgba(244, 185, 66, 0.15);
}

.contact-icon {
  width: 20px;
  height: 20px;
  color: #F4B942;
  flex-shrink: 0;
}

.phone-number {
  font-weight: 700;
  color: #1f2937;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.main-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  min-height: 100vh;
  width: 100%;
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background: #F4B942;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover {
  background: #e0a535;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .brand-name {
    font-size: 1.5rem;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 768px) {
  #app {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    min-height: auto;
    height: auto;
    position: relative;
  }
  
  .logo-section {
    padding: 1.5rem 1rem;
  }
  
  .brand-name {
    font-size: 1.35rem;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  nav {
    padding: 1rem 0;
  }
  
  nav ul {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 0 1rem;
  }
  
  nav li {
    margin-bottom: 0;
    flex-shrink: 0;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    white-space: nowrap;
  }
  
  .nav-link::before {
    display: none;
  }
  
  .nav-link:hover,
  .nav-link.router-link-exact-active {
    padding-left: 1rem;
  }
  
  .sidebar-footer {
    padding: 1rem;
  }
  
  .main-content {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .nav-link span {
    font-size: 0.85rem;
  }
  
  .contact-info {
    padding: 0.625rem;
  }
  
  .phone-number {
    font-size: 0.85rem;
  }
}
</style>