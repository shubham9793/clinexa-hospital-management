import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { ManageDoctorsComponent } from './pages/admin/manage-doctors/manage-doctors.component';
import { AddDoctorComponent } from './pages/admin/add-doctor/add-doctor.component';
import { ManageDepartmentsComponent } from './pages/admin/manage-departments/manage-departments.component';
import { AddDepartmentComponent } from './pages/admin/add-department/add-department.component';
import { ManageReceptionistsComponent } from './pages/admin/manage-receptionists/manage-receptionists.component';
import { AddReceptionistComponent } from './pages/admin/add-receptionist/add-receptionist.component';

import { ReceptionistDashboardComponent } from './pages/receptionist/receptionist-dashboard/receptionist-dashboard.component';
import { ManagePatientsComponent } from './pages/receptionist/manage-patients/manage-patients.component';
import { AddPatientComponent } from './pages/receptionist/add-patient/add-patient.component';
import { RoleGuard } from './gaurds/role.guard';
import { ManagePatientComponent } from './pages/patient/manage-patient/manage-patient.component';
import { PatientDashboardComponent } from './pages/patient/patient-dashboard/patient-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'login/:role',
    component: LoginComponent,
  },

  {
    path: 'register/patient',
    component: RegisterComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  // =========================
  // ADMIN ROUTES
  // =========================

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'manage-doctors',
    component: ManageDoctorsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'add-doctor',
    component: AddDoctorComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'edit-doctor/:id',
    component: AddDoctorComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'manage-departments',
    component: ManageDepartmentsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'add-department',
    component: AddDepartmentComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'edit-department/:id',
    component: AddDepartmentComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'manage-receptionists',
    component: ManageReceptionistsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'add-receptionist',
    component: AddReceptionistComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'edit-receptionist/:id',
    component: AddReceptionistComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
  },

  // =========================
  // RECEPTIONIST ROUTES
  // =========================

  {
    path: 'receptionist-dashboard',
    component: ReceptionistDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['receptionist'] },
  },

  {
    path: 'manage-patients',
    component: ManagePatientsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['receptionist'] },
  },

  {
    path: 'add-patient',
    component: AddPatientComponent,
    canActivate: [RoleGuard],
    data: { roles: ['receptionist'] },
  },

  {
    path: 'edit-patient/:id',
    component: AddPatientComponent,
    canActivate: [RoleGuard],
    data: { roles: ['receptionist'] },
  },

  {
    path: 'manage-patient',
    component: ManagePatientComponent,
  },
  {
    path: 'patient-dashboard',
    component: PatientDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['patient'] },
  },

  // Invalid URL
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
