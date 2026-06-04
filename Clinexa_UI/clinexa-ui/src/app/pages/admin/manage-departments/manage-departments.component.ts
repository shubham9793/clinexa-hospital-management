import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/service/department.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage-departments',
  templateUrl: './manage-departments.component.html',
  styleUrls: ['./manage-departments.component.scss'],
})
export class ManageDepartmentsComponent implements OnInit {
  departments: any[] = [];
  searchText = '';

  selectedDepartment = '';

  selectedCategory = '';

  categories: any[] = [];

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  editDepartment(id: number) {
    this.router.navigate(['/edit-department', id]);
  }

   deleteDepartment(id: number) {
      Swal.fire({
        title: 'Delete Receptionist?',
  
        text: 'This action cannot be undone.',
  
        icon: 'warning',
  
        showCancelButton: true,
  
        confirmButtonColor: '#dc2626',
  
        cancelButtonColor: '#64748b',
  
        confirmButtonText: 'Yes, Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          this.departmentService.deleteDepartment(id).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Receptionist removed successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
              this.loadDepartments();
            },
          });
        }
      });
    }
}
