import type { RouteRecordRaw } from 'vue-router';

import { access } from '@/router/middlware';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import Layout from './Layout.vue';
import UserList from './views/user/UserList.vue';
import UserForm from './views/user/UserForm.vue';
import ProfileForm from './views/profile/ProfileForm.vue';
import CompanyList from './views/company/CompanyList.vue';
import CompanyForm from './views/company/CompanyForm.vue';
import CompanyCategoryList from './views/company/CompanyCategoryList.vue';
import CompanyPermissionList from './views/company/CompanyPermissionList.vue';
import ArticleList from './views/article/ArticleList.vue';
import ArticleForm from './views/article/ArticleForm.vue';
import ArticleCategoryList from './views/article/ArticleCategoryList.vue';
import EventList from './views/event/EventList.vue';
import EventForm from './views/event/EventForm.vue';
import EventCategoryList from './views/event/EventCategoryList.vue';
import ReferralList from './views/referral/ReferralList.vue';
import ReferralForm from './views/referral/ReferralForm.vue';
import ReferralCategoryList from './views/referral/ReferralCategoryList.vue';
import HrFirstClubList from './views/hrFirstClub/HrFirstClubList.vue';
import HrFirstClubForm from './views/hrFirstClub/HrFirstClubForm.vue';
import TalentList from './views/talent/TalentList.vue';
import TalentForm from './views/talent/TalentForm.vue';
import TalentCategoryList from './views/talent/TalentCategoryList.vue';
import FreelanceList from './views/freelance/FreelanceList.vue';
import FreelanceForm from './views/freelance/FreelanceForm.vue';
import ConsultantList from './views/consultant/ConsultantList.vue';
import ConsultantForm from './views/consultant/ConsultantForm.vue';
import LocationList from './views/location/LocationList.vue';
import ReferredList from './views/referred/ReferredList.vue';
import JobApplicationDetail from './views/job/JobApplicationDetail.vue';
import JobApplicationList from './views/job/JobApplicationList.vue';
import JobCategoryList from './views/job/JobCategoryList.vue';
import JobForm from './views/job/JobForm.vue';
import JobList from './views/job/JobList.vue';
import JobTypeList from './views/job/JobTypeList.vue';
import LMForm from './views/lm/LMForm.vue';
import LMList from './views/lm/LMList.vue';
import CVForm from './views/cv/CVForm.vue';
import CVList from './views/cv/CVList.vue';
import ApplicationDetail from './views/application/ApplicationDetail.vue';
import ApplicationInReviewDetail from './views/job/ApplicationInReviewDetail.vue';
import ApplicationInReviewList from './views/job/ApplicationInReviewList.vue';
import ApplicationList from './views/application/ApplicationList.vue';
import TestimonialList from './views/testimonial/TestimonialList.vue';
import SettingForm from './views/setting/SettingForm.vue';
import TermsForm from './views/terms/TermsForm.vue';
import CVPdf from './views/cv/CVPdf.vue';
import LMPdf from './views/lm/LMPdf.vue';
import PartnerList from './views/partner/PartnerList.vue';
import AdList from './views/ad/AdList.vue';
import InterviewList from './views/interview/InterviewList.vue';
import InterviewForm from './views/interview/InterviewForm.vue';
import ValueList from './views/value/ValueList.vue';
import PricingList from './views/pricing/PricingList.vue';
import PricingForm from './views/pricing/PricingForm.vue';
import Wallet from './views/wallet/Wallet.vue';
import CreneauxList from './views/creneaux/CreneauxList.vue';

const routes: RouteRecordRaw = {
  path: '',
  component: Layout,
  redirect: { name: 'dashboard' },
  children: [
    {
      path: '',
      name: 'dashboard',
      redirect: { name: 'user' }
      // component: () => import('./views/Dashboard.vue')
    },
    {
      path: 'user',
      name: 'user',
      redirect: { name: 'user.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'user.list',
          component: UserList
        },
        {
          path: 'add',
          name: 'user.add',
          component: UserForm
        },
        {
          path: 'edit/:id',
          name: 'user.edit',
          component: UserForm
        }
      ]
    },
    {
      path: 'profile',
      name: 'profile',
      meta: {
        middleware: [access('company | talent | referral | hr-first-club | consultant')]
      },
      component: ProfileForm
    },
    {
      path: 'company',
      name: 'company',
      redirect: { name: 'company.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'company.list',
          component: CompanyList
        },
        {
          path: 'add',
          name: 'company.add',
          component: CompanyForm
        },
        {
          path: 'edit/:id',
          name: 'company.edit',
          component: CompanyForm
        },
        {
          path: 'category',
          name: 'company.category',
          component: CompanyCategoryList
        },
        {
          path: 'permission',
          name: 'company.permission',
          component: CompanyPermissionList
        }
      ]
    },
    {
      path: 'referral',
      name: 'referral',
      redirect: { name: 'referral.list' },
      children: [
        {
          path: '',
          name: 'referral.list',
          component: ReferralList
        },
        {
          path: 'add',
          name: 'referral.add',
          component: ReferralForm
        },
        {
          path: 'edit/:id',
          name: 'referral.edit',
          component: ReferralForm
        },
        {
          path: 'category',
          name: 'referral.category',
          component: ReferralCategoryList
        }
      ]
    },
    {
      path: 'hr-first-club',
      name: 'hr-first-club',
      redirect: { name: 'hr-first-club.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'hr-first-club.list',
          component: HrFirstClubList
        },
        {
          path: 'add',
          name: 'hr-first-club.add',
          component: HrFirstClubForm
        },
        {
          path: 'edit/:id',
          name: 'hr-first-club.edit',
          component: HrFirstClubForm
        }
      ]
    },
    {
      path: 'talent',
      name: 'talent',
      redirect: { name: 'talent.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'talent.list',
          component: TalentList
        },
        {
          path: 'add',
          name: 'talent.add',
          component: TalentForm
        },
        {
          path: 'edit/:id',
          name: 'talent.edit',
          component: TalentForm
        },
        {
          path: 'category',
          name: 'talent.category',
          component: TalentCategoryList
        }
      ]
    },
    {
      path: 'freelance',
      name: 'freelance',
      redirect: { name: 'freelance.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'freelance.list',
          component: FreelanceList
        },
        {
          path: 'add',
          name: 'freelance.add',
          component: FreelanceForm
        },
        {
          path: 'edit/:id',
          name: 'freelance.edit',
          component: FreelanceForm
        }
      ]
    },
    {
      path: 'consultant',
      name: 'consultant',
      redirect: { name: 'consultant.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'consultant.list',
          component: ConsultantList
        },
        {
          path: 'add',
          name: 'consultant.add',
          component: ConsultantForm
        },
        {
          path: 'edit/:id',
          name: 'consultant.edit',
          component: ConsultantForm
        }
      ]
    },
    {
      path: 'article',
      name: 'article',
      redirect: { name: 'article.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'article.list',
          component: ArticleList
        },
        {
          path: 'add',
          name: 'article.add',
          meta: {
            middleware: [access('admin')]
          },
          component: ArticleForm
        },
        {
          path: 'edit/:id',
          name: 'article.edit',
          meta: {
            middleware: [access('admin')]
          },
          component: ArticleForm
        },
        {
          path: 'category',
          name: 'article.category',
          meta: {
            middleware: [access('admin')]
          },
          component: ArticleCategoryList
        }
      ]
    },
    {
      path: 'event',
      name: 'event',
      redirect: { name: 'event.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'event.list',
          component: EventList
        },
        {
          path: 'add',
          name: 'event.add',
          component: EventForm
        },
        {
          path: 'edit/:id',
          name: 'event.edit',
          component: EventForm
        },
        {
          path: 'category',
          name: 'event.category',
          component: EventCategoryList
        }
      ]
    },
    {
      path: 'interview',
      name: 'interview',
      redirect: { name: 'interview.list' },
      meta: {
        middleware: [access('admin')]
      },
      children: [
        {
          path: '',
          name: 'interview.list',
          component: InterviewList
        },
        {
          path: 'add',
          name: 'interview.add',
          component: InterviewForm
        },
        {
          path: 'edit/:id',
          name: 'interview.edit',
          component: InterviewForm
        }
      ]
    },
    {
      path: 'location',
      name: 'location',
      meta: {
        middleware: [access('admin')]
      },
      component: LocationList
    },
    {
      path: 'reference',
      name: 'reference',
      meta: {
        middleware: [access('admin | referral')]
      },
      component: ReferredList
    },
    {
      path: 'value',
      name: 'value',
      meta: {
        middleware: [access('admin')]
      },
      component: ValueList
    },
    {
      path: 'partner',
      name: 'partner',
      meta: {
        middleware: [access('admin')]
      },
      component: PartnerList
    },
    {
      path: 'ad',
      name: 'ad',
      meta: {
        middleware: [access('admin')]
      },
      component: AdList
    },
    {
      path: 'testimonial',
      name: 'testimonial',
      meta: {
        middleware: [access('admin')]
      },
      component: TestimonialList
    },
    {
      path: 'setting',
      name: 'setting',
      meta: {
        middleware: [access('admin')]
      },
      component: SettingForm
    },
    {
      path: 'terms',
      name: 'terms',
      meta: {
        middleware: [access('admin')]
      },
      component: TermsForm
    },
    {
      path: 'job',
      name: 'job',
      redirect: { name: 'job.list' },
      meta: {
        middleware: [access('admin | company')]
      },
      children: [
        {
          path: '',
          name: 'job.list',
          component: JobList
        },
        {
          path: 'add',
          name: 'job.add',
          meta: {
            middleware: [access('admin | company')]
          },
          component: JobForm
        },
        {
          path: 'edit/:id',
          name: 'job.edit',
          meta: {
            middleware: [access('admin | company')]
          },
          component: JobForm
        },
        {
          path: 'application-in-review',
          name: 'job.application-in-review',
          meta: {
            middleware: [access('admin')]
          },
          component: ApplicationInReviewList
        },
        {
          path: 'application-in-review/:id',
          name: 'job.application-in-review.detail',
          meta: {
            middleware: [access('admin')]
          },
          component: ApplicationInReviewDetail
        },
        {
          path: ':job/application',
          name: 'job.application',
          redirect: { name: 'job.application.list' },
          children: [
            {
              path: '',
              name: 'job.application.list',
              component: JobApplicationList
            },
            {
              path: ':id',
              name: 'job.application.detail',
              component: JobApplicationDetail
            }
          ]
        },
        {
          path: 'category',
          name: 'job.category',
          meta: {
            middleware: [access('admin')]
          },
          component: JobCategoryList
        },
        {
          path: 'type',
          name: 'job.type',
          meta: {
            middleware: [access('admin')]
          },
          component: JobTypeList
        }
      ]
    },
    {
      path: 'cv',
      name: 'cv',
      redirect: { name: 'cv.list' },
      meta: {
        middleware: [access('admin | talent')],
        excludedRoutes: ['cv.pdf']
      },
      children: [
        {
          path: '',
          name: 'cv.list',
          component: CVList
        },
        {
          path: 'add',
          name: 'cv.add',
          meta: {
            middleware: [access('talent')]
          },
          component: CVForm
        },
        {
          path: 'edit/:id',
          name: 'cv.edit',
          component: CVForm
        },
        {
          path: 'pdf/:id',
          name: 'cv.pdf',
          component: CVPdf
        }
      ]
    },
    {
      path: 'lm',
      name: 'lm',
      redirect: { name: 'lm.list' },
      meta: {
        middleware: [access('admin | talent')],
        excludedRoutes: ['lm.pdf']
      },
      children: [
        {
          path: '',
          name: 'lm.list',
          component: LMList
        },
        {
          path: 'add',
          name: 'lm.add',
          meta: {
            middleware: [access('talent')]
          },
          component: LMForm
        },
        {
          path: 'edit/:id',
          name: 'lm.edit',
          component: LMForm
        },
        {
          path: 'pdf/:id',
          name: 'lm.pdf',
          component: LMPdf
        }
      ]
    },
    {
      path: 'application',
      name: 'application',
      meta: {
        middleware: [access('talent | referral')]
      },
      redirect: { name: 'application.list' },
      children: [
        {
          path: '',
          name: 'application.list',
          component: ApplicationList
        },
        {
          path: ':id',
          name: 'application.detail',
          component: ApplicationDetail
        }
      ]
    },
    {
      path: 'pricing',
      name: 'pricing',
      redirect: { name: 'pricing.list' },
      meta: {
        middleware: [access('consultant')]
      },
      children: [
        {
          path: '',
          name: 'pricing.list',
          component: PricingList
        },
        {
          path: 'add',
          name: 'pricing.add',
          component: PricingForm
        },
        {
          path: 'edit/:id',
          name: 'pricing.edit',
          component: PricingForm
        }
      ]
    },
    {
      path: 'wallet',
      name: 'wallet',
      meta: {
        middleware: [access('consultant')]
      },
      component: Wallet
    },
    {
      path: 'creneaux',
      name: 'creneaux',
      redirect: { name: 'creneaux.list' },
      meta: {
        middleware: [access('consultant')]
      },
      children: [
        {
          path: '',
          name: 'creneaux.list',
          component: CreneauxList
        }
      ]
    },
    {
      path: 'wallet-test',
      name: 'wallet-test',
      component: () => import('./views/wallet/WalletTest.vue')
    }
  ]
};

export default routes;
