import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/auth/login/login.component';
import { JwtInterceptor } from './service/interceptors/jwt.interceptor';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { ManageDoctorsComponent } from './pages/admin/manage-doctors/manage-doctors.component';
import { AddDoctorComponent } from './pages/admin/add-doctor/add-doctor.component';
import { ManageDepartmentsComponent } from './pages/admin/manage-departments/manage-departments.component';
import { AddDepartmentComponent } from './pages/admin/add-department/add-department.component';
import { AddReceptionistComponent } from './pages/admin/add-receptionist/add-receptionist.component';
import { CommonModule } from '@angular/common';
import { ManageReceptionistsComponent } from './pages/admin/manage-receptionists/manage-receptionists.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TimeAgoPipe } from './service/pipes/time-ago.pipe';
import { ManagePatientsComponent } from './pages/receptionist/manage-patients/manage-patients.component';
import { AddPatientComponent } from './pages/receptionist/add-patient/add-patient.component';
import { ReceptionistDashboardComponent } from './pages/receptionist/receptionist-dashboard/receptionist-dashboard.component';
import { PatientDashboardComponent } from './pages/patient/patient-dashboard/patient-dashboard.component';
import { ManagePatientComponent } from './pages/patient/manage-patient/manage-patient.component';
import { DoctorDashboardComponent } from './pages/doctor/doctor-dashboard/doctor-dashboard.component';
import { VerifyOtpComponent } from './pages/auth/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { VerifyForgotPasswordComponent } from './pages/auth/verify-forgot-password/verify-forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    AdminDashboardComponent,
    ManageDoctorsComponent,
    AddDoctorComponent,
    ManageDepartmentsComponent,
    AddDepartmentComponent,
    AddReceptionistComponent,
    ManageReceptionistsComponent,
    TimeAgoPipe,
    ManagePatientsComponent,
    AddPatientComponent,
    ReceptionistDashboardComponent,
    PatientDashboardComponent,
    ManagePatientComponent,
    DoctorDashboardComponent,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    VerifyForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
