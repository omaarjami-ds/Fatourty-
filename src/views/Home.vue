<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Tableau de Bord</h1>
      <p class="subtitle">Aperçu des performances et statistiques</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Recette Totale</p>
          <h2 class="stat-value">{{ totalRecette.toFixed(2) }} DT</h2>
          <p class="stat-change positive">+12.5% ce mois</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon deliveries">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Journées</p>
          <h2 class="stat-value">{{ totalJournees }}</h2>
          <p class="stat-change positive">+8 cette semaine</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon drivers">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Livreurs Actifs</p>
          <h2 class="stat-value">{{ totalLivreurs }}</h2>
          <p class="stat-change neutral">Stable</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon motors">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Motors</p>
          <h2 class="stat-value">{{ totalMotors }}</h2>
          <p class="stat-change positive">+2 ce mois</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Revenue Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Recette par Jour</h3>
          <select v-model="selectedPeriod" class="period-select">
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
          </select>
        </div>
        <div class="chart-container">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Performance by Driver -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Performance par Livreur</h3>
        </div>
        <div class="chart-container">
          <canvas ref="driverChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="recent-section">
      <h3>Activités Récentes</h3>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="activity-content">
            <p class="activity-title">{{ activity.title }}</p>
            <p class="activity-time">{{ activity.time }}</p>
          </div>
          <div class="activity-amount">{{ activity.amount }} DT</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      totalRecette: 0,
      totalJournees: 0,
      totalLivreurs: 0,
      totalMotors: 0,
      selectedPeriod: '7',
      journees: [],
      livreurs: [],
      motors: [],
      revenueChart: null,
      driverChart: null,
      recentActivities: []
    };
  },
  mounted() {
    this.fetchData();
  },
  beforeUnmount() {
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.driverChart) this.driverChart.destroy();
  },
  watch: {
    selectedPeriod() {
      this.updateRevenueChart();
    }
  },
  methods: {
    async fetchData() {
      try {
        const [journeesRes, livreursRes, motorsRes] = await Promise.all([
          axios.get('/Journee'),
          axios.get('/Livreur'),
          axios.get('/Motor')
        ]);

        this.journees = journeesRes.data;
        this.livreurs = livreursRes.data;
        this.motors = motorsRes.data;

        this.calculateStats();
        this.createCharts();
        this.loadRecentActivities();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    calculateStats() {
      this.totalJournees = this.journees.length;
      this.totalLivreurs = this.livreurs.length;
      this.totalMotors = this.motors.length;
      this.totalRecette = this.journees.reduce((sum, j) => sum + (j.Recette || 0), 0);
    },
    createCharts() {
      this.createRevenueChart();
      this.createDriverChart();
    },
    createRevenueChart() {
      const ctx = this.$refs.revenueChart.getContext('2d');
      
      const days = this.getLastNDays(parseInt(this.selectedPeriod));
      const revenueData = days.map(date => {
        const dayJournees = this.journees.filter(j => j.Date === date);
        return dayJournees.reduce((sum, j) => sum + (j.Recette || 0), 0);
      });

      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days.map(d => this.formatDate(d)),
          datasets: [{
            label: 'Recette (DT)',
            data: revenueData,
            borderColor: '#F4B942',
            backgroundColor: 'rgba(244, 185, 66, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#F4B942',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    createDriverChart() {
      const ctx = this.$refs.driverChart.getContext('2d');
      
      const driverStats = this.livreurs.map(livreur => {
        const livreurJournees = this.journees.filter(j => j.LivreurId === livreur.id);
        return {
          name: livreur.nom,
          recette: livreurJournees.reduce((sum, j) => sum + (j.Recette || 0), 0)
        };
      }).sort((a, b) => b.recette - a.recette).slice(0, 5);

      this.driverChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: driverStats.map(d => d.name),
          datasets: [{
            label: 'Recette (DT)',
            data: driverStats.map(d => d.recette),
            backgroundColor: '#F4B942',
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    updateRevenueChart() {
      if (this.revenueChart) {
        this.revenueChart.destroy();
        this.createRevenueChart();
      }
    },
    getLast7Days() {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().slice(0, 10));
      }
      return days;
    },
    getLastNDays(n) {
      const days = [];
      for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().slice(0, 10));
      }
      return days;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    },
    loadRecentActivities() {
      this.recentActivities = this.journees
        .slice(-5)
        .reverse()
        .map((j, index) => {
          const livreur = this.livreurs.find(l => l.id === j.LivreurId);
          return {
            id: index,
            title: `Journée de ${livreur ? livreur.nom : 'Inconnu'}`,
            time: this.formatDate(j.Date),
            amount: j.Recette.toFixed(2)
          };
        });
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
}

.stat-icon.deliveries {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.stat-icon.drivers {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.stat-icon.motors {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change.neutral {
  color: #6b7280;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.25rem;
  color: #1f2937;
  font-weight: 600;
}

.period-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.period-select:focus {
  outline: none;
  border-color: #F4B942;
}

.chart-container {
  height: 300px;
  position: relative;
}

.recent-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.recent-section h3 {
  font-size: 1.25rem;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f9fafb;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f3f4f6;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-amount {
  font-weight: 700;
  color: #F4B942;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>