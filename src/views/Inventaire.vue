<template>
  <div class="releve-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1>Relevé des Journées</h1>
        <p class="subtitle">Rapport financier FLEXPRESS</p>
      </div>
      <div class="header-actions">
        <button @click="downloadPDF" class="btn-download">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger PDF
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Journées</p>
          <h3 class="stat-value">{{ filteredJournees.length }}</h3>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon value">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Recettes</p>
          <h3 class="stat-value">{{ totalRecettes.toFixed(3) }} DT</h3>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon depense">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Dépenses</p>
          <h3 class="stat-value">{{ totalDepenses.toFixed(3) }} DT</h3>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon net">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Revenu Net</p>
          <h3 class="stat-value net-value">{{ totalNet.toFixed(3) }} DT</h3>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <h3>Filtres de Période</h3>
      <div class="filters">
        <div class="filter-group">
          <label>Date Début</label>
          <input 
            type="date" 
            v-model="filters.dateDebut" 
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label>Date Fin</label>
          <input 
            type="date" 
            v-model="filters.dateFin" 
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label>Livreur</label>
          <select v-model="filters.livreurId" class="filter-select">
            <option :value="null">Tous les livreurs</option>
            <option v-for="livreur in livreurs" :key="livreur.id" :value="livreur.id">
              {{ livreur.nom }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Motor</label>
          <select v-model="filters.motorId" class="filter-select">
            <option :value="null">Tous les motors</option>
            <option v-for="motor in motors" :key="motor.id" :value="motor.id">
              {{ motor.NumPlaque }}
            </option>
          </select>
        </div>

        <button @click="resetFilters" class="btn-reset">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div class="table-container">
        <table class="releve-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Livreur</th>
              <th>Motor</th>
              <th>Recette</th>
              <th>Total Dépense</th>
              <th>Partie Livreur</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="journee in filteredJournees" :key="journee.id">
              <td>{{ formatDate(journee.Date) }}</td>
              <td>
                <span class="livreur-badge">{{ getLivreurName(journee.LivreurId) }}</span>
              </td>
              <td>
                <span class="motor-badge">{{ getMotorPlaque(journee.MotorId) }}</span>
              </td>
              <td class="amount recette">{{ journee.Recette.toFixed(3) }} DT</td>
              <td class="amount depense">{{ journee.TotalDeponse.toFixed(3) }} DT</td>
              <td class="amount partie">{{ journee.PartieLivreur.toFixed(3) }} DT</td>
              <td class="amount net">{{ journee.Net.toFixed(3) }} DT</td>
            </tr>
            <tr v-if="filteredJournees.length === 0">
              <td colspan="7" class="no-data">
                <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Aucune journée trouvée pour cette période
              </td>
            </tr>
          </tbody>
          <tfoot v-if="filteredJournees.length > 0">
            <tr class="totals-row">
              <td colspan="3" class="total-label">TOTAUX</td>
              <td class="amount total-recette">{{ totalRecettes.toFixed(3) }} DT</td>
              <td class="amount total-depense">{{ totalDepenses.toFixed(3) }} DT</td>
              <td class="amount total-partie">{{ totalPartieLivreur.toFixed(3) }} DT</td>
              <td class="amount total-net">{{ totalNet.toFixed(3) }} DT</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReleveJournee',
  data() {
    return {
      journees: [],
      livreurs: [],
      motors: [],
      filters: {
        dateDebut: null,
        dateFin: null,
        livreurId: null,
        motorId: null
      }
    };
  },
  computed: {
    filteredJournees() {
      return this.journees.filter(j => {
        const journeeDate = new Date(j.Date);
        
        if (this.filters.dateDebut) {
          const dateDebut = new Date(this.filters.dateDebut);
          if (journeeDate < dateDebut) return false;
        }
        
        if (this.filters.dateFin) {
          const dateFin = new Date(this.filters.dateFin);
          if (journeeDate > dateFin) return false;
        }
        
        if (this.filters.livreurId && j.LivreurId !== this.filters.livreurId) return false;
        if (this.filters.motorId && j.MotorId !== this.filters.motorId) return false;
        
        return true;
      }).sort((a, b) => new Date(a.Date) - new Date(b.Date));
    },
    totalRecettes() {
      return this.filteredJournees.reduce((sum, j) => sum + j.Recette, 0);
    },
    totalDepenses() {
      return this.filteredJournees.reduce((sum, j) => sum + j.TotalDeponse, 0);
    },
    totalPartieLivreur() {
      return this.filteredJournees.reduce((sum, j) => sum + j.PartieLivreur, 0);
    },
    totalNet() {
      return this.filteredJournees.reduce((sum, j) => sum + j.Net, 0);
    }
  },
  created() {
    this.fetchJournees();
    this.fetchLivreurs();
    this.fetchMotors();
  },
  methods: {
    fetchJournees() {
      axios.get('/Journee')
        .then(response => {
          this.journees = response.data;
        })
        .catch(error => {
          console.error('Error fetching journees:', error);
        });
    },
    fetchLivreurs() {
      axios.get('/Livreur')
        .then(response => {
          this.livreurs = response.data;
        })
        .catch(error => {
          console.error('Error fetching livreurs:', error);
        });
    },
    fetchMotors() {
      axios.get('/Motor')
        .then(response => {
          this.motors = response.data;
        })
        .catch(error => {
          console.error('Error fetching motors:', error);
        });
    },
    resetFilters() {
      this.filters = {
        dateDebut: null,
        dateFin: null,
        livreurId: null,
        motorId: null
      };
    },
    getLivreurName(id) {
      const livreur = this.livreurs.find(l => l.id === id);
      return livreur ? livreur.nom : 'Inconnu';
    },
    getMotorPlaque(id) {
      const motor = this.motors.find(m => m.id === id);
      return motor ? motor.NumPlaque : 'Inconnu';
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR');
    },

    downloadPDF() {
      // Generate filename based on date filters
      let filename = 'Releve_FLEXPRESS';
      
      if (this.filters.dateDebut && this.filters.dateFin) {
        const dateDebut = new Date(this.filters.dateDebut);
        const dateFin = new Date(this.filters.dateFin);
        
        // Check if same date
        if (this.filters.dateDebut === this.filters.dateFin) {
          // Single date format: Releve_FLEXPRESS_31-12-2024.pdf
          const formattedDate = dateDebut.toLocaleDateString('fr-FR').replace(/\//g, '-');
          filename = `Releve_FLEXPRESS_${formattedDate}`;
        } else {
          // Date range format: Releve_FLEXPRESS_01-12-2024_au_31-12-2024.pdf
          const formattedDebut = dateDebut.toLocaleDateString('fr-FR').replace(/\//g, '-');
          const formattedFin = dateFin.toLocaleDateString('fr-FR').replace(/\//g, '-');
          filename = `Releve_FLEXPRESS_${formattedDebut}_au_${formattedFin}`;
        }
      } else if (this.filters.dateDebut) {
        // Only start date
        const formattedDate = new Date(this.filters.dateDebut).toLocaleDateString('fr-FR').replace(/\//g, '-');
        filename = `Releve_FLEXPRESS_depuis_${formattedDate}`;
      } else if (this.filters.dateFin) {
        // Only end date
        const formattedDate = new Date(this.filters.dateFin).toLocaleDateString('fr-FR').replace(/\//g, '-');
        filename = `Releve_FLEXPRESS_jusqu_au_${formattedDate}`;
      } else {
        // No date filter - use current date
        const today = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
        filename = `Releve_FLEXPRESS_${today}`;
      }
      
      // Add livreur or motor info if filtered
      if (this.filters.livreurId) {
        const livreur = this.livreurs.find(l => l.id === this.filters.livreurId);
        if (livreur) {
          filename += `_${livreur.nom.replace(/\s+/g, '_')}`;
        }
      } else if (this.filters.motorId) {
        const motor = this.motors.find(m => m.id === this.filters.motorId);
        if (motor) {
          filename += `_${motor.NumPlaque.replace(/\s+/g, '_')}`;
        }
      }
      
      const content = this.generatePDFContent();
      const printWindow = window.open('', '', 'height=800,width=1000');
      
      // Set the document title which will be used as default filename
      printWindow.document.title = filename;
      
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
    },
    
    generatePDFContent() {
        const dateDebut = this.filters.dateDebut ? new Date(this.filters.dateDebut).toLocaleDateString('fr-FR') : 'N/A';
        const dateFin = this.filters.dateFin ? new Date(this.filters.dateFin).toLocaleDateString('fr-FR') : 'N/A';
        
        // Determine if dates are the same
        const isSameDate = this.filters.dateDebut && this.filters.dateFin && 
                          this.filters.dateDebut === this.filters.dateFin;
        
        // Create date subtitle
        const dateSubtitle = isSameDate 
            ? `de: ${dateDebut}`
            : `du: ${dateDebut}, à: ${dateFin}`;
        
        let filterInfo = '';
        if (this.filters.livreurId) {
            const livreur = this.livreurs.find(l => l.id === this.filters.livreurId);
            if (livreur) {
            filterInfo = `<strong>Livreur:</strong> ${livreur.nom} (${livreur.Pourcentage}%)`;
            }
        } else if (this.filters.motorId) {
            const motor = this.motors.find(m => m.id === this.filters.motorId);
            if (motor) {
            filterInfo = `<strong>Motor:</strong> ${motor.NumPlaque} - ${motor.Color}`;
            }
        }
        
        // Group journees by date for rowspan
        const groupedByDate = {};
        this.filteredJournees.forEach(j => {
            const date = this.formatDate(j.Date);
            if (!groupedByDate[date]) {
            groupedByDate[date] = [];
            }
            groupedByDate[date].push(j);
        });
        
        let tableRows = '';
        Object.keys(groupedByDate).forEach(date => {
            const journees = groupedByDate[date];
            journees.forEach((j, index) => {
            tableRows += '<tr>';
            if (index === 0) {
                tableRows += `<td rowspan="${journees.length}" style="font-weight: 600; vertical-align: middle; background: #f9fafb; text-align: center;">${date}</td>`;
            }
            tableRows += `
                <td style="text-align: center;">${this.getLivreurName(j.LivreurId)}</td>
                <td style="text-align: center;">${this.getMotorPlaque(j.MotorId)}</td>
                <td style="text-align: center;">${j.Recette.toFixed(3)} DT</td>
                <td style="text-align: center;">${j.TotalDeponse.toFixed(3)} DT</td>
                <td style="text-align: center;">${j.PartieLivreur.toFixed(3)} DT</td>
                <td style="text-align: center; font-weight: 700; color: #10b981;">${j.Net.toFixed(3)} DT</td>
            </tr>
            `;
            });
        });
        
        const html = `
            <html>
            <head>
            <title>Relevé FLEXPRESS</title>
            <style>
                @page { 
                margin: 15mm;
                size: A4 protrait;
                }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                color: #1f2937;
                font-size: 14px;
                }
                .header-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #F4B942;
                }
                .header-left {
                flex: 1;
                }
                .header-left h1 {
                font-size: 36px;
                font-weight: 700;
                margin-bottom: 5px;
                color: #1f2937;
                }
                .header-left .date-subtitle {
                font-size: 16px;
                color: #4b5563;
                margin-bottom: 15px;
                font-weight: 500;
                }
                .header-left .filter-info {
                font-size: 14px;
                color: #4b5563;
                margin-top: 10px;
                padding: 8px 12px;
                background: #f3f4f6;
                border-radius: 6px;
                display: inline-block;
                }
                .header-right {
                text-align: right;
                }
                .logo {
                width: 140px;
                height: auto;
                margin-bottom: 10px;
                }
                table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 13px;
                }
                thead {
                background: #F4B942;
                }
                th {
                padding: 12px 8px;
                text-align: center;
                font-weight: 700;
                color: #000000;
                border: 1px solid #F4B942;
                font-size: 14px;
                }
                td {
                padding: 10px 8px;
                border: 1px solid #e5e7eb;
                text-align: center;
                vertical-align: middle;
                font-size: 13px;
                }
                tbody tr:nth-child(even) {
                background: #fef9f0;
                }
                
                /* TOTALS ROW - ATTACHED TO TABLE */
                tfoot {
                display: table-footer-group;
                page-break-inside: avoid;
                break-inside: avoid;
                }
                
                tfoot tr {
                background: #f9fafb;
                border-top: 3px solid #F4B942;
                }
                
                tfoot td {
                padding: 14px 10px;
                border: 2px solid #F4B942;
                text-align: center;
                font-weight: 700;
                font-size: 12px;
                }
                
                .totals-label {
                background: #F4B942;
                color: #000000;
                font-size: 13px;
                }
                
                .signature-section {
                margin-top: 50px;
                text-align: right;
                padding-right: 50px;
                page-break-inside: avoid;
                }
                .signature-label {
                font-weight: 600;
                color: #4b5563;
                margin-bottom: 40px;
                font-size: 14px;
                }
                .footer {
                position: fixed;
                bottom: 15px;
                left: 20px;
                right: 20px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                padding-top: 15px;
                border-top: 1px solid #e5e7eb;
                }
                .footer-item {
                display: inline-block;
                margin: 0 15px;
                }
                @media print {
                .no-print { display: none; }
                tfoot { display: table-footer-group; }
                }
            </style>
            </head>
            <body>
            <div class="header-section">
                <div class="header-left">
                <h1>Relevé</h1>
                <div class="date-subtitle">${dateSubtitle}</div>
                ${filterInfo ? `<div class="filter-info">${filterInfo}</div>` : ''}
                </div>
            </div>
            
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Livreur</th>
                    <th>Motor</th>
                    <th>Recette</th>
                    <th>Dépense</th>
                    <th>Pourcentage</th>
                    <th>Net</th>
                </tr>
                </thead>
                <tbody>
                ${tableRows}
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="3" class="totals-label">TOTAUX</td>
                    <td>${this.totalRecettes.toFixed(3)} DT</td>
                    <td>${this.totalDepenses.toFixed(3)} DT</td>
                    <td>${this.totalPartieLivreur.toFixed(3)} DT</td>
                    <td style="color: #10b981;">${this.totalNet.toFixed(3)} DT</td>
                </tr>
                </tfoot>
            </table>
            
            <div class="signature-section">
                <div class="signature-label">Signature Résponsable</div>
            </div>
            
            <div class="footer">
                <div class="footer-item"><strong>Tél:</strong> 22 749 748</div>
                <div class="footer-item"><strong>Email:</strong> flexpress.contact@gmail.com</div>
                <div class="footer-item"><strong>Adresse:</strong> Midoun, Rue Houmt-Souk</div>
            </div>
            </body>
            </html>
        `;
        
        return html;
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.releve-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-download {
  background: white;
  color: #F4B942;
  border: 2px solid #F4B942;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-download:hover {
  background: #F4B942;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 185, 66, 0.3);
}

.btn-icon {
  width: 20px;
  height: 20px;
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
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
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

.stat-icon.total {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
}

.stat-icon.value {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.stat-icon.depense {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.stat-icon.net {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
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
  margin: 0;
}

.stat-value.net-value {
  color: #10b981;
}

.filters-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filters-card h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.125rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
}

.filter-input,
.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #F4B942;
  background: white;
  box-shadow: 0 0 0 3px rgba(244, 185, 66, 0.1);
}

.btn-reset {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-reset svg {
  width: 18px;
  height: 18px;
}

.btn-reset:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.releve-table {
  width: 100%;
  border-collapse: collapse;
}

.releve-table thead {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
}

.releve-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.releve-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.releve-table tbody tr:hover {
  background: #fef9f0;
}

.releve-table td {
  padding: 1rem;
  color: #4b5563;
  font-size: 0.9rem;
}

.livreur-badge {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
}

.motor-badge {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
}

.amount {
  font-weight: 600;
  text-align: right;
}

.amount.recette {
  color: #10b981;
}

.amount.depense {
  color: #ef4444;
}

.amount.partie {
  color: #f59e0b;
}

.amount.net {
  color: #3b82f6;
  font-weight: 700;
}

.no-data {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.no-data-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  opacity: 0.5;
}

.releve-table tfoot {
  background: #f9fafb;
  border-top: 3px solid #F4B942;
}

.totals-row td {
  padding: 1.25rem 1rem;
  font-weight: 700;
  font-size: 1rem;
}

.total-label {
  text-align: left;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-recette {
  color: #10b981;
}

.total-depense {
  color: #ef4444;
}

.total-partie {
  color: #f59e0b;
}

.total-net {
  color: #3b82f6;
  font-size: 1.125rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .releve-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: scroll;
  }

  .releve-table {
    min-width: 800px;
  }

  .releve-table th,
  .releve-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .livreur-badge,
  .motor-badge {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }
}

@media print {
  .header-actions,
  .filters-card,
  .btn-download {
    display: none !important;
  }

  .releve-container {
    background: white;
    padding: 0;
  }

  .stat-card,
  .table-card {
    box-shadow: none;
    page-break-inside: avoid;
  }
}
</style>