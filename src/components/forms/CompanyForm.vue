<template>
  <form class="card" @submit.prevent="save">
    <div class="card-header">Company information</div>
    <div class="card-body">
      <LogoUpload
        v-model="company.logoUrl"
        @logoChanged="onLogoChanged"
        @logoRemoved="onLogoRemoved"
      />
      
      <div class="row">
        <!-- Informations de base -->
        <div class="col-md-6 mb-4">
          <TextInput
            label="Company name"
            :required="true"
            placeholder="Add company name"
            v-model="company.company_name"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Slogan or tagline"
            placeholder="Add company slogan"
            v-model="company.slogan"
          />
        </div>
        
        <!-- Descriptions -->
        <div class="col-md-12 mb-4">
          <TextAreaInput
            label="Description"
            placeholder="Add company description"
            v-model="company.description"
            :rows="3"
          />
        </div>
        <div class="col-md-12 mb-4">
          <TextAreaInput
            label="About"
            placeholder="Tell us about your company"
            v-model="company.about"
            :rows="5"
          />
        </div>
        
        <!-- Secteur et industrie -->
        <div class="col-md-6 mb-4">
          <MultiSelectInput
            :options="categories"
            :normalizer="(obj: any) => {
              return {
                label: obj.name,
                value: obj.id
              };
            }"
            :required="true"
            :multiple="false"
            v-model="company.category"
            label="Sector"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Industry"
            placeholder="Add industry"
            v-model="company.industry"
          />
        </div>
        
        <!-- Taille et dates -->
        <div class="col-md-4 mb-4">
          <MultiSelectInput
            :options="companySizeOptions"
            :normalizer="(obj: any) => {
              return {
                label: obj.label,
                value: obj.value
              };
            }"
            :multiple="false"
            v-model="company.companySize"
            label="Company size"
            placeholder="Select company size"
          />
        </div>
        <div class="col-md-4 mb-4">
          <TextInput
            label="Number of employees"
            placeholder="Exact number"
            v-model="company.numberOfEmployees"
            type="number"
          />
        </div>
        <div class="col-md-4 mb-4">
          <TextInput
            label="Founded year"
            placeholder="e.g., 2020"
            v-model="company.foundedYear"
            type="number"
          />
        </div>
        
        <!-- Localisation -->
        <div class="col-md-6 mb-4">
          <TextInput
            label="Headquarters"
            placeholder="Add headquarters location"
            v-model="company.headquarters"
          />
        </div>
        <div class="col-md-6 mb-4">
          <SelectCountryInput
            placeholder="Add country"
            v-model="company.country"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="City"
            placeholder="Add city"
            v-model="company.city"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Address"
            placeholder="Add address"
            v-model="company.address"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Postal code"
            placeholder="Add postal code"
            v-model="company.postalCode"
          />
        </div>
        
        <!-- Contact -->
        <div class="col-md-6 mb-4">
          <TextInput
            label="Website"
            placeholder="https://www.example.com"
            v-model="company.website"
            type="url"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Email"
            :required="true"
            placeholder="Add email"
            v-model="company.contact.email"
            type="email"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Phone"
            :required="true"
            placeholder="Add phone number"
            v-model="company.contact.phoneNumber"
          />
        </div>
        
        <!-- Password for user creation (only on create) -->
        <div class="col-md-12 mb-3 mt-3" v-if="!props.id">
          <h6 class="text-muted">User Account</h6>
        </div>
        <div class="col-md-10 mb-4" v-if="!props.id">
          <TextInput
            label="Password"
            :required="true"
            placeholder="Enter password or generate one"
            v-model="company.password"
            :type="showPassword ? 'text' : 'password'"
          />
        </div>
        <div class="col-md-2 mb-4 d-flex align-items-end" v-if="!props.id">
          <button 
            type="button" 
            class="btn btn-outline-secondary w-100" 
            @click="generatePassword"
            title="Generate random password"
          >
            🔄 Generate
          </button>
        </div>
        <div class="col-md-12 mb-4" v-if="!props.id && company.password">
          <div class="alert alert-info">
            ℹ️ <strong>Important:</strong> Save this password securely. The user will need it to log in.
            <br>
            <code style="background: #fff; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;">{{ company.password }}</code>
          </div>
        </div>
        
        <!-- Réseaux sociaux -->
        <div class="col-md-6 mb-4">
          <TextInput
            label="LinkedIn"
            placeholder="https://www.linkedin.com/company/..."
            v-model="company.socialNetworks.linkedin"
            type="url"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Twitter"
            placeholder="https://twitter.com/..."
            v-model="company.socialNetworks.twitter"
            type="url"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Facebook"
            placeholder="https://www.facebook.com/..."
            v-model="company.socialNetworks.facebook"
            type="url"
          />
        </div>
        
        <!-- Adresse de contact (pour la relation Contact) -->
        <div class="col-md-12 mb-3">
          <h6 class="text-muted">Contact Address</h6>
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Address line"
            :required="true"
            placeholder="Add address line"
            v-model="company.contact.address.line"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Contact City"
            :required="true"
            placeholder="Add city"
            v-model="company.contact.address.city"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Contact Postal code"
            :required="true"
            placeholder="Add postal code"
            v-model="company.contact.address.postalCode"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="State"
            placeholder="Add state"
            v-model="company.contact.address.state"
          />
        </div>
        <div class="col-md-6 mb-4">
          <SelectCountryInput
            :required="true"
            placeholder="Add contact country"
            v-model="company.contact.address.country"
          />
        </div>
        
        <!-- Informations de recrutement -->
        <div class="col-md-12 mb-3 mt-3">
          <h6 class="text-muted">Recruitment Information</h6>
        </div>
        <div class="col-md-12 mb-4">
          <TextAreaInput
            label="Profile sought"
            placeholder="Describe the profiles you're looking for"
            v-model="company.profileSought"
            :rows="3"
          />
        </div>
        <div class="col-md-12 mb-4">
          <TagInput
            label="Positions to fill"
            placeholder="Type a position and press Enter"
            v-model="company.positionsToFill"
            hint="Press Enter, comma, or Tab to add a position"
          />
        </div>
        <div class="col-md-12 mb-4">
          <TagInput
            label="Required skills"
            placeholder="Type a skill and press Enter"
            v-model="company.requiredSkills"
            hint="Press Enter, comma, or Tab to add a skill"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Required experience"
            placeholder="e.g., 3-5 years"
            v-model="company.requiredExperience"
          />
        </div>
        <div class="col-md-6 mb-4">
          <MultiSelectInput
            :options="jobTypes"
            :normalizer="(obj: any) => {
              return {
                label: obj.name,
                value: obj.name
              };
            }"
            :multiple="true"
            v-model="company.contractTypesArray"
            label="Contract types"
            placeholder="Select contract types"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Working hours"
            placeholder="e.g., Full-time, Part-time"
            v-model="company.workingHours"
          />
        </div>
        
        <!-- Admin only fields - Only show on edit -->
        <div class="col-md-12 mb-3 mt-3" v-if="is('admin') && props.id">
          <h6 class="text-muted">Admin Settings</h6>
        </div>
        <div class="col-md-6 mb-4" v-if="is('admin') && props.id">
          <MultiSelectInput
            :options="users"
            :normalizer="(obj: any) => {
              return {
                label: obj.email,
                value: obj.id
              };
            }"
            :multiple="false"
            v-model="company.user"
            label="User"
          />
        </div>
        <div class="col-md-6 mb-4" v-if="is('admin') && props.id">
          <MultiSelectInput
            :options="permissions"
            :normalizer="(obj: any) => {
              return {
                label: obj.title,
                value: obj.id
              };
            }"
            :multiple="false"
            v-model="company.permission"
            label="Permission"
          />
        </div>
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import {
  createCompany,
  getCompany,
  updateCompany,
  sendCompanyCredentials
} from '@/views/dashboard-module/stores/services/company.service';
import { getUsers, createUser } from '@/views/dashboard-module/stores/services/user.service';
import { getPermissions } from '@/views/dashboard-module/stores/services/company-permission.service';
import { getJobTypes } from '@/views/dashboard-module/stores/services/job-type.service';

import { useToast } from '@/composables/useToast';

import TextInput from '@/components/inputs/TextInput.vue';
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';
import LogoUpload from '@/components/inputs/LogoUpload.vue';
import TagInput from '@/components/inputs/TagInput.vue';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();
const { is } = authStore;

const router = useRouter();
const { showToast } = useToast();

const props = defineProps<{ id: string }>();

const initialContact = {
  email: undefined,
  phoneNumber: undefined,
  address: {
    line: undefined,
    city: undefined,
    country: undefined,
    postalCode: undefined,
    state: undefined
  }
};

const company = ref<any>(
  props.id
    ? (await getCompany(props.id))?.data?.result
    : {
        id: undefined,
        company_name: undefined,
        slogan: undefined,
        description: undefined,
        about: undefined,
        headquarters: undefined,
        website: undefined,
        industry: undefined,
        sector: undefined,
        companySize: undefined,
        numberOfEmployees: undefined,
        foundedYear: undefined,
        country: undefined,
        city: undefined,
        address: undefined,
        postalCode: undefined,
        profileSought: undefined,
        positionsToFill: undefined,
        requiredSkills: undefined,
        requiredExperience: undefined,
        contractTypes: undefined,
        contractTypesArray: [],
        workingHours: undefined,
        password: undefined,
        socialNetworks: {
          linkedin: undefined,
          twitter: undefined,
          facebook: undefined
        },
        status: 'public',
        contact: structuredClone(initialContact),
        logo: {
          id: undefined
        },
        category: {
          id: undefined
        },
        user: {
          id: undefined
        },
        permission: {
          id: undefined
        },
        logoId: undefined,
        logoUrl: undefined
      }
);

if (props.id && !company.value) {
  router.push({ name: 'company.add' });
} else {
  // Initialiser l'URL du logo
  if (company.value.logo) {
    company.value.logoUrl = company.value.logo.fileUrl;
    company.value.logoId = company.value.logo.id;
  }
  
  // Convertir contractTypes string en array pour le MultiSelect
  if (company.value.contractTypes && typeof company.value.contractTypes === 'string') {
    company.value.contractTypesArray = company.value.contractTypes.split(',').map((t: string) => t.trim());
  } else {
    company.value.contractTypesArray = [];
  }
  
  // Convertir companySize object en string si nécessaire
  if (company.value.companySize && typeof company.value.companySize === 'object') {
    company.value.companySize = company.value.companySize.value || company.value.companySize;
  }
}

if (!company.value.contact) {
  company.value.contact = structuredClone(initialContact);
}

if (!company.value.socialNetworks) {
  company.value.socialNetworks = {
    linkedin: undefined,
    twitter: undefined,
    facebook: undefined
  };
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'company'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined),
  is('admin') ? getPermissions(null, null, null) : Promise.resolve(undefined),
  getJobTypes(null, null, null, 'public')
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];
const permissions = data?.[2]?.data?.results?.rows || [];
const jobTypes = data?.[3]?.data?.results?.rows || [];

// Options pour company size
const companySizeOptions = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '501-1000 employees', value: '501-1000' },
  { label: '1001-5000 employees', value: '1001-5000' },
  { label: '5000+ employees', value: '5000+' }
];

const isLoading = ref(false);
const showPassword = ref(false);

const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  company.value.password = password.split('').sort(() => Math.random() - 0.5).join('');
};

const onLogoChanged = (mediaId: string, fileUrl: string) => {
  company.value.logoId = mediaId;
  company.value.logoUrl = fileUrl;
};

const onLogoRemoved = () => {
  company.value.logoId = null;
  company.value.logoUrl = null;
};

const save = async () => {
  isLoading.value = true;

  try {
    let userId = company.value.user?.id;

    // Si c'est une création, créer d'abord l'utilisateur
    if (!props.id) {
      if (!company.value.password) {
        showToast('Please enter a password or generate one', 'error');
        isLoading.value = false;
        return;
      }

      // Créer l'utilisateur
      const userData = {
        email: company.value.contact.email,
        password: company.value.password,
        firstname: company.value.company_name,
        lastname: '',
        role: 'company'
      };

      const { data: userResult } = await createUser(userData);
      
      if (!userResult?.result?.id) {
        showToast('Failed to create user account', 'error');
        isLoading.value = false;
        return;
      }

      userId = userResult.result.id;
      
      // Récupérer la permission par défaut "Initial Package"
      if (!company.value.permission?.id && permissions.length > 0) {
        const initialPermission = permissions.find((p: any) => p.title === 'Initial Package');
        if (initialPermission) {
          company.value.permission = { id: initialPermission.id };
        } else {
          // Prendre la première permission disponible
          company.value.permission = { id: permissions[0].id };
        }
      }
    }

    // Convertir contractTypesArray en string
    const contractTypesString = Array.isArray(company.value.contractTypesArray) 
      ? company.value.contractTypesArray.join(', ') 
      : company.value.contractTypes;

    // Préparer les données pour l'envoi avec tous les champs
    const companyData = {
      id: company.value.id,
      company_name: company.value.company_name,
      slogan: company.value.slogan,
      description: company.value.description,
      about: company.value.about,
      headquarters: company.value.headquarters,
      website: company.value.website,
      industry: company.value.industry,
      sector: company.value.sector,
      companySize: typeof company.value.companySize === 'object' ? company.value.companySize?.value : company.value.companySize,
      numberOfEmployees: company.value.numberOfEmployees ? parseInt(company.value.numberOfEmployees) : undefined,
      foundedYear: company.value.foundedYear ? parseInt(company.value.foundedYear) : undefined,
      country: company.value.country,
      city: company.value.city,
      address: company.value.address,
      postalCode: company.value.postalCode,
      profileSought: company.value.profileSought,
      positionsToFill: company.value.positionsToFill,
      requiredSkills: company.value.requiredSkills,
      requiredExperience: company.value.requiredExperience,
      contractTypes: contractTypesString,
      workingHours: company.value.workingHours,
      socialNetworks: company.value.socialNetworks,
      status: company.value.status,
      contact: company.value.contact,
      logo: company.value.logoId ? { id: company.value.logoId } : null,
      category: company.value.category?.id ? { id: company.value.category.id } : undefined,
      user: userId ? { id: userId } : undefined,
      permission: company.value.permission?.id ? { id: company.value.permission.id } : undefined
    };

    const { data: newData } = props.id
      ? await updateCompany(companyData)
      : await createCompany(companyData);

    if (newData?.result?.id) {
      // Si c'est une création, envoyer les identifiants par email
      if (!props.id && company.value.password) {
        try {
          await sendCompanyCredentials(
            company.value.company_name,
            company.value.contact.email,
            company.value.password
          );
          showToast('Company created successfully and credentials sent by email', 'success');
        } catch (emailError) {
          console.error('Error sending credentials email:', emailError);
          showToast('Company created but failed to send credentials email', 'warning');
        }
      } else {
        showToast(
          props.id ? 'Company updated successfully' : 'Company created successfully', 
          'success'
        );
      }
      
      router.push({ name: 'company.list' });
    } else {
      showToast('Failed to save company', 'error');
    }
  } catch (error: any) {
    console.error('Error saving company:', error);
    showToast(error.message || 'An error occurred while saving', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
