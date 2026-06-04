import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from 'src/app/service/department.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent implements OnInit {
  departmentId!: number;

  isEditMode = false;

  department = {
    name: '',
    description: '',
  };

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;

      this.departmentId = Number(id);

      this.departmentService.getById(this.departmentId).subscribe({
        next: (res: any) => {
          this.department = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  createDepartment() {
    if (this.isEditMode) {
      this.departmentService
        .updateDepartment(this.departmentId, this.department)
        .subscribe({
          next: () => {
             Swal.fire({
                          icon: 'success',
                          title: 'Receptionist Updated',
                          text: 'Details updated successfully.',
                          confirmButtonColor: '#2563eb',
                          background: '#ffffff',
                          color: '#1e293b',
                          timer: 2000,
                          showConfirmButton: false,
                        });

            this.router.navigate(['/manage-departments']);
          },

          error: (err) => {
           Swal.fire({
             icon: 'success',
             title: 'Updated Failed',
             text: 'Details updated successfully.',
             confirmButtonColor: '#2563eb',
             background: '#ffffff',
             color: '#1e293b',
             timer: 2000,
             showConfirmButton: false,
           });
          },
        });
    } else {
      this.departmentService.create(this.department).subscribe({
        next: () => {
          alert('Department created');

          this.router.navigate(['/manage-departments']);
        },

        error: (err) => {
          console.log(err);

          alert('Creation failed');
        },
      });
    }
  }
}
