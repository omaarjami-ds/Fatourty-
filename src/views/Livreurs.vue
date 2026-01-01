<template>
  <div class="livreurs-container">
    <div class="header">
      <div class="header-content">
        <h1>Gestion des Livreurs</h1>
        <p class="subtitle">Liste complète des livreurs FLEXPRESS</p>
      </div>
      <button @click="showAddModal = true" class="btn-add">
        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter Livreur
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon active">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Livreurs Actifs</p>
          <h3 class="stat-value">{{ activeCount }}</h3>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon total">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Livreurs</p>
          <h3 class="stat-value">{{ livreurs.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div class="table-container">
        <table class="livreurs-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Pourcentage</th>
              <th>CIN</th>
              <th>Date de Départ</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="livreur in livreurs" :key="livreur.id">
              <td>
                <div class="name-cell">
                  <div class="avatar">{{ getInitials(livreur.nom) }}</div>
                  <span class="name">{{ livreur.nom }}</span>
                </div>
              </td>
              <td>{{ livreur.NumTel }}</td>
              <td>
                <span class="percentage-badge">{{ livreur.Pourcentage }}%</span>
              </td>
              <td>{{ livreur.CIN }}</td>
              <td>{{ formatDate(livreur.DateDepart) }}</td>
              <td>
                <span :class="['status-badge', livreur.etat.toLowerCase()]">
                  {{ livreur.etat }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-action btn-edit" @click="editLivreur(livreur)">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="btn-action btn-delete" @click="deleteLivreur(livreur.id)">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="livreurs.length === 0">
              <td colspan="7" class="no-data">Aucun livreur trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <transition name="modal-fade">
      <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ editMode ? 'Modifier' : 'Ajouter' }} un Livreur</h2>
            <button @click="closeModal" class="btn-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveLivreur" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nom</label>
                <input type="text" v-model="currentLivreur.nom" class="input" required />
              </div>

              <div class="form-group">
                <label>Téléphone</label>
                <input type="tel" v-model="currentLivreur.NumTel" class="input" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Pourcentage (%)</label>
                <input type="number" v-model.number="currentLivreur.Pourcentage" class="input" min="0" max="100" required />
              </div>

              <div class="form-group">
                <label>CIN</label>
                <input type="text" v-model="currentLivreur.CIN" class="input" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date de Départ</label>
                <input type="date" v-model="currentLivreur.DateDepart" class="input" required />
              </div>

              <div class="form-group">
                <label>État</label>
                <select v-model="currentLivreur.etat" class="input">
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
              <button type="submit" class="btn-save">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ editMode ? 'Mettre à jour' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Livreurs',
  data() {
    return {
      livreurs: [],
      showAddModal: false,
      editMode: false,
      currentLivreur: {
        nom: '',
        NumTel: '',
        Pourcentage: 0,
        CIN: '',
        DateDepart: new Date().toISOString().slice(0, 10),
        etat: 'Actif'
      }
    };
  },
  computed: {
    activeCount() {
      return this.livreurs.filter(l => l.etat === 'Actif').length;
    }
  },
  created() {
    this.fetchLivreurs();
  },
  methods: {
    fetchLivreurs() {
      axios.get('/Livreur')
        .then(response => {
          this.livreurs = response.data;
        })
        .catch(error => {
          console.error('Error fetching livreurs:', error);
        });
    },
    saveLivreur() {
      if (this.editMode) {
        axios.put(`/Livreur/${this.currentLivreur.id}`, this.currentLivreur)
          .then(() => {
            this.fetchLivreurs();
            this.closeModal();
          })
          .catch(error => {
            console.error('Error updating livreur:', error);
          });
      } else {
        axios.post('/Livreur', this.currentLivreur)
          .then(() => {
            this.fetchLivreurs();
            this.closeModal();
          })
          .catch(error => {
            console.error('Error adding livreur:', error);
          });
      }
    },
    editLivreur(livreur) {
      this.editMode = true;
      this.currentLivreur = { ...livreur };
      this.showAddModal = true;
    },
    deleteLivreur(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
        axios.delete(`/Livreur/${id}`)
          .then(() => {
            this.fetchLivreurs();
          })
          .catch(error => {
            console.error('Error deleting livreur:', error);
          });
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.editMode = false;
      this.currentLivreur = {
        nom: '',
        NumTel: '',
        Pourcentage: 0,
        CIN: '',
        DateDepart: new Date().toISOString().slice(0, 10),
        etat: 'Actif'
      };
    },
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR');
    }
  }
};
</script>

<style scoped>
.livreurs-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.btn-add {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 185, 66, 0.4);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Stats Grid */
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

.stat-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.stat-icon.total {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
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

/* Table */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.livreurs-table {
  width: 100%;
  border-collapse: collapse;
}

.livreurs-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.livreurs-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.livreurs-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.livreurs-table tbody tr:hover {
  background: #fef9f0;
}

.livreurs-table td {
  padding: 1rem;
  color: #4b5563;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.name {
  font-weight: 600;
  color: #1f2937;
}

.percentage-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.status-badge.actif {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactif {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
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

.btn-action svg {
  width: 18px;
  height: 18px;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
  transform: scale(1.1);
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.no-data {
  text-align: center !important;
  padding: 3rem !important;
  color: #9ca3af !important;
  font-style: italic;
}

/* Modal */
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
  max-width: 600px;
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

.modal-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.input:focus {
  outline: none;
  border-color: #F4B942;
  background: white;
  box-shadow: 0 0 0 4px rgba(244, 185, 66, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.875rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-save {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 185, 66, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .livreurs-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>