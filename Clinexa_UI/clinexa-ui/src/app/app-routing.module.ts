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
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'manage-doctors',
    component: ManageDoctorsComponent,
  },
  {
    path: 'add-doctor',
    component: AddDoctorComponent,
  },
  {
    path: 'manage-departments',
    component: ManageDepartmentsComponent,
  },

  {
    path: 'add-department',
    component: AddDepartmentComponent,
  },

  {
    path: 'edit-doctor/:id',
    component: AddDoctorComponent,
  },

  {
    path: 'manage-receptionists',
    component: ManageReceptionistsComponent,
  },

  {
    path: 'add-receptionist',
    component: AddReceptionistComponent,
  },
  {
    path: 'edit-receptionist/:id',
    component: AddReceptionistComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
