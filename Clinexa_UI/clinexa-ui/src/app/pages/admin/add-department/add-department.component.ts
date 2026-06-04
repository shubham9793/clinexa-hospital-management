import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/service/department.service';



@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent {
  department = {
    name: '',
    description: '',
  };

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
  ) {}

  createDepartment() {
    this.departmentService.create(this.department).subscribe({
      next: () => {
        alert('Department created');

        this.router.navigate(['/manage-departments']);
      },

      error: (err) => {
        console.log(err);

        alert('Failed');
      },
    });
  }
}
