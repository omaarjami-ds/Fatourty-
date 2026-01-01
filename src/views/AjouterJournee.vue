<script>
import axios from 'axios';

export default {
  data() {
    return {
      livreurs: [],
      motors: [],
      journees: [],
      loading: false,
      success: false,
      error: null,
      showJourneesList: false,
      filters: {
        livreurId: null,
        motorId: null,
        date: null,
        dateFrom: null,
        dateTo: null
      },
      journee: {
        Date: new Date().toISOString().slice(0, 10),
        LivreurId: null,
        MotorId: null,
        Recette: 0,
        TotalDeponse: 0,
        PartieLivreur: 0,
        Net: 0,
      },
    };
  },
  created() {
    this.fetchLivreurs();
    this.fetchMotors();
    this.fetchJournees();
  },
  computed: {
    filteredJournees() {
      return this.journees.filter(j => {
        if (this.filters.livreurId && j.LivreurId !== this.filters.livreurId) return false;
        if (this.filters.motorId && j.MotorId !== this.filters.motorId) return false;
        if (this.filters.date && j.Date !== this.filters.date) return false;
        if (this.filters.dateFrom && j.Date < this.filters.dateFrom) return false;
        if (this.filters.dateTo && j.Date > this.filters.dateTo) return false;
        return true;
      });
    },
    totalRecette() {
      return this.filteredJournees.reduce((sum, j) => sum + j.Recette, 0);
    },
    totalDepenses() {
      return this.filteredJournees.reduce((sum, j) => sum + j.TotalDeponse, 0);
    },
    totalNet() {
      return this.filteredJournees.reduce((sum, j) => sum + j.Net, 0);
    },
    calculatedPartieLivreur() {
      const selectedLivreur = this.livreurs.find(l => l.id === this.journee.LivreurId);
      if (!selectedLivreur || !this.journee.Recette) return '0.00 DT';
      const partie = (this.journee.Recette * selectedLivreur.Pourcentage) / 100;
      return `${partie.toFixed(2)} DT`;
    },
    calculatedNet() {
      const selectedLivreur = this.livreurs.find(l => l.id === this.journee.LivreurId);
      if (!selectedLivreur || !this.journee.Recette) return '0.00 DT';
      const partie = (this.journee.Recette * selectedLivreur.Pourcentage) / 100;
      const net = this.journee.Recette - this.journee.TotalDeponse - partie;
      return `${net.toFixed(2)} DT`;
    }
  },
  methods: {
    fetchLivreurs() {
      axios.get('/Livreur')
        .then(response => {
          this.livreurs = response.data;
        })
        .catch(error => {
          console.error('Error fetching livreurs:', error);
          this.error = 'Erreur lors du chargement des livreurs';
        });
    },
    fetchMotors() {
      axios.get('/Motor')
        .then(response => {
          this.motors = response.data;
        })
        .catch(error => {
          console.error('Error fetching motors:', error);
          this.error = 'Erreur lors du chargement des motors';
        });
    },
    fetchJournees() {
      axios.get('/Journee')
        .then(response => {
          this.journees = response.data;
        })
        .catch(error => {
          console.error('Error fetching journees:', error);
        });
    },
    addJournee() {
      // Validation
      if (!this.journee.LivreurId || !this.journee.MotorId) {
        this.error = 'Veuillez sélectionner un livreur et un motor';
        setTimeout(() => {
          this.error = null;
        }, 3000);
        return;
      }

      this.loading = true;
      this.success = false;
      this.error = null;

      const selectedLivreur = this.livreurs.find(livreur => livreur.id === this.journee.LivreurId);
      if (selectedLivreur) {
        this.journee.PartieLivreur = (this.journee.Recette * selectedLivreur.Pourcentage) / 100;
        this.journee.Net = this.journee.Recette - this.journee.TotalDeponse - this.journee.PartieLivreur;
      }
      
      axios.post('/Journee', this.journee)
        .then(response => {
          console.log('Journee added successfully:', response.data);
          this.success = true;
          this.loading = false;
          this.fetchJournees(); // Refresh list
          
          // Reset form after 2 seconds
          setTimeout(() => {
            Object.assign(this.journee, {
              Date: new Date().toISOString().slice(0, 10),
              LivreurId: null,
              MotorId: null,
              Recette: 0,
              TotalDeponse: 0,
              PartieLivreur: 0,
              Net: 0,
            });
            this.success = false;
          }, 2000);
        })
        .catch(error => {
          console.error('Error adding journee:', error);
          this.error = 'Erreur lors de l\'ajout de la journée';
          this.loading = false;
        });
    },
    updateJournee() {
      if (!this.journee.id) {
        this.addJournee();
        return;
      }

      // Validation
      if (!this.journee.LivreurId || !this.journee.MotorId) {
        this.error = 'Veuillez sélectionner un livreur et un motor';
        setTimeout(() => {
          this.error = null;
        }, 3000);
        return;
      }

      this.loading = true;
      this.success = false;
      this.error = null;

      const selectedLivreur = this.livreurs.find(livreur => livreur.id === this.journee.LivreurId);
      if (selectedLivreur) {
        this.journee.PartieLivreur = (this.journee.Recette * selectedLivreur.Pourcentage) / 100;
        this.journee.Net = this.journee.Recette - this.journee.TotalDeponse - this.journee.PartieLivreur;
      }

      axios.put(`/Journee/${this.journee.id}`, this.journee)
        .then(response => {
          console.log('Journee updated successfully:', response.data);
          this.success = true;
          this.loading = false;
          this.fetchJournees();
          
          setTimeout(() => {
            Object.assign(this.journee, {
              Date: new Date().toISOString().slice(0, 10),
              LivreurId: null,
              MotorId: null,
              Recette: 0,
              TotalDeponse: 0,
              PartieLivreur: 0,
              Net: 0,
            });
            this.success = false;
          }, 2000);
        })
        .catch(error => {
          console.error('Error updating journee:', error);
          this.error = 'Erreur lors de la mise à jour de la journée';
          this.loading = false;
        });
    },
    deleteJournee(id) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette journée ?')) {
        return;
      }

      axios.delete(`/Journee/${id}`)
        .then(() => {
          this.fetchJournees();
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 2000);
        })
        .catch(error => {
          console.error('Error deleting journee:', error);
          this.error = 'Erreur lors de la suppression de la journée';
          setTimeout(() => {
            this.error = null;
          }, 3000);
        });
    },
    editJournee(journee) {
      this.journee = {
        id: journee.id,
        Date: journee.Date,
        LivreurId: journee.LivreurId,
        MotorId: journee.MotorId,
        Recette: journee.Recette,
        TotalDeponse: journee.TotalDeponse,
        PartieLivreur: journee.PartieLivreur,
        Net: journee.Net,
      };
      this.showJourneesList = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelEdit() {
      Object.assign(this.journee, {
        Date: new Date().toISOString().slice(0, 10),
        LivreurId: null,
        MotorId: null,
        Recette: 0,
        TotalDeponse: 0,
        PartieLivreur: 0,
        Net: 0,
      });
    },
    resetFilters() {
      this.filters = {
        livreurId: null,
        motorId: null,
        date: null,
        dateFrom: null,
        dateTo: null
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
    }
  },
};
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 200 200" fill="none">
            <path d="M60 80L80 60L140 60L140 80L100 80L100 100L120 100L120 120L100 120L100 140L140 140L140 160L60 160Z" fill="#F4B942"/>
            <path d="M140 60L160 80L160 160L140 140Z" fill="#F4B942" opacity="0.8"/>
          </svg>
        </div>
        <h2>{{ journee.id ? 'Modifier une Journée' : 'Ajouter une Journée' }}</h2>
        <p class="subtitle">FLEXPRESS Delivery</p>
      </div>

      <form @submit.prevent="journee.id ? updateJournee() : addJournee()" class="form">
        <!-- Success Message -->
        <transition name="slide-fade">
          <div v-if="success" class="alert alert-success">
            <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ journee.id ? 'Journée modifiée avec succès !' : 'Journée ajoutée avec succès !' }}
          </div>
        </transition>

        <!-- Error Message -->
        <transition name="slide-fade">
          <div v-if="error" class="alert alert-error">
            <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ error }}
          </div>
        </transition>

        <!-- Date Field -->
        <div class="form-group">
          <label for="date">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Date
          </label>
          <input type="date" id="date" v-model="journee.Date" class="input" required>
        </div>

        <!-- Livreur Field -->
        <div class="form-group">
          <label for="livreur">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Livreur
          </label>
          <select id="livreur" v-model="journee.LivreurId" class="select" required>
            <option :value="null" disabled>Choisissez un livreur</option>
            <option v-for="livreur in livreurs" :key="livreur.id" :value="livreur.id">
              {{ livreur.nom }} ({{ livreur.Pourcentage }}%)
            </option>
          </select>
        </div>

        <!-- Motor Field -->
        <div class="form-group">
          <label for="motor">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Motor
          </label>
          <select id="motor" v-model="journee.MotorId" class="select" required>
            <option :value="null" disabled>Choisissez un motor</option>
            <option v-for="motor in motors" :key="motor.id" :value="motor.id">
              {{ motor.NumPlaque }} - {{ motor.Color }}
            </option>
          </select>
        </div>

        <!-- Recette Field -->
        <div class="form-group">
          <label for="recette">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recette (DT)
          </label>
          <input type="number" id="recette" v-model.number="journee.Recette" class="input" min="0" step="0.01" required>
        </div>

        <!-- Total Depense Field -->
        <div class="form-group">
          <label for="totalDeponse">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Total Dépense (DT)
          </label>
          <input type="number" id="totalDeponse" v-model.number="journee.TotalDeponse" class="input" min="0" step="0.01" required>
        </div>

        <!-- Partie Livreur Field (Disabled) -->
        <div class="form-group">
          <label for="partieLivreur">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Partie Livreur
          </label>
          <input type="text" id="partieLivreur" :value="calculatedPartieLivreur" class="input input-disabled" disabled>
        </div>

        <!-- Net Field (Disabled) -->
        <div class="form-group">
          <label for="net">
            <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Net (DT)
          </label>
          <input type="text" id="net" :value="calculatedNet" class="input input-disabled input-net" disabled>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading" class="btn-content">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!journee.id" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ journee.id ? 'Modifier la Journée' : 'Ajouter la Journée' }}
          </span>
          <span v-else class="loading">
            <svg class="spinner" viewBox="0 0 24 24">
              <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            </svg>
            {{ journee.id ? 'Modification en cours...' : 'Ajout en cours...' }}
          </span>
        </button>

        <!-- Cancel Button (shown when editing) -->
        <button v-if="journee.id" type="button" @click="cancelEdit" class="btn-cancel">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Annuler
        </button>

        <!-- View All Button -->
        <button type="button" @click="showJourneesList = true" class="btn-view-all">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Voir toutes les journées
        </button>
      </form>
    </div>

    <!-- Journees List Modal -->
    <transition name="modal-fade">
      <div v-if="showJourneesList" class="modal-overlay" @click="showJourneesList = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Liste des Journées</h2>
            <button @click="showJourneesList = false" class="btn-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Filters -->
          <div class="filters">
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

            <div class="filter-group">
              <label>Date</label>
              <input type="date" v-model="filters.date" class="filter-input" />
            </div>

            <div class="filter-group">
              <label>Du</label>
              <input type="date" v-model="filters.dateFrom" class="filter-input" />
            </div>

            <div class="filter-group">
              <label>Au</label>
              <input type="date" v-model="filters.dateTo" class="filter-input" />
            </div>

            <button @click="resetFilters" class="btn-reset">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>

          <!-- Journees Table -->
          <div class="table-container">
            <table class="journees-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Livreur</th>
                  <th>Motor</th>
                  <th>Recette</th>
                  <th>Dépense</th>
                  <th>Partie Livreur</th>
                  <th>Net</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="journee in filteredJournees" :key="journee.id">
                  <td>{{ formatDate(journee.Date) }}</td>
                  <td>{{ getLivreurName(journee.LivreurId) }}</td>
                  <td>{{ getMotorPlaque(journee.MotorId) }}</td>
                  <td class="amount">{{ journee.Recette.toFixed(2) }} DT</td>
                  <td class="amount">{{ journee.TotalDeponse.toFixed(2) }} DT</td>
                  <td class="amount">{{ journee.PartieLivreur.toFixed(2) }} DT</td>
                  <td class="amount positive">{{ journee.Net.toFixed(2) }} DT</td>
                  <td class="actions">
                    <button @click="editJournee(journee)" class="btn-edit" title="Modifier">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteJournee(journee.id)" class="btn-delete" title="Supprimer">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredJournees.length === 0">
                  <td colspan="8" class="no-data">Aucune journée trouvée</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="summary">
            <div class="summary-item">
              <span class="summary-label">Total Recettes:</span>
              <span class="summary-value">{{ totalRecette.toFixed(2) }} DT</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Dépenses:</span>
              <span class="summary-value">{{ totalDepenses.toFixed(2) }} DT</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Net:</span>
              <span class="summary-value positive">{{ totalNet.toFixed(2) }} DT</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 550px;
  overflow: hidden;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.card-header h2 {
  color: white;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.form {
  padding: 2rem;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.alert {
  padding: 0.875rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.9rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #F4B942;
}

.input,
.select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  color: #1f2937;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #F4B942;
  background: white;
  box-shadow: 0 0 0 4px rgba(244, 185, 66, 0.1);
}

.input:hover,
.select:hover {
  border-color: #d1d5db;
  background: white;
}

.select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F4B942'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5rem;
  padding-right: 3rem;
}

.input-disabled {
  background: #f3f4f6 !important;
  color: #6b7280;
  cursor: not-allowed;
  font-weight: 600;
}

.input-net {
  color: #10b981 !important;
  font-weight: 700;
  font-size: 1.1rem;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 185, 66, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner-circle {
  stroke-dasharray: 50;
  stroke-dashoffset: 25;
}

.btn-view-all {
  width: 100%;
  padding: 1rem;
  background: white;
  color: #F4B942;
  border: 2px solid #F4B942;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-view-all:hover {
  background: #F4B942;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 185, 66, 0.3);
}

.btn-cancel {
  width: 100%;
  padding: 1rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f3f4f6;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  border-radius: 24px 24px 0 0;
}

.modal-header h2 {
  color: white;
  font-size: 1.5rem;
  margin: 0;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close svg {
  width: 20px;
  height: 20px;
  color: white;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-bottom: 2px solid #f3f4f6;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
}

.filter-select,
.filter-input {
  padding: 0.625rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #F4B942;
  box-shadow: 0 0 0 3px rgba(244, 185, 66, 0.1);
}

.btn-reset {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  align-self: flex-end;
}

.btn-reset svg {
  width: 18px;
  height: 18px;
}

.btn-reset:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.table-container {
  padding: 1.5rem 2rem;
  overflow-x: auto;
}

.journees-table {
  width: 100%;
  border-collapse: collapse;
}

.journees-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.journees-table th {
  padding: 0.875rem;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.journees-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.journees-table tbody tr:hover {
  background: #fef9f0;
}

.journees-table td {
  padding: 1rem 0.875rem;
  color: #4b5563;
  font-size: 0.9rem;
}

.journees-table td.amount {
  font-weight: 600;
  color: #1f2937;
}

.journees-table td.positive {
  color: #10b981;
}

.no-data {
  text-align: center !important;
  padding: 3rem !important;
  color: #9ca3af !important;
  font-style: italic;
}

.summary {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 2px solid #e5e7eb;
  border-radius: 0 0 24px 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-value.positive {
  color: #10b981;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-edit,
.btn-delete {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.btn-edit svg,
.btn-delete svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  .card-header h2 {
    font-size: 1.5rem;
  }
  
  .form {
    padding: 1.5rem;
  }
  
  .logo-icon {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .table-container {
    padding: 1rem;
  }
}
</style>