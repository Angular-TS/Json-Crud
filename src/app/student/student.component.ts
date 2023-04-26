import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Student } from '../models/student.model';
import { NgForm } from '@angular/forms';

import { HttpDataService } from '../services/http-data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  @ViewChild('studentForm', { static: false }) studentForm!: NgForm; 
  studentData!: Student;
  

  dataSource = new MatTableDataSource(); // Agregar la propiedad dataSource
  displayedColumns: string[] = ['id', 'name', 'age', 'mobile','email','address','actions']; // Agregar la propiedad displayedColumns

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isEditMode = false;

  @ViewChild(MatSort) sort!: MatSort;

  onSubmit(){
    if(this.studentForm.form.valid){
      console.log("valid");
      if(this.isEditMode){
        console.log("update");
        this.updateStudent();
        this.getAllStudents();
      } 
      else {
        console.log("create");
        this.addStudent();
        this.getAllStudents();
      }
      this.cancelEdit();
    }
    else {
      console.log("Invalid data");
    }
  }

  constructor(private httpDataService: HttpDataService) {
    this.studentData= { } as Student;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllStudents();
  }

  getAllStudents() {
    this.httpDataService.getList().subscribe(
      (response: any) => {
        this.dataSource.data = response;
      }
    );
  }

  editItem(element: any) {
    this.studentData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.studentForm.resetForm();
  }

  deleteItem(id: string) {
    this.httpDataService.deleteItem(id).subscribe(
      (response: any) => {
        this.dataSource.data = this.dataSource.data.filter(
          (s: any) => {
            return (s.id !== id) ? s : false;
          }
        );
      }
    );
    console.log(this.dataSource.data);
  }

  addStudent() {
    this.studentData.id = 0;
    this.httpDataService.createItem(this.studentData).subscribe(
      (response: any) => {
        this.dataSource.data.push({...response});
        this.dataSource.data = this.dataSource.data.map(
          (s: any) => { return 0; }
        );
      }
    );
  }

  updateStudent() {
    this.httpDataService.updateItem(this.studentData.id, this.studentData).subscribe(
      (response: any) => {
        this.dataSource.data = this.dataSource.data.map(
          (s: any) => {
            if(s.id == response.id) { s = response; }
            return 0;
          }
        );
      }
    );
  }
}
