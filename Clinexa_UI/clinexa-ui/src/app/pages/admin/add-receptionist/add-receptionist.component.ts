import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ReceptionistService } from 'src/app/service/receptionist.service';

@Component({
  selector: 'app-add-receptionist',
  templateUrl: './add-receptionist.component.html',
  styleUrls: ['./add-receptionist.component.scss'],
})
export class AddReceptionistComponent implements OnInit {
  receptionist = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };

  isEdit = false;
  receptionistId: number | null = null;
  isSubmitting = false;

  constructor(
    private receptionistService: ReceptionistService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.receptionistId = Number(id);
      this.isEdit = true;
      this.loadReceptionist();
    }
  }

  loadReceptionist(): void {
    if (!this.receptionistId) {
      return;
    }

    this.receptionistService
      .getReceptionistById(this.receptionistId)
      .subscribe({
        next: (res: any) => {
          this.receptionist = {
            name: res.name || '',
            email: res.email || '',
            phone: res.phone || '',
            password: '',
          };
        },
        error: () => {
          this.showError('Unable to load receptionist details');
        },
      });
  }

  saveReceptionist(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const payload: any = {
      name: this.receptionist.name.trim(),
      email: this.receptionist.email.trim().toLowerCase(),
      phone: this.receptionist.phone.trim(),
      password: this.receptionist.password,
    };

    if (this.isEdit && !payload.password) {
      delete payload.password;
    }

    if (this.isEdit) {
      this.updateReceptionist(payload);
    } else {
      this.createReceptionist(payload);
    }
  }

  createReceptionist(payload: any): void {
    this.receptionistService.createReceptionist(payload).subscribe({
      next: () => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'success',
          title: 'Receptionist Created',
          text: 'Receptionist profile and login account were created successfully.',
          confirmButtonColor: '#0891b2',
        }).then(() => {
          this.router.navigate(['/manage-receptionists']);
        });
      },
      error: (err) => {
        this.isSubmitting = false;

        this.showError(
          err?.error?.message || err?.error || 'Receptionist creation failed',
        );
      },
    });
  }

  updateReceptionist(payload: any): void {
    if (!this.receptionistId) {
      this.isSubmitting = false;
      return;
    }

    this.receptionistService
      .updateReceptionist(this.receptionistId, payload)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          Swal.fire({
            icon: 'success',
            title: 'Receptionist Updated',
            text: 'Receptionist profile and login details were updated successfully.',
            confirmButtonColor: '#0891b2',
          }).then(() => {
            this.router.navigate(['/manage-receptionists']);
          });
        },
        error: (err) => {
          this.isSubmitting = false;

          this.showError(
            err?.error?.message || err?.error || 'Receptionist update failed',
          );
        },
      });
  }

  validateForm(): boolean {
    if (!this.receptionist.name.trim()) {
      this.showWarning('Receptionist name is required');
      return false;
    }

    if (!this.receptionist.email.trim()) {
      this.showWarning('Receptionist email is required');
      return false;
    }

    if (!this.isValidEmail(this.receptionist.email)) {
      this.showWarning('Please enter a valid email address');
      return false;
    }

    if (!this.receptionist.phone.trim()) {
      this.showWarning('Receptionist phone number is required');
      return false;
    }

    if (!/^[0-9]{10}$/.test(this.receptionist.phone.trim())) {
      this.showWarning('Phone number must be 10 digits');
      return false;
    }

    if (!this.isEdit && !this.receptionist.password) {
      this.showWarning('Receptionist login password is required');
      return false;
    }

    if (this.receptionist.password && this.receptionist.password.length < 6) {
      this.showWarning('Password must contain at least 6 characters');
      return false;
    }

    return true;
  }

  goBack(): void {
    this.router.navigate(['/manage-receptionists']);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Required Information',
      text: message,
      confirmButtonColor: '#0891b2',
    });
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text: message,
      confirmButtonColor: '#0891b2',
    });
  }
}
