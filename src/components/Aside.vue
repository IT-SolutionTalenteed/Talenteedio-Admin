<template>
  <!-- Sidebar -->
  <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebar-menu"
        aria-controls="sidebar-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-header d-flex justify-content-between px-3">
        <h1 class="navbar-brand navbar-brand-autodark">
          <a :href="host_url">
            <img
              src="/talenteed.png"
              width="110"
              height="50"
              alt="Tabler"
              class="navbar-brand-image"
            />
          </a>
        </h1>
        <div class="navbar-nav flex-row">
          <div class="nav-item dropdown">
            <a
              href="#"
              class="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <i class="bi bi-person-fill"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="#" class="dropdown-item" @click.prevent="signout">Logout</a>
            </div>
          </div>
        </div>
      </div>

      <div class="collapse navbar-collapse" id="sidebar-menu">
        <ul class="navbar-nav pt-lg-3">
          <li v-for="nav in sideNav" :key="nav.label" class="nav-item">
            <router-link class="nav-link" v-if="nav.route" :to="nav.route">
              <i :class="nav.icon"></i>
              <span class="nav-link-title"> {{ nav.label }} </span>
            </router-link>
            <a
              class="nav-link dropdown-toggle"
              href="#navbar-base"
              data-bs-toggle="dropdown"
              data-bs-auto-close="false"
              role="button"
              aria-expanded="false"
              v-if="nav.children?.length"
            >
              <i :class="nav.icon"></i>
              <span class="nav-link-title"> {{ nav.label }} </span>
            </a>
            <div v-if="nav.children?.length" class="dropdown-menu">
              <router-link
                v-for="children in nav.children"
                :key="children.label"
                class="dropdown-item"
                :to="children.route"
              >
                <span class="nav-link-title"> {{ children.label }} </span>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const { signout, is } = useAuthStore();

const host_url = import.meta.env.VITE_HOST_URL;

let sideNav: any = [];

if (is('admin')) {
  sideNav = [
    {
      label: 'Users',
      icon: 'bi bi-people',
      children: [
        {
          label: 'Users',
          route: { name: 'user' }
        },
        {
          label: 'Company',
          route: { name: 'company' }
        },
        {
          label: 'Talent',
          route: { name: 'talent' }
        },
        {
          label: 'Freelance',
          route: { name: 'freelance' }
        },
        {
          label: 'Consultant',
          route: { name: 'consultant' }
        },
        {
          label: 'First club',
          route: { name: 'hr-first-club' }
        },
        {
          label: 'Referral',
          route: { name: 'referral' }
        }
      ]
    },
    {
      label: 'Job',
      icon: 'bi bi-bag',
      children: [
        {
          label: 'Jobs',
          route: { name: 'job' }
        },
        {
          label: 'Application in review',
          route: { name: 'job.application-in-review' }
        },
        {
          label: 'Reference',
          route: { name: 'reference' }
        },
        {
          label: 'Job type',
          route: { name: 'job.type' }
        },
        {
          label: 'Category',
          route: { name: 'job.category' }
        },
        {
          label: 'Location',
          route: { name: 'location' }
        },
        {
          label: 'Value',
          route: { name: 'value' },
          icon: 'bi bi-clipboard2-check'
        }
      ]
    },
    {
      label: 'Media',
      icon: 'bi bi-mic',
      children: [
        {
          label: 'Interview',
          route: { name: 'interview' }
        },
        {
          label: 'Articles',
          route: { name: 'article' }
        },
        {
          label: 'Events',
          route: { name: 'event' }
        },
        {
          label: 'Article category',
          route: { name: 'article.category' }
        }
      ]
    },

    {
      label: 'Settings',
      icon: 'bi bi-gear',
      children: [
        {
          label: 'Contact & site content',
          route: { name: 'setting' }
        },
        {
          label: 'Terms',
          route: { name: 'terms' }
        },
        {
          label: 'Ad',
          route: { name: 'ad' }
        },
        // {
        //   label: 'Testimonial',
        //   route: { name: 'testimonial' }
        // },
        {
          label: 'Partner',
          route: { name: 'partner' }
        }
        // {
        //   label: 'Company Permission',
        //   route: { name: 'company.permission' }
        // }
      ]
    }
  ];
} else if (is('company')) {
  sideNav = [
    {
      label: 'Profile',
      route: { name: 'profile' },
      icon: 'bi bi-person'
    },
    {
      label: 'Job',
      route: { name: 'job' },
      icon: 'bi bi-bag'
    }
  ];
} else if (is('talent')) {
  sideNav = [
    {
      label: 'Profile',
      route: { name: 'profile' },
      icon: 'bi bi-person'
    },
    {
      label: 'CV',
      route: { name: 'cv' },
      icon: 'bi bi-file-earmark-person'
    },
    {
      label: 'LM',
      route: { name: 'lm' },
      icon: 'bi bi-file-text'
    },
    {
      label: 'Application',
      route: { name: 'application' },
      icon: 'bi bi-bag-check'
    }
  ];
} else if (is('consultant')) {
  sideNav = [
    {
      label: 'Profile',
      route: { name: 'profile' },
      icon: 'bi bi-person'
    },
    {
      label: 'Tarifs',
      route: { name: 'pricing' },
      icon: 'bi bi-currency-euro'
    }
  ];
} else if (is('referral')) {
  sideNav = [
    {
      label: 'Profile',
      route: { name: 'profile' },
      icon: 'bi bi-person'
    },
    {
      label: 'Application',
      route: { name: 'application' },
      icon: 'bi bi-bag-check'
    },
    {
      label: 'Reference',
      route: { name: 'reference' },
      icon: 'bi bi-link-45deg'
    }
  ];
} else if (is('hr-first-club')) {
  sideNav = [
    {
      label: 'Profile',
      route: { name: 'profile' },
      icon: 'bi bi-person'
    }
  ];
}
</script>

<style scoped lang="scss">
.navbar-header {
  flex-grow: 1;
}

.nav-link {
  .bi {
    font-size: 20px;
  }

  .nav-link-title {
    margin-left: 10px;
  }
}

@media (min-width: 992px) {
  .navbar-header {
    flex-grow: 0;

    .navbar-brand-image {
      filter: none;
      height: unset;
    }
  }

  .navbar-vertical.navbar-expand-lg .navbar-nav {
    flex-direction: column;
    flex-grow: 0;
    min-height: auto;
  }
}
</style>
