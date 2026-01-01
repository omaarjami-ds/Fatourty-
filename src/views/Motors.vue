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
        <h2>Gestion des Motors</h2>
        <p class="subtitle">FLEXPRESS Delivery</p>
      </div>

      <div class="content">
        <!-- Success/Error Messages -->
        <transition name="slide-fade">
          <div v-if="success" class="alert alert-success">
            <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ successMessage }}
          </div>
        </transition>

        <transition name="slide-fade">
          <div v-if="error" class="alert alert-error">
            <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ error }}
          </div>
        </transition>

        <!-- Add Motor Button -->
        <div class="action-bar">
          <button @click="showAddModal = true" class="btn-add">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un Motor
          </button>
        </div>

        <!-- Motors Table -->
        <div class="table-container">
          <table class="motors-table">
            <thead>
              <tr>
                <th>
                  <svg class="th-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Numéro de Plaque
                </th>
                <th>
                  <svg class="th-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Kilométrage
                </th>
                <th>
                  <svg class="th-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Couleur
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="motor in motors" :key="motor.id">
                <td>
                  <span class="plaque-badge">{{ motor.NumPlaque }}</span>
                </td>
                <td>
                  <span class="km-value">{{ motor.Kilometrage }} km</span>
                </td>
                <td>
                  <span class="color-indicator" :style="{ backgroundColor: getColorHex(motor.Color) }"></span>
                  {{ motor.Color }}
                </td>
                <td class="actions">
                  <button @click="editMotor(motor)" class="btn-edit" title="Modifier">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteMotor(motor.id)" class="btn-delete" title="Supprimer">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="motors.length === 0">
                <td colspan="4" class="no-data">
                  <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Aucun motor trouvé
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <transition name="modal-fade">
      <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ editingMotor ? 'Modifier le Motor' : 'Ajouter un Motor' }}</h2>
            <button @click="closeModal" class="btn-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveMotor" class="modal-form">
            <div class="form-group">
              <label for="numPlaque">
                <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Numéro de Plaque
              </label>
              <input 
                type="text" 
                id="numPlaque" 
                v-model="motorForm.NumPlaque" 
                class="input" 
                placeholder="Ex: 123-TUN-456"
                required
              >
            </div>

            <div class="form-group">
              <label for="kilometrage">
                <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Kilométrage
              </label>
              <input 
                type="number" 
                id="kilometrage" 
                v-model.number="motorForm.Kilometrage" 
                class="input" 
                placeholder="Ex: 50000"
                min="0"
                required
              >
            </div>

            <div class="form-group">
              <label for="color">
                <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Couleur
              </label>
              <input 
                type="text" 
                id="color" 
                v-model="motorForm.Color" 
                class="input" 
                placeholder="Ex: Rouge, Bleu, Noir"
                required
              >
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-submit" :disabled="loading">
                <span v-if="!loading" class="btn-content">
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!editingMotor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ editingMotor ? 'Modifier' : 'Ajouter' }}
                </span>
                <span v-else class="loading">
                  <svg class="spinner" viewBox="0 0 24 24">
                    <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  </svg>
                  En cours...
                </span>
              </button>
              <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
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
  name: 'Motors',
  data() {
    return {
      motors: [],
      showAddModal: false,
      loading: false,
      success: false,
      successMessage: '',
      error: null,
      editingMotor: false,
      motorForm: {
        NumPlaque: '',
        Kilometrage: 0,
        Color: ''
      }
    };
  },
  created() {
    this.fetchMotors();
  },
  methods: {
    fetchMotors() {
      axios.get('/Motor')
        .then(response => {
          this.motors = response.data;
        })
        .catch(error => {
          console.error('Error fetching motors:', error);
          this.error = 'Erreur lors du chargement des motors';
          setTimeout(() => this.error = null, 3000);
        });
    },
    saveMotor() {
      this.loading = true;
      this.error = null;

      const request = this.editingMotor
        ? axios.put(`/Motor/${this.motorForm.id}`, this.motorForm)
        : axios.post('/Motor', this.motorForm);

      request
        .then(() => {
          this.successMessage = this.editingMotor 
            ? 'Motor modifié avec succès !' 
            : 'Motor ajouté avec succès !';
          this.success = true;
          this.loading = false;
          this.fetchMotors();
          this.closeModal();
          
          setTimeout(() => {
            this.success = false;
          }, 3000);
        })
        .catch(error => {
          console.error('Error saving motor:', error);
          this.error = 'Erreur lors de l\'enregistrement du motor';
          this.loading = false;
          setTimeout(() => this.error = null, 3000);
        });
    },
    editMotor(motor) {
      this.editingMotor = true;
      this.motorForm = { ...motor };
      this.showAddModal = true;
    },
    deleteMotor(id) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce motor ?')) {
        return;
      }

      axios.delete(`/Motor/${id}`)
        .then(() => {
          this.successMessage = 'Motor supprimé avec succès !';
          this.success = true;
          this.fetchMotors();
          setTimeout(() => {
            this.success = false;
          }, 3000);
        })
        .catch(error => {
          console.error('Error deleting motor:', error);
          this.error = 'Erreur lors de la suppression du motor';
          setTimeout(() => this.error = null, 3000);
        });
    },
    closeModal() {
      this.showAddModal = false;
      this.editingMotor = false;
      this.motorForm = {
        NumPlaque: '',
        Kilometrage: 0,
        Color: ''
      };
    },
    getColorHex(colorName) {
      const colors = {
        'rouge': '#ef4444',
        'red': '#ef4444',
        'bleu': '#3b82f6',
        'blue': '#3b82f6',
        'noir': '#1f2937',
        'black': '#1f2937',
        'blanc': '#f3f4f6',
        'white': '#f3f4f6',
        'vert': '#10b981',
        'green': '#10b981',
        'jaune': '#f59e0b',
        'yellow': '#f59e0b',
        'orange': '#f97316',
        'gris': '#6b7280',
        'gray': '#6b7280',
        'grey': '#6b7280'
      };
      return colors[colorName.toLowerCase()] || '#9ca3af';
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  max-width: 1200px;
  margin: 0 auto;
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

.content {
  padding: 2rem;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
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

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.btn-add {
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 2px solid #f3f4f6;
}

.motors-table {
  width: 100%;
  border-collapse: collapse;
}

.motors-table thead {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.motors-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.motors-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}


.th-icon {
  width: 18px;
  height: 18px;
  color: #F4B942;
}

.motors-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.motors-table tbody tr:hover {
  background: #fef9f0;
}

.motors-table td {
  padding: 1rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.plaque-badge {
  display: inline-block;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.km-value {
  font-weight: 600;
  color: #1f2937;
}

.color-indicator {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
  border: 2px solid #e5e7eb;
}

.actions {
  display: flex;
  gap: 0.5rem;
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

.no-data {
  text-align: center !important;
  padding: 3rem !important;
  color: #9ca3af !important;
  font-style: italic;
}

.no-data-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  opacity: 0.5;
}

/* Modal Styles */
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
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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
  font-size: 1.25rem;
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

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  color: #1f2937;
}

.input:focus {
  outline: none;
  border-color: #F4B942;
  background: white;
  box-shadow: 0 0 0 4px rgba(244, 185, 66, 0.1);
}

.input:hover {
  border-color: #d1d5db;
  background: white;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-submit {
  flex: 1;
  padding: 0.875rem;
  background: linear-gradient(135deg, #F4B942 0%, #F6C04F 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(244, 185, 66, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 185, 66, 0.4);
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

.btn-cancel {
flex: 1;
padding: 0.875rem;
background: white;
color: #6b7280;
border: 2px solid #e5e7eb;
border-radius: 12px;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;
}
.btn-cancel:hover {
background: #f3f4f6;
border-color: #9ca3af;
}
@media (max-width: 768px) {
  .container {
  padding: 1rem;
  }
  .content {
  padding: 1rem;
  }
  .motors-table th,
  .motors-table td {
  padding: 0.75rem 0.5rem;
  font-size: 0.875rem;
  }
  .modal-form {
  padding: 1.5rem;
  }
  .modal-actions {
  flex-direction: column;
  }
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
.btn-cancel {
flex: 1;
padding: 0.875rem;
background: white;
color: #6b7280;
border: 2px solid #e5e7eb;
border-radius: 12px;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;
}
.btn-cancel:hover {
background: #f3f4f6;
border-color: #9ca3af;
}
@media (max-width: 768px) {
.container {
padding: 1rem;
}
.content {
padding: 1rem;
}
.card-header {
padding: 2rem 1.5rem;
}
.logo-icon {
width: 50px;
height: 50px;
}
.card-header h2 {
font-size: 1.5rem;
}
.action-bar {
justify-content: stretch;
}
.btn-add {
width: 100%;
justify-content: center;
}
.table-container {
border-radius: 8px;
}
.motors-table th,
.motors-table td {
padding: 0.75rem 0.5rem;
font-size: 0.875rem;
}
.plaque-badge {
font-size: 0.8rem;
padding: 0.25rem 0.625rem;
}
.modal-content {
max-width: 95%;
}
.modal-header {
padding: 1.25rem 1.5rem;
}
.modal-header h2 {
font-size: 1.125rem;
}
.modal-form {
padding: 1.5rem;
}
.modal-actions {
flex-direction: column;
}
.btn-submit,
.btn-cancel {
width: 100%;
}
}
@media (max-width: 480px) {
.motors-table {
font-size: 0.8rem;
}
.motors-table th,
.motors-table td {
padding: 0.625rem 0.375rem;
}
.th-icon {
width: 16px;
height: 16px;
}
.color-indicator {
width: 16px;
height: 16px;
}
.btn-edit,
.btn-delete {
width: 32px;
height: 32px;
}
.btn-edit svg,
.btn-delete svg {
width: 16px;
height: 16px;
}
.no-data {
padding: 2rem !important;
font-size: 0.875rem !important;
}
.no-data-icon {
width: 40px;
height: 40px;
}
}
</style>