import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/service/department.service';




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

  constructor(private departmentService: DepartmentService) {}

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
}
